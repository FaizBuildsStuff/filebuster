const { app, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { createOverlayWindow, showBustAtPoint, hideOverlay } = require('./window');
const { setupTray } = require('./tray');
const { FileDeletionWatcher } = require('./watcher');
const { MouseTracker } = require('./mouse-tracker');
const { registerContextMenu, unregisterContextMenu } = require('./context-menu');
const { forwardToRunningInstance, startIpcServer } = require('./ipc-pipe');
const { nukePath } = require('./nuke');
const { getConfig } = require('./config');

let mainWindow = null;
let watcher = null;
let tray = null;
let mouseTracker = null;
let ipcServer = null;

const recentlyBusted = new Set();

function handleBustArgument(args) {
  if (!Array.isArray(args)) return;

  const bustIdx = args.findIndex(arg => arg === '--bust');
  if (bustIdx !== -1 && args[bustIdx + 1]) {
    const rawTarget = args[bustIdx + 1];
    const targetPath = rawTarget.replace(/^"|"$/g, '');

    if (fs.existsSync(targetPath)) {
      console.log('[App] Received --bust request for:', targetPath);
      const normalized = path.resolve(targetPath).toLowerCase();
      recentlyBusted.add(normalized);
      setTimeout(() => recentlyBusted.delete(normalized), 5000);

      const fileName = path.basename(targetPath);
      const pt = mouseTracker ? mouseTracker.getTargetFilePoint() : { x: 500, y: 300 };

      // File is STILL on desktop! Pop up the animation at the file, then delete at the BANG!
      showBustAtPoint({
        name: fileName,
        path: targetPath,
        x: pt.x,
        y: pt.y,
        deleteAtBang: false // Main process will handle deletion authoritatively at 650ms
      });

      // Detonate file deletion at the exact moment of the gun BANG (650ms)!
      setTimeout(async () => {
        console.log('[App] BANG! Nuking file now:', targetPath);
        await nukePath(targetPath);
      }, 650);
    }
  }
}

(async () => {
  // If another instance is running, forward arguments and exit immediately
  const forwarded = await forwardToRunningInstance(process.argv);
  if (forwarded) {
    app.quit();
    process.exit(0);
    return;
  }

  // Ensure single instance lock as backup
  const gotTheLock = app.requestSingleInstanceLock();
  if (!gotTheLock) {
    app.quit();
    process.exit(0);
    return;
  }

  app.whenReady().then(() => {
    const config = getConfig();

    // 1. Start IPC Server for receiving commands from Windows context menu
    ipcServer = startIpcServer((args) => {
      handleBustArgument(args);
    });

    // 2. Create Transparent Overlay Window (Hidden by default in background)
    mainWindow = createOverlayWindow();

    // 3. Start Win32 Mouse Click Tracker
    mouseTracker = new MouseTracker();
    mouseTracker.start();

    // 4. Register "Bust with File Buster 💥" in Windows Right-Click Menu
    registerContextMenu();

    // 5. Setup System Tray
    tray = setupTray((sampleFile = 'Confidential_Report.pdf', isDirectory = false) => {
      const pt = mouseTracker.getTargetFilePoint();
      showBustAtPoint({
        name: sampleFile,
        path: '',
        isDirectory: isDirectory,
        x: pt.x,
        y: pt.y,
        deleteAtBang: false
      });
    });

    // 6. Setup File Deletion Watcher (Desktop & Downloads)
    watcher = new FileDeletionWatcher({
      watchedPaths: config.get('watchedPaths'),
      onDelete: (data) => {
        if (data.path) {
          const normalized = path.resolve(data.path).toLowerCase();
          if (recentlyBusted.has(normalized)) {
            console.log(`[App] Ignoring watcher event for recently busted file: ${data.name}`);
            return;
          }
        }

        // Immediate 0ms trigger! Zero dead-time lag!
        const targetPoint = mouseTracker.getTargetFilePoint();
        console.log(`[App] Deletion detected for "${data.name}" at (${targetPoint.x}, ${targetPoint.y})`);

        showBustAtPoint({
          ...data,
          x: targetPoint.x,
          y: targetPoint.y,
          deleteAtBang: false
        });
      }
    });

    watcher.start();

    // 7. IPC Handlers
    ipcMain.handle('nuke-file', async (_event, filePath) => {
      console.log('[App] Executing BANG destruction for:', filePath);
      return await nukePath(filePath);
    });

    ipcMain.on('bust-finished', () => {
      hideOverlay();
    });

    // Handle any --bust passed on initial launch
    handleBustArgument(process.argv);
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin' && app.isQuitting) {
      app.quit();
    }
  });

  app.on('before-quit', () => {
    app.isQuitting = true;
    if (mouseTracker) mouseTracker.stop();
    if (watcher) watcher.stop();
    if (ipcServer) ipcServer.close();
  });
})();
