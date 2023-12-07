const electron = require("electron");
const path = require("path");

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
  });
  mainWindow.maximize();
  mainWindow.loadURL(`file://${__dirname}/index.html`);

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
