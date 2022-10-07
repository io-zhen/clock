const {
	app,
	net
} = require('electron')
//获取远程音乐数据
const getMusic = () => {
	const api =
		'https://3335c29d-efc5-467b-8d21-e75155c38be5.bspapp.com/unicloud-musicadmin-api-for-vue-electron/getRandomData'
	return new Promise((resolve, reject) => {
		app.whenReady().then(() => {
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
module.exports = {
	getMusic
}
