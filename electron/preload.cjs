const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    getToken: () => ipcRenderer.invoke('get-token'),
    setToken: (token) => ipcRenderer.invoke('set-token', token),
    getRefreshToken: () => ipcRenderer.invoke('get-refresh-token'),
    setRefreshToken: (token) => ipcRenderer.invoke('set-refresh-token', token),
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args), 
  },
});
