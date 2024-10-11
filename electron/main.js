const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const wallpaper = require('wallpaper');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../dist/index.html')}`
  );

  if (isDev) {
    win.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle('set-wallpaper', async (event, imagePath) => {
  try {
    await wallpaper.set(imagePath);
    return { success: true };
  } catch (error) {
    console.error('Error setting wallpaper:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-wallpaper', async () => {
  try {
    const currentWallpaper = await wallpaper.get();
    return { success: true, path: currentWallpaper };
  } catch (error) {
    console.error('Error getting wallpaper:', error);
    return { success: false, error: error.message };
  }
});