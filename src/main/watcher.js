const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');

class FileDeletionWatcher {
  constructor(options = {}) {
    this.watchedPaths = options.watchedPaths || [];
    this.onDeleteCallback = options.onDelete || (() => {});
    this.watcher = null;
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

    const validPaths = this.watchedPaths.filter(p => {
      try {
        return fs.existsSync(p);
      } catch {
        return false;
      }
    });

    if (validPaths.length === 0) {
      console.warn('[Watcher] No valid directories to watch.');
      return;
    }

    console.log('[Watcher] Monitoring directories:', validPaths);

    this.watcher = chokidar.watch(validPaths, {
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

    const handleDeletion = (filePath, type) => {
      if (this.isIgnored(filePath)) return;

      const now = Date.now();
      if (now - this.lastTriggerTime < this.throttleMs) {
        return; // Throttled rapid burst
      }
      this.lastTriggerTime = now;

      console.log(`[Watcher] Detected ${type} deletion:`, filePath);
      this.onDeleteCallback({
        path: filePath,
        name: path.basename(filePath),
        type
      });
    };

    this.watcher.on('unlink', filePath => handleDeletion(filePath, 'file'));
    this.watcher.on('unlinkDir', dirPath => handleDeletion(dirPath, 'directory'));

    this.watcher.on('error', error => {
      console.error('[Watcher] Error:', error);
    });
  }

  stop() {
    if (this.watcher) {
      try {
        this.watcher.close();
      } catch (err) {
        console.error('[Watcher] Error closing watcher:', err);
      }
      this.watcher = null;
    }
  }

  updatePaths(paths) {
    this.watchedPaths = paths;
    this.start();
  }
}

module.exports = { FileDeletionWatcher };
