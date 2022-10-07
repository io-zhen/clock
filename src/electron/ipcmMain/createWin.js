// 创建窗口的方法
const {
	app,
	BrowserWindow,
} = require('electron')
const isDev = require('electron-is-dev')
const win = BrowserWindow.getFocusedWindow()
let childWin = null
let childWinID
const createWin = (options = {}) => {

	const {
		width = 300,
			height = 280,
			modal = true,
			parent = win,
			path = 'child1'
	} = options
	childWin = new BrowserWindow({
		parent,
		width,
		height,
		minWidth: 300,
		frame: false,
		modal, //设置模态窗口：打开子窗口时，父窗口不可点击使用
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
		console.log(app.getAppPath())
		childWin.loadURL(`http://localhost:3000/#/pages/${path}/${path}`)
	} else {
		childWin.loadURL(app.getAppPath() + `/dist/build/h5/index.html#/pages/${path}/${path}`)
	}


	const {
		x,
		y
	} = win.getBounds()
	childWin.setBounds({
		x: x + 50,
		y: y + 30
	})
	childWinID = childWin.id
	return childWin
}
const destroyWin = () => {
	// const wins =  BrowserWindow.getFocusedWindow()
	console.log(BrowserWindow.getFocusedWindow().id)
	BrowserWindow.getFocusedWindow().destroy()
}
module.exports = {
	createWin,
	destroyWin
}
