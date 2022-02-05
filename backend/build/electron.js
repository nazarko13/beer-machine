const os = require('os');
const path = require('path');
const isDev = require('electron-is-dev');
const { app, session, BrowserWindow } = require('electron');

// const reactDevToolsPath = path.join(
//   os.homedir(),
//   '/Library/Application Support/Google/Chrome/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.17.2_6'
// );

async function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    kiosk: true,
    webPreferences: {
      nodeIntegration: true,
      // experimentalFeatures: true,
    },
  });

  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  if (isDev) {
    // await session.defaultSession.loadExtension(reactDevToolsPath);
    win.webContents.openDevTools({ mode: 'detach' });
  }

  win.setFullScreen(!isDev);
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
