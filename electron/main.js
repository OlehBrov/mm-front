import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { getToken, setToken, getRefreshToken, setRefreshToken } from './storeSettings.js';
import isDev from 'electron-is-dev'
// const isDev = require('electron-is-dev'); // Using electron-is-dev to distinguish between dev and production

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1080,
    height: 1920,
    fullscreen: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      sandbox: false
    },
  });
if (isDev) {
    // For development, load the React app from localhost
    win.loadURL('http://localhost:3000'); // Make sure your React app is running on this port
    win.webContents.openDevTools(); // Open DevTools to see the console
  } else {
    // For production, load the React build
  win.loadFile(path.join(__dirname, '..', 'build', 'index.html')); // Adjust the path to your build folder
   win.webContents.openDevTools(); // Open DevTools to see the console
  }

  
  win.setMenuBarVisibility(false);

}

app.whenReady().then(createWindow);

ipcMain.handle('get-token', () => getToken());
ipcMain.handle('set-token', (event, token) => setToken(token));
ipcMain.handle('get-refresh-token', () => getRefreshToken());
ipcMain.handle('set-refresh-token', (event, token) => setRefreshToken(token));

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

