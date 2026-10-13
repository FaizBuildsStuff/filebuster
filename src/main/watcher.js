const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { execSync } = require('child_process');

function getUserSid() {
  try {
    const out = execSync('whoami /user', { encoding: 'utf8', windowsHide: true });
    const match = out.match(/S-1-5-[\d-]+/);
    if (match) return match[0];
  } catch {}

  // Fallback: check subfolders of C:\$Recycle.Bin
  try {
    const rootRb = 'C:\\$Recycle.Bin';
    if (fs.existsSync(rootRb)) {
      const entries = fs.readdirSync(rootRb);
      const sidCandidate = entries.find(e => /^S-1-5-21-/.test(e));
      if (sidCandidate) return sidCandidate;
    }
  } catch {}

  return null;
}

function getSystemDrives() {
  const drives = [];
  for (let c = 67; c <= 90; c++) { // 'C' to 'Z'
    const driveRoot = String.fromCharCode(c) + ':\\';
    try {
      if (fs.existsSync(driveRoot)) {
        drives.push(driveRoot);
      }
    } catch {}
  }
  return drives;
}

function parseRecycleBinIFile(filePath) {
  try {
    const buf = fs.readFileSync(filePath);
    if (buf.length < 28) return null;

    const version = buf.readBigInt64LE(0);
    let originalPath = '';

    if (version === 2n) {
      // Windows 10 & 11 (Version 2)
      const charCount = buf.readUInt32LE(24);
      const strBuf = buf.subarray(28, 28 + charCount * 2);
      originalPath = strBuf.toString('utf16le').replace(/\0+$/, '');
    } else if (version === 1n) {
      // Windows Vista / 7 / 8 (Version 1)
      const strBuf = buf.subarray(24, 24 + 520);
      originalPath = strBuf.toString('utf16le').replace(/\0+$/, '');
    }

    if (originalPath && originalPath.length > 2) {
      return {
        originalPath,
        fileName: path.basename(originalPath)
      };
    }
  } catch (err) {
    // Non-fatal if Windows is actively writing the file
    return null;
  }
  return null;
}

class FileDeletionWatcher {
  constructor(options = {}) {
    this.watchedPaths = options.watchedPaths || [];
    this.onDeleteCallback = options.onDelete || (() => {});
    this.userWatcher = null;
    this.recycleWatcher = null;
    this.lastTriggerTime = 0;
    this.throttleMs = 120; // Prevent event flood from freezing the UI
  }

  isIgnored(filePath) {
    if (!filePath) return true;
    const baseName = path.basename(filePath);

    // Filter Windows and common temporary / metadata files
    if (/^(desktop\.ini|thumbs\.db|\$RECYCLE\.BIN)$/i.test(baseName)) return true;
    if (/^~\$/.test(baseName)) return true; // Office temp files
    if (/\.(tmp|crdownload|part|download|swp|lock|bak|log)$/i.test(baseName)) return true;
    if (baseName.startsWith('.')) return true; // Hidden / dot files (.git, .vscode, etc)

    return false;
  }

  start() {
    this.stop();

    // 1. Gather all Primary User Profile Directories
    const homedir = os.homedir();
    const defaultUserDirs = [
      path.join(homedir, 'Desktop'),
      path.join(homedir, 'Downloads'),
      path.join(homedir, 'Documents'),
      path.join(homedir, 'Pictures'),
      path.join(homedir, 'Videos'),
      path.join(homedir, 'Music')
    ];

    const allUserPaths = Array.from(new Set([...this.watchedPaths, ...defaultUserDirs]));
    const validUserPaths = allUserPaths.filter(p => {
      try {
        return fs.existsSync(p);
      } catch {
        return false;
      }
    });

    // 2. Discover All Drive Roots and User Recycle Bin Directories
    const systemDrives = getSystemDrives();
    const userSid = getUserSid();
    const validRecyclePaths = [];

    if (userSid) {
      for (const drive of systemDrives) {
        const rbPath = path.join(drive, '$Recycle.Bin', userSid);
        try {
          if (fs.existsSync(rbPath)) {
            validRecyclePaths.push(rbPath);
          }
        } catch {}
      }
    }

    console.log(
      `[Watcher] Global System Monitoring Active: All Drives (${systemDrives.map(d => d.replace('\\', '')).join(', ')}) & User Areas (${validUserPaths.map(p => path.basename(p)).join(', ')})`
    );

    // 3. Watch User Directories for Direct Deletion / Shift+Delete
    if (validUserPaths.length > 0) {
      this.userWatcher = chokidar.watch(validUserPaths, {
        ignored: [
          /(^|[\/\\])\../, // Dotfiles
          /My (Music|Videos|Pictures)/i,
          /\$RECYCLE\.BIN/i
        ],
        ignoreInitial: true,
        depth: 1,
        persistent: true,
        awaitWriteFinish: false,
        usePolling: false
      });

      const handleUserDeletion = (filePath, type) => {
        if (this.isIgnored(filePath)) return;

        const now = Date.now();
        if (now - this.lastTriggerTime < this.throttleMs) return;
        this.lastTriggerTime = now;

        console.log(`[Watcher] Detected ${type} deletion in user folder:`, filePath);
        this.onDeleteCallback({
          path: filePath,
          name: path.basename(filePath),
          type
        });
      };

      this.userWatcher.on('unlink', filePath => handleUserDeletion(filePath, 'file'));
      this.userWatcher.on('unlinkDir', dirPath => handleUserDeletion(dirPath, 'directory'));
      this.userWatcher.on('error', err => console.warn('[Watcher] User watcher warning:', err.message));
    }

    // 4. Watch System-Wide Recycle Bins for Deletions Across ALL Drives (C:, D:, E:, F:, etc.)
    if (validRecyclePaths.length > 0) {
      this.recycleWatcher = chokidar.watch(validRecyclePaths, {
        ignoreInitial: true,
        depth: 0,
        persistent: true,
        awaitWriteFinish: false,
        usePolling: false
      });

      this.recycleWatcher.on('add', (filePath) => {
        const base = path.basename(filePath);
        // Only react to the $I metadata file which stores the original file path
        if (!base.startsWith('$I')) return;

        // Give Windows a brief moment to finish writing the 28+ byte header if needed
        const attemptParse = (attemptsLeft) => {
          const parsed = parseRecycleBinIFile(filePath);
          if (parsed && parsed.originalPath) {
            const now = Date.now();
            if (now - this.lastTriggerTime < this.throttleMs) return;
            this.lastTriggerTime = now;

            console.log(`[Watcher] Global deletion detected on drive: "${parsed.originalPath}"`);
            this.onDeleteCallback({
              path: parsed.originalPath,
              name: parsed.fileName,
              type: 'file'
            });
          } else if (attemptsLeft > 0) {
            setTimeout(() => attemptParse(attemptsLeft - 1), 35);
          }
        };

        attemptParse(3);
      });

      this.recycleWatcher.on('error', err => console.warn('[Watcher] Recycle watcher warning:', err.message));
    }
  }

  stop() {
    if (this.userWatcher) {
      try {
        this.userWatcher.close();
      } catch (err) {
        console.error('[Watcher] Error closing user watcher:', err);
      }
      this.userWatcher = null;
    }

    if (this.recycleWatcher) {
      try {
        this.recycleWatcher.close();
      } catch (err) {
        console.error('[Watcher] Error closing recycle watcher:', err);
      }
      this.recycleWatcher = null;
    }
  }

  updatePaths(paths) {
    this.watchedPaths = paths;
    this.start();
  }
}

module.exports = { FileDeletionWatcher };
