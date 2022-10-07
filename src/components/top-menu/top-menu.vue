<template>
	<view class="index-top rounded-top-lg p-1 flex justify-between align-center border-bottom text-white">
		<view class="flex align-center justify-center font-md">
			<text class="iconfont icon-naozhong-copy ml-1"></text>
			<text class="ml-2">{{title}}</text>
		</view>

		<view v-if="!isChild" class="flex align-center">
			<view @click="toIpcMain('showConfigWin')"
				class="top-icon noDrag rounded-circle p-1 iconfont icon-shezhi font-lg"></view>
			<view @click="toIpcMain('alwaysOnTop')" :class="[electronState.isAlwaysOnTop?'icon-tuding':'icon-tuding1']"
				class="top-icon noDrag rounded-circle p-1 iconfont font-lg"></view>
			<view @click="toIpcMain('minimize2')"
				class="top-icon noDrag rounded-circle p-1 iconfont icon-jian font mx-1  transform11"></view>
			<view @click="toIpcMain('closeApp')"
				class="top-icon noDrag rounded-circle mx-1 p-1 iconfont icon-cuohao  font transform12"></view>
		</view>
		<view v-else class="flex align-center">
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
	defineProps({
		title: {
			type: String,
			default: '可昕的闹钟'
		},
		isChild: {
			type: Boolean,
			default: false
		}
	})
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
