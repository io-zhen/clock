<template>
	<top-menu title="闹铃选择" :isChild="true"></top-menu>
	<view class="box bg-white p-2  shadow rounded-bottom-lg">
		<!-- <audio :src="src" :poster="" :name="" :author="" :action="" controls></audio> -->
		<view class="font flex align-center justify-between border-bottom p-1" v-for="item in musicList.value">
			<view>
				{{item.title}}
			</view>
			<view class="flex">
				<view class="ml-2 font buttonClass" @click="play(item)">
					播放
				</view>
				<view class="ml-2 font buttonClass" @click="changeMusic(item)">
					设定
				</view>
			</view>
		</view>
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

	function changeMusic(item) {
		console.log(item.title)
		// uni.$emit('music_src', item)
		ipcRenderer.send('music_src', {
			src: item.music_src,
			title: item.title
		})
	}
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
	.box {
		height: 210px;
		overflow-y: scroll;
		overflow-x: hidden;
	}
</style>
