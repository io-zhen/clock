import {
	defineConfig
} from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		open: false, //vite项目启动时不打开浏览器
	},
	plugins: [
		uni(),
	],
})
