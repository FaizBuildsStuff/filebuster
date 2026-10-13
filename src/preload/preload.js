const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('fileBuster', {
  /**
   * Listen for cartoon bust sequence trigger
   * @param {function(data: {fileName: string, filePath: string, x: number, y: number, fromRight: boolean, deleteAtBang: boolean}): void} callback
   */
  onPlayCartoonBust: (callback) => {
    const listener = (_event, data) => callback(data);
    ipcRenderer.on('play-cartoon-bust', listener);
    return () => ipcRenderer.removeListener('play-cartoon-bust', listener);
  },

  /**
   * Request immediate file deletion at the moment of the BANG
   * @param {string} filePath Absolute path
   */
  nukeFile: (filePath) => ipcRenderer.invoke('nuke-file', filePath),

  /**
   * Notify main process that the animation sequence finished so overlay can hide
   */
  notifyBustFinished: () => {
    ipcRenderer.send('bust-finished');
  }
});
