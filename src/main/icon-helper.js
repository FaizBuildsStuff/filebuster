const { app, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

const iconCache = new Map();

/**
 * Get native Windows shell icon Data URL for a file or extension
 * @param {string} filePath Absolute path or filename
 * @returns {Promise<string|null>} Base64 Data URL of the icon
 */
async function getFileIconDataUrl(filePath) {
  if (!filePath) return null;

  const ext = path.extname(filePath).toLowerCase() || '.txt';

  // Check cache first
  if (iconCache.has(ext)) {
    return iconCache.get(ext);
  }

  try {
    let targetToInspect = filePath;

    // If file no longer exists, create a temporary zero-byte file with the same extension
    if (!fs.existsSync(filePath)) {
      const tempPath = path.join(os.tmpdir(), `_fb_icon_probe${ext}`);
      try {
        fs.writeFileSync(tempPath, '');
        targetToInspect = tempPath;
      } catch {}
    }

    const icon = await app.getFileIcon(targetToInspect, { size: 'large' });
    if (icon && !icon.isEmpty()) {
      const dataUrl = icon.toDataURL();
      iconCache.set(ext, dataUrl);
      return dataUrl;
    }
  } catch (err) {
    console.warn(`[IconHelper] Failed to load icon for ${filePath}:`, err.message);
  }

  return null;
}

module.exports = { getFileIconDataUrl };
