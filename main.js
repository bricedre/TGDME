const { app, BrowserWindow } = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1600,
    height: 800
  })

  win.loadFile('index.html')
}


app.whenReady().then(() => {
  createWindow();
  console.log("ELECTRON ON")

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })

