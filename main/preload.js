const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getRepos: async (payload) =>
    await ipcRenderer.invoke('async-get-tag', payload),
  getDir: async (payload) => await ipcRenderer.invoke('async-get-dir', payload),
  on: (channel, handler) => ipcRenderer.on(channel, handler),
  off: (channel, handler) => ipcRenderer.off(channel, handler),
});
