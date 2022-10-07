// 设置应用是否开机自动启动
const {
	app
} = require('electron')

function setautoStart() {
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
module.exports = {
	setautoStart,
	closeautoStart
}
