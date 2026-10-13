const { execFile } = require('child_process');
const path = require('path');
const { app } = require('electron');

function getCommandString() {
  const electronExe = process.execPath;
  const isDev = !app.isPackaged;
  const appPath = path.resolve(__dirname, '../../');

  if (isDev) {
    return `"${electronExe}" "${appPath}" --bust "%1"`;
  }
  return `"${electronExe}" --bust "%1"`;
}

function runReg(args) {
  return new Promise((resolve, reject) => {
    execFile('reg.exe', args, (err, stdout, stderr) => {
      if (err) {
        reject(new Error(stderr || err.message));
      } else {
        resolve(stdout);
      }
    });
  });
}

async function registerContextMenu() {
  try {
    const cmd = getCommandString();

    // 1. Context menu for files
    await runReg([
      'add',
      'HKCU\\Software\\Classes\\*\\shell\\FileBuster',
      '/ve',
      '/d',
      'Bust with File Buster 💥',
      '/f'
    ]);

    await runReg([
      'add',
      'HKCU\\Software\\Classes\\*\\shell\\FileBuster\\command',
      '/ve',
      '/d',
      cmd,
      '/f'
    ]);

    // 2. Context menu for directories / folders
    await runReg([
      'add',
      'HKCU\\Software\\Classes\\Directory\\shell\\FileBuster',
      '/ve',
      '/d',
      'Bust with File Buster 💥',
      '/f'
    ]);

    await runReg([
      'add',
      'HKCU\\Software\\Classes\\Directory\\shell\\FileBuster\\command',
      '/ve',
      '/d',
      cmd,
      '/f'
    ]);

    console.log('[ContextMenu] "Bust with File Buster 💥" successfully registered in Windows Right-Click menu!');
    return true;
  } catch (err) {
    console.warn('[ContextMenu] Failed to register context menu:', err.message);
    return false;
  }
}

async function unregisterContextMenu() {
  try {
    await runReg(['delete', 'HKCU\\Software\\Classes\\*\\shell\\FileBuster', '/f']);
    await runReg(['delete', 'HKCU\\Software\\Classes\\Directory\\shell\\FileBuster', '/f']);
    console.log('[ContextMenu] Unregistered context menu from Windows.');
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = {
  registerContextMenu,
  unregisterContextMenu
};
