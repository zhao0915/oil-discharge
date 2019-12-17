import { app, BrowserWindow, dialog, ipcMain } from 'electron'
const fs = require('fs')
const path = require('path')
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
// if (process.env.NODE_ENV !== 'development') {
//   global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
// }

let pluginName
switch (process.platform) {
  case 'win32':
    pluginName = 'pepflashplayer.dll'
    break
  case 'darwin':
    pluginName = './PepperFlashPlayer.plugin'
    break
  case 'linux':
    pluginName = 'libpepflashplayer.so'
    break
}
app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, pluginName))
const extensionType = {
  images: [
    { name: '.jpg', extensions: ['jpg'] },
    { name: '.png', extensions: ['png'] },
    { name: '.gif', extensions: ['gif'] },
  ],
  excel: [
    { name: '.xlsx', extensions: ['xlsx'] },
    { name: '.xls', extensions: ['xls'] },
  ]
}
ipcMain.on('saveDialog', (event, arg) => {
  dialog.showSaveDialog(win, {
    properties: ['openFile', 'openDirectory'],
    defaultPath: arg.fileName,
    filters: [
      ...extensionType[arg.fileType]
    ]
  }, filePath => {
    let dataBuffer = Buffer.from(arg.baseCode.split('base64,')[1], 'base64')
    let typeFlag = extensionType[arg.fileType].some(item => {
      if (filePath) {
        return item.extensions[0] === filePath.split('.')[1]
      } else {
        return false
      }
    })
    if (typeFlag) {
      fs.writeFile(filePath, dataBuffer, err => {
        if (err) {
          win.webContents.send('defeatedDialog')
        }
      })
      win.webContents.send('succeedDialog')
    } else if (filePath !== undefined) {
      dialog.showMessageBox({
        type: 'error',
        title: '系统提示',
        message: '系统检测出文件类型异常，请检查并重新选择或填写'
      })
    }
  })
})
let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    webviewTag: true,
    useContentSize: true,
    width: 1500,
    webPreferences: {
      plugins: true
    }
  })
  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

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
