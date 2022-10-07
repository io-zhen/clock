<template>
	<view class="index-top rounded-top-lg p-1 flex justify-between align-center border-bottom text-white">
		<view class="flex align-center justify-center font-md">
			<text class="iconfont icon-naozhong-copy ml-1"></text>
			<text class="ml-2">闹铃选择</text>
		</view>

		<view class="flex align-center">
			<view @click="toIpcMain('close-child')"
				class="top-icon noDrag rounded-circle mx-1 p-1 iconfont icon-cuohao  font transform12"></view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive,
		onMounted
	} from "vue"
	const {
		ipcRenderer
	} = require('electron')
	let electronState = reactive({
		isAlwaysOnTop: false,
	})

	function toIpcMain(e) {
		ipcRenderer.send('action', e)
	}
	onMounted(() => {
		ipcRenderer.on('isAlwaysOnTop', (e, v) => {
			electronState.isAlwaysOnTop = v
		})
	})
</script>

<style scoped>

</style>
