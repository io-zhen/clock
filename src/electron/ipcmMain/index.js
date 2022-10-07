const {
	app,
	BrowserWindow,
	ipcMain
} = require('electron')

const {
	createWin,
	destroyWin
} = require('./createWin.js')

const {
	getMusic
} = require('./http.js')
const win = BrowserWindow.getFocusedWindow()

const {
	setautoStart,
	closeautoStart
} = require('./changeAutoStart')
ipcMain.on('music_src', (e, data) => {
	win.webContents.send('changeMusic', data);
})
ipcMain.on('action', (e, method) => {
	switch (method) {
		case 'closeApp':
			win.hide()
			break;
		case 'alwaysOnTop': // alwaysOnTop窗口置顶 win.isAlwaysOnTop() 判断当前是否置顶  FullScreen
			win.isAlwaysOnTop() ? win.setAlwaysOnTop(false) : win.setAlwaysOnTop(true)
			break;
			// open-child  showConfigWin
		case 'open-changeMusic':
			createWin({
				path: 'changeMusic'
			})
			break;
		case 'showConfigWin':
			createWin({
				path: 'config',
			})
			break;
			// 获取音乐闹铃数据
		case 'get-music':
			console.log('I get')
			getMusic().then((data) => {
				// 必须使用toString()来显示数据，不然输出的是buffer
				// console.log(data.toString())
				// 这里再把字符窜转变成json对象，不然渲染层无法解析循环
				e.reply('musicData', JSON.parse(data.toString()))
			})
			break;
			// closeChild
		case 'close-child':
			destroyWin()
			break;
		case 'minimize':
			win.hide()
			break;
		case 'minimize2':
			win.minimize()
			e.reply('hasMax', false)
			break;
			// 设置自启动
		case 'changeAutoStart-open':
			setautoStart()
			break;
			// 关闭自启动
		case 'changeAutoStart-close':
			closeautoStart()
			break;
		default:
			break;
	}
})
// always-on-top-changed  改变置顶状态时触发
win.on('always-on-top-changed', function(e, isAlwaysOnTop) {
	console.log('置顶状态变化', isAlwaysOnTop)
	win.webContents.send('isAlwaysOnTop', isAlwaysOnTop);
})

// 取消默认原生的顶部右键菜单，并传递会渲染进程显示其他内容
win.hookWindowMessage(278, function(e) {
	console.log('hookWindowMessage')
	// 关闭默认右键菜单的同时，开启自定义菜单
	win.setEnabled(false); //窗口禁用
	setTimeout(() => {
		win.setEnabled(true); //窗口启用
	}, 100);
	return true;
})
