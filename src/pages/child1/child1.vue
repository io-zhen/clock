<template>
	<child-top-menu></child-top-menu>
	<view class="bg-white p-2 shadow rounded-bottom-lg">
		<!-- <audio :src="src" :poster="" :name="" :author="" :action="" controls></audio> -->
		<view class="font-lg" v-for="item in musicList.value" @click="play(item)">{{item.title}}</view>
	</view>
</template>

<script setup>
	const {
		ipcRenderer
	} = require('electron')
	import {
		ref,
		reactive,
		onMounted
	} from "vue"
	let musicList = reactive([])
	let src = ref()

	function play(item) {
		console.log(item)
		playMusic(item.music_src)
	}
	const requestTask = uni.request({
		url: 'https://www.example.com/request', //仅为示例，并非真实接口地址。
		success: function(res) {
			console.log(res.data);
		}
	})
	// 中断请求任务
	const innerAudioContext = uni.createInnerAudioContext();

	function playMusic(src) {
		innerAudioContext.autoplay = false;
		innerAudioContext.src = src
		innerAudioContext.onPlay(() => {
			console.log('开始播放');
		});
		// 自然停止destroy
		innerAudioContext.onEnded(() => {
			console.log('播放结束，实例已销毁');
			innerAudioContext.destroy()
		});
		innerAudioContext.onError((res) => {
			console.log(res.errMsg);
			console.log(res.errCode);
		})
		innerAudioContext.play()
	}
	onMounted(() => {
		ipcRenderer.send('action', 'get-music')
		ipcRenderer.on("musicData", (e, v) => {
			musicList.value = v.data
			// console.log(musicList.value)
		})
	})
</script>

<style>

</style>
