// 托盘
const {
	app,
	BrowserWindow,
	Menu,
	Tray,
	nativeImage
} = require('electron');
const path = require('path');
const win = BrowserWindow.getFocusedWindow()
const winId = win.id
const iconPath = path.join(__dirname, './../../static/clock.ico')
const tray = new Tray(nativeImage.createFromPath(iconPath)) //实例化一个tray对象，构造函数的唯一参数是需要在托盘中显示的图标url  
tray.setToolTip('可昕的闹钟') //鼠标移到托盘中应用程序的图标上时，显示的文本
tray.on('click', () => { //点击图标的响应事件，这里是切换主窗口的显示和隐藏
	BrowserWindow.fromId(winId).isVisible() ? BrowserWindow.fromId(winId).hide() : BrowserWindow.fromId(winId)
		.show()
})

tray.on('right-click', () => { //右键点击图标时，出现的菜单，通过Menu.buildFromTemplate定制，这里只包含退出程序的选项。
	const menuConfig = Menu.buildFromTemplate([{
			label: '重置缩放',
			click: () => {
				win.unmaximize()
				win.setSize(300, 210)
				win.center()
				// 底部任务栏闪烁 
				win.flashFrame(true)

			}
		},
		{
			label: '退出',
			click: () => {
				win.isVisible() ? app.quit() : win.destroy()
			}
		}
	])
	tray.popUpContextMenu(menuConfig)
})

// 实现任务栏闪烁图标
let count = 1;
let timer = setInterval(() => {
	count++
	if (count % 2 === 0) {
		tray.setImage(path.join(__dirname, './../../static/clock.ico'))
	} else {
		tray.setImage(path.join(__dirname, './../../static/clock2.ico'))
	}
}, 1000)
