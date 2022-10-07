const {
	app,
	BrowserWindow,
	ipcMain
} = require('electron')
const isDev = require('electron-is-dev')
const path = require("path")
let win = null
let child = null
const createWindow = () => {
	win = new BrowserWindow({
		width: 300,
		height: 210,
		minWidth: 300,
		frame: false,
		resizable: false, //禁止窗口大小缩放 
		transparent: true, //开启后双击不会放大窗口
		webPreferences: {
			//  增加这项配置可以实现跨域啊 不用再配置代理
			webSecurity: false,
			contextIsolation: false,
			nodeIntegration: true,
			enableRemoteModule: true,
			nodeIntegrationInWorker: true,
			nodeIntegrationInSubframes: true,
		}
	})

	if (isDev) {
		console.log('Running in development');
		win.loadURL('http://localhost:3000/')
	} else {
		console.log('Running in production');
		win.loadFile(path.join(__dirname, '../../dist/build/h5/index.html'))
	}
}
app.whenReady().then(() => {
	createWindow()
	require('./ipcmMain/index.js')
	require('./ipcmMain/tray.js')
})
//如果没有窗口打开则打开一个窗口 (macOS)
app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
//关闭所有窗口时退出应用 (Windows & Linux)
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})


// 获取可执行文件位置
const ex = process.execPath;

// 定义事件，渲染进程中直接使用

// 开启 开机自启动
ipcMain.on('openAutoStart', () => {
	console.log('updateExe', ex)
	app.setLoginItemSettings({
		openAtLogin: true,
		path: ex,
		args: []
	});
});
