const { Tray, Menu, nativeImage, app } = require('electron');
const path = require('path');
const fs = require('fs');
const { generateCrosshairPng } = require('./icon-generator');

let tray = null;

function setupTray(onTestBust) {
  const icoPath = path.join(__dirname, '../../assets/icons/icon.ico');
  const pngPath = path.join(__dirname, '../../assets/icons/tray-32.png');
  let icon = null;

  if (fs.existsSync(icoPath)) {
    icon = nativeImage.createFromPath(icoPath);
  } else if (fs.existsSync(pngPath)) {
    icon = nativeImage.createFromPath(pngPath).resize({ width: 16, height: 16 });
  } else {
    const pngBuffer = generateCrosshairPng(32);
    icon = nativeImage.createFromBuffer(pngBuffer).resize({ width: 16, height: 16 });
  }

  tray = new Tray(icon);
  tray.setToolTip('File Buster - Running in Background');

  const testFileOptions = [
    { label: '📄 PDF Document (.pdf)', file: 'Financial_Report.pdf' },
    { label: '📊 Excel Sheet (.xlsx)', file: 'Company_Budget.xlsx' },
    { label: '📝 Word Document (.docx)', file: 'Client_Contract.docx' },
    { label: '💻 Source Code (.js)', file: 'core_engine.js' },
    { label: '🖼️ Image (.png)', file: 'photo_highres.png' },
    { label: '🎬 Video (.mp4)', file: 'action_clip.mp4' },
    { label: '🎵 Audio (.mp3)', file: 'soundtrack.mp3' },
    { label: '📦 Archive (.zip)', file: 'backup_archive.zip' },
    { label: '⚡ Application (.exe)', file: 'setup_installer.exe' },
    { label: '📁 Folder', file: 'Project_Drafts', isDirectory: true }
  ];

  const testSubmenu = testFileOptions.map(opt => ({
    label: opt.label,
    click: () => {
      if (typeof onTestBust === 'function') {
        onTestBust(opt.file, opt.isDirectory || false);
      }
    }
  }));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'File Buster (Silent Background)',
      enabled: false
    },
    { type: 'separator' },
    {
      label: '💥 Quick Test Bust',
      click: () => {
        if (typeof onTestBust === 'function') {
          onTestBust('Deleted_File.pdf', false);
        }
      }
    },
    {
      label: '🎨 Test File Type Themes',
      submenu: testSubmenu
    },
    { type: 'separator' },
    {
      label: 'Exit',
      click: () => {
        app.isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(contextMenu);

  tray.on('double-click', () => {
    if (typeof onTestBust === 'function') {
      onTestBust('Quick_Target.pdf', false);
    }
  });

  return tray;
}

module.exports = { setupTray };
