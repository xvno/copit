import { app, BrowserWindow, ipcMain } from 'electron';
const WIDTH = 1000;
const HEIGHT = 26;
const MAX_HEIGHT = 600;
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path')
        .join(__dirname, '/static')
        .replace(/\\/g, '\\\\');
} else {
    // BrowserWindow.addDevToolsExtension("/Users/zhang/Library/Application Support/Google/Chrome/Default/Extensions/nhdogjmejiglipccpnnnanhbledajbpd/5.3.3_0");
}

let mainWindow;
const winURL =
    process.env.NODE_ENV === 'development'
        ? `http://localhost:9080`
        : `file://${__dirname}/index.html`;

function createWindow() {
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        height: HEIGHT,
        width: WIDTH,
        useContentSize: true,
        frame: false,
        transparent: true
    });
    // mainWindow.setAlwaysOnTop();
    mainWindow.setAlwaysOnTop(true, 'pop-up-menu');

    mainWindow.loadURL(winURL);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

// commands from FE
ipcMain.on('USER', (event, args) => {
    if (args === 'CLOSE') {
        app.quit();
    }
});

ipcMain.on('RESIZE', (event, args) => {
    let [width, height] = args.split(',');
    console.log(width, height);
    height = +height;
    height = height > MAX_HEIGHT ? MAX_HEIGHT : height;
    mainWindow.setSize(WIDTH, height);
});
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
