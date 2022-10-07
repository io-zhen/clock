const {
	app,
	BrowserWindow,
	screen,
	ipcMain
} = require('electron')
const isDev = require('electron-is-dev')
const {
	close
} = require('fs')
const win = BrowserWindow.getFocusedWindow()
let child = null
const createChild = () => {
	child = new BrowserWindow({
		parent: win,
		width: 300,
		height: 280,
		minWidth: 300,
		frame: false,
		show: false,
		modal: true, //设置模态窗口：打开子窗口时，父窗口不可点击使用
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
		child.loadURL('http://localhost:3000/#/pages/child1/child1')
	} else {
		child.loadURL(app.getAppPath() + '/dist/build/h5/index.html#/pages/child1/child1')
	}


	const {
		x,
		y
	} = win.getBounds()
	child.setBounds({
		x: x + 50,
		y: y + 30
	})
}

//获取远程音乐数据
const getMusic = () => {
	const api =
		'https://3335c29d-efc5-467b-8d21-e75155c38be5.bspapp.com/unicloud-musicadmin-api-for-vue-electron/getRandomData'
	return new Promise((resolve, reject) => {
		app.whenReady().then(() => {
			const {
				net
			} = require('electron')
			const request = net.request(api)
			request.on('response', (response) => {
				// console.log(`STATUS: ${response.statusCode}`)
				// console.log(`HEADERS: ${JSON.stringify(response.headers)}`)
				response.on('data', (chunk) => {
					// console.log(`BODY: ${chunk}`)
					return resolve(chunk)
				})
				response.on('end', () => {
					// console.log('No more data in response.')
				})
			})
			request.end()
		})
	})

}

const path = require('path')

function setautoStart() {
	const appFolder = path.dirname(process.execPath)
	const updateExe = path.resolve(appFolder, '..', 'Update.exe')
	const exeName = path.basename(process.execPath)
	console.log('appFolder:' + appFolder)
	console.log('updateExe:' + updateExe)
	console.log('exeName:' + process.execPath)
	app.setLoginItemSettings({
		openAtLogin: true,
		path: process.execPath,
		args: []
	});
}

function closeautoStart() {
	console.log('关闭自启动')
	app.setLoginItemSettings({
		openAtLogin: false,
		path: process.execPath,
		args: []
	});
}


ipcMain.on('action', (e, method) => {
	switch (method) {
		case 'closeApp':
			win.hide()
			break;
		case 'alwaysOnTop': // alwaysOnTop窗口置顶 win.isAlwaysOnTop() 判断当前是否置顶  FullScreen
			win.isAlwaysOnTop() ? win.setAlwaysOnTop(false) : win.setAlwaysOnTop(true)
			break;
		case 'FullScreen': // FullScreen全屏操作  win.isSimpleFullScreen() 判断当前是否全屏注意不是最大化  
			win.isSimpleFullScreen() ? win.setSimpleFullScreen(false) : win.setSimpleFullScreen(true)
			break;
			// open-child
		case 'open-child':
			createChild()
			child.show()
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
			child.destroy()
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


win.on('maximize', function() {
	console.log('最大化了')
	win.webContents.send('hasMax', true);
})
win.on('unmaximize', function() {
	console.log('没有最大化')
	win.webContents.send('hasMax', false);
})
// always-on-top-changed  改变置顶状态时触发
win.on('always-on-top-changed', function(e, isAlwaysOnTop) {
	console.log('置顶状态变化', isAlwaysOnTop)
	win.webContents.send('isAlwaysOnTop', isAlwaysOnTop);
})
// 事件: 'enter-full-screen'
// 窗口进入全屏状态时触发
win.on('enter-full-screen', function(e, isFullScreen) {
	console.log('全屏状态变化', isFullScreen)
	win.webContents.send('isFullScreen', true);
})
// 事件: 'leave-full-screen'
// 窗口离开全屏状态时触发 
win.on('leave-full-screen', function(e, isFullScreen) {
	console.log('全屏状态变化', isFullScreen)
	win.webContents.send('isFullScreen', false);
})
win.hookWindowMessage(0x202, function(e) {
	console.log('hook：0x202')
})

// 取消默认原生的顶部右键菜单，并传递会渲染进程显示其他内容
win.hookWindowMessage(278, function(e) {
	console.log('hookWindowMessage')
	// 获取当前鼠标的坐标
	const winPosition = win.getPosition();
	const cursorPosition = screen.getCursorScreenPoint();
	let x = cursorPosition.x - winPosition[0];
	let y = cursorPosition.y - winPosition[1];
	const mouseDip = {
		x,
		y
	}
	// 关闭默认右键菜单的同时，开启自定义菜单
	win.webContents.send('showContextmenu', mouseDip);
	win.setEnabled(false); //窗口禁用
	setTimeout(() => {
		win.setEnabled(true); //窗口启用
	}, 100);
	return true;
})
