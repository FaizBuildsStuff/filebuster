const fs = require('fs').promises;
const path = require('path');

/**
 * Permanently delete a file or directory
 * @param {string} targetPath Absolute path to file or directory
 * @returns {Promise<{success: boolean, path: string, error?: string}>}
 */
async function nukePath(targetPath) {
  if (!targetPath || typeof targetPath !== 'string') {
    return { success: false, path: targetPath, error: 'Invalid path' };
  }

  try {
    const stats = await fs.stat(targetPath);
    if (stats.isDirectory()) {
      await fs.rm(targetPath, { recursive: true, force: true });
    } else {
      await fs.unlink(targetPath);
    }
    console.log(`[Nuke] Successfully deleted: ${targetPath}`);
    return { success: true, path: targetPath, name: path.basename(targetPath) };
  } catch (err) {
    console.error(`[Nuke] Failed to delete ${targetPath}:`, err.message);
    return { success: false, path: targetPath, error: err.message };
  }
}

module.exports = { nukePath };
