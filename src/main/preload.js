const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    on(channel, func) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    },
    once(channel, func) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.once(channel, (event, ...args) => func(...args));
    },
    off(channel, listener) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.off(channel, listener);
    },
    send(channel, args) {
      ipcRenderer.send(channel, args);
    },
  },
});
