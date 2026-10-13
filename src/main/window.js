const { BrowserWindow, screen } = require('electron');
const path = require('path');
const { nukePath } = require('./nuke');
const { getFileIconDataUrl } = require('./icon-helper');

let overlayWindow = null;

function createOverlayWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { bounds } = primaryDisplay;

  overlayWindow = new BrowserWindow({
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    show: false, // Hidden in background until a file is deleted
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    movable: false,
    hasShadow: false,
    focusable: false,
    fullscreenable: false,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  overlayWindow.setAlwaysOnTop(true, 'screen-saver');
  overlayWindow.setIgnoreMouseEvents(true, { forward: true });

  overlayWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  overlayWindow.on('closed', () => {
    overlayWindow = null;
  });

  return overlayWindow;
}

/**
 * Show the transparent overlay and play the cartoon bust right at the target file coordinates
 * @param {object} fileInfo { name, path, x, y, deleteAtBang }
 */
async function showBustAtPoint(fileInfo = {}) {
  try {
    console.log('[Window] showBustAtPoint called with:', JSON.stringify(fileInfo));
    if (!overlayWindow || overlayWindow.isDestroyed()) {
      createOverlayWindow();
    }

    const primaryDisplay = screen.getPrimaryDisplay();
    const defaultPt = {
      x: primaryDisplay.bounds.x + Math.round(primaryDisplay.bounds.width / 2),
      y: primaryDisplay.bounds.y + Math.round(primaryDisplay.bounds.height / 2)
    };

    let px = (fileInfo && typeof fileInfo.x === 'number' && !isNaN(fileInfo.x)) ? fileInfo.x : defaultPt.x;
    let py = (fileInfo && typeof fileInfo.y === 'number' && !isNaN(fileInfo.y)) ? fileInfo.y : defaultPt.y;
    px = Math.round(px);
    py = Math.round(py);
    const targetPoint = { x: px, y: py };
    console.log('[Window] Target point:', JSON.stringify(targetPoint));

    const currentDisplay = screen.getDisplayNearestPoint(targetPoint);
    console.log('[Window] Found display:', currentDisplay ? currentDisplay.id : 'null');
    const { bounds } = currentDisplay;

    overlayWindow.setBounds({
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height
    });
    console.log('[Window] Window bounds set successfully');

  // Compute local coordinates relative to this display
  let localX = Math.round(targetPoint.x - bounds.x);
  let localY = Math.round(targetPoint.y - bounds.y);

  // Clamp slightly so the file icon itself stays within visible screen edges
  localX = Math.max(65, Math.min(localX, bounds.width - 65));
  localY = Math.max(85, Math.min(localY, bounds.height - 85));

  const fromRight = localX < 250;
  console.log('[Window] Calling overlayWindow.showInactive()...');
  overlayWindow.showInactive();
  console.log('[Window] Shown inactive successfully');

  // Fetch authentic Windows shell icon for the file
  const iconUrl = await getFileIconDataUrl(fileInfo.path || fileInfo.name);

  const payload = {
    fileName: fileInfo.name || 'File',
    filePath: fileInfo.path || '',
    iconUrl,
    x: localX,
    y: localY,
    fromRight,
    deleteAtBang: Boolean(fileInfo.deleteAtBang)
  };

  if (overlayWindow.webContents.isLoading()) {
    overlayWindow.webContents.once('did-finish-load', () => {
      overlayWindow.webContents.send('play-cartoon-bust', payload);
    });
  } else {
    overlayWindow.webContents.send('play-cartoon-bust', payload);
  }

} catch (err) {
  console.log('[Window] showBustAtPoint ERROR:', err.stack || err.message);
}
}

function hideOverlay() {
  if (overlayWindow && !overlayWindow.isDestroyed()) {
    overlayWindow.hide();
  }
}

module.exports = {
  createOverlayWindow,
  showBustAtPoint,
  hideOverlay
};
