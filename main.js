const electron = require("electron");
const path = require("path");

const remoteMain = require('@electron/remote/main');
remoteMain.initialize();

const { app, BrowserWindow } = electron;

// require("electron-reload")(__dirname, {
//   electron: path.join(__dirname, "node_modules", ".bin", "electron"),
// });

const createWindow = () => {
  let mainWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    icon: path.join(__dirname, "assets/uiIcons/home.png"),
  });
  mainWindow.maximize();
  // mainWindow.removeMenu();
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  remoteMain.enable(mainWindow.webContents);

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
};

app.on("ready", () => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
