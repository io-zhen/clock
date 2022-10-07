<template>
	<top-menu title="系统设置" :isChild="true"></top-menu>
	<view class="bg-white px-2 p-1 flex flex-column shadow">
		<view class="flex align-center">
			<text class="mr-0 font-md">开机自启动：</text>
			<switch :checked="AutoStartValue" class="m-0" color="#ff5bb0" style="transform:scale(0.5)"
				@change="changeAutoStart" />
		</view>
		<view class="flex align-center">
			<text class="mr-0 font-md">启动自动设置5分钟闹铃：</text>
			<switch :checked="autoSetValue" class="m-0" color="#ff5bb0" style="transform:scale(0.5)"
				@change="autoSet" />
		</view>
	</view>
</template>

<script setup>
	const {
		ipcRenderer
	} = require('electron')

	function toIpcMain(e) {
		ipcRenderer.send('action', e)
	}
	// 自动启动程序
	function changeAutoStart(e) {
		const status = e.detail.value
		if (status) {
			toIpcMain('changeAutoStart-open')
			uni.setStorageSync('AutoStart', true)
		} else {
			toIpcMain('changeAutoStart-close')
			uni.setStorageSync('AutoStart', false)
		}
	}
	// AutoStart系统自动启动程序
	let AutoStartValue = uni.getStorageSync('AutoStart') || false

	// autoSet
	let autoSetValue = uni.getStorageSync('autoSet') || false
	// 自动开启闹钟
	function autoSet(e) {
		const status = e.detail.value
		if (status) {
			uni.setStorageSync('autoSet', true)
		} else {
			uni.setStorageSync('autoSet', false)
		}
	}
</script>

<style>

</style>
