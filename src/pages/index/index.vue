<template>
	<!-- topMenu -->
	<view class="bg-white rounded-lg shadow" style="overflow: hidden;">
		<top-menu></top-menu>
		<view class="text-center text-dark p-1 flex flex-column justify-center">
			<view class="flex justify-center border-bottom">
				<text class="pb-2 letterSpacing3 linear-gradient-text flex align-center font-weight-bolder"
					style="font-size: 60px;">
					{{formatDuration(countSecond)}}
				</text>
			</view>
			<view class="mt-3 mb-1 bg-white text-light-black flex  ">
				<text class="flex align-center mx-1 font-lg font-weight-bold">闹钟设定:</text>
				<view class="flex align-center border rounded-lg mx-1" style="width: 100px;">
					<view class=" p-1 font-sm text-white  border-right">
						<text class="iconfont icon-jian text-dark opacity3" @click="reduceSecond"></text>
					</view>
					<view class="font-md  flex-1">{{setSecondStyle()}}</view>
					<view class="p-1 font-sm text-white  border-left">
						<text class="iconfont icon-jia text-dark opacity3" @click="addSecond"></text>
					</view>
				</view>
				<view class="flex ml-2">
					<text class="buttonClass mx-1" @click="timer2">确 定</text>
					<text class="buttonClass mx-1" @click="closeTimer(0)">关 闭</text>
				</view>
			</view>
			<view class="mt-3 mb-1 bg-white text-light-black flex align-center justify-between ">
				<view class=""><text class="buttonClass mx-1" @click="toIpcMain('open-child')">选择闹铃</text></view>
				<view class="flex align-center justify-end">
					<text class="mr-0 font-md">自启动：</text>
					<switch class="m-0" color="#ff5bb0" style="transform:scale(0.5)" @change="changeAutoStart" />
				</view>
				<!-- <text class="buttonClass mx-1" @click="toIpcMain('changeAutoStart-open')">自启动</text>
					<text class="buttonClass mx-1" @click="toIpcMain('changeAutoStart-close')">关闭自启动</text> -->
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
	var schedule = require('node-schedule');
	let countSecond = ref(0) //倒计时时间
	let timerStatus = ref(0) //倒计时状态
	let clock = null //倒计时实例
	let setSecond = ref(5) //自定义闹钟时间

	function changeAutoStart(e) {
		const status = e.detail.value
		if (status) {
			toIpcMain('changeAutoStart-open')
		} else {
			toIpcMain('changeAutoStart-close')
		}
	}

	function addSecond() {
		setSecond.value += 5
	}

	function reduceSecond() {
		if (setSecond.value > 5) setSecond.value -= 5
	}

	function setSecondStyle() {
		return setSecond.value + '分钟'
	}
	const timer = (sec) => {
		setSecond.value = sec / 60
		timer2()
	}

	const timer2 = () => {
		//这个例子中，设定开始和结束时间用于倒计时。
		if (timerStatus.value) {
			return uni.showToast({
				title: '计时器已存在',
				icon: "none"
			})
		}
		if (innerAudioContext) innerAudioContext.destroy()
		countSecond.value = setSecond.value * 60
		console.log(countSecond.value)
		timerStatus.value = 1
		let startTime = new Date(Date.now());
		let endTime = new Date(startTime.getTime() + countSecond.value * 1000);
		clock = schedule.scheduleJob({
			start: startTime,
			end: endTime,
			rule: '* * * * * *'
		}, function() {
			countSecond.value -= 1
			uni.setStorageSync('countSecond', countSecond.value)
			if (countSecond.value == 0) {
				console.log('到了喝茶时间!');
				closeTimer()
			}

		});
	}

	function closeTimer(flag = 1) {
		clock.cancel();
		schedule.cancelJob()
		clock = null
		countSecond.value = 0
		timerStatus.value = 0

		uni.removeStorageSync('countSecond')
		if (!flag) {
			if (innerAudioContext) innerAudioContext.destroy()
			return uni.showToast({
				title: "已取消！",
				icon: "none"
			})
		}
		playMusic()
		uni.showToast({
			title: "闹钟时间到！",
			icon: "none"
		})
	}

	function checkClock() {
		const storageClock = uni.getStorageSync('countSecond')
		if (storageClock) {
			countSecond.value = storageClock
		}
	}

	const innerAudioContext = uni.createInnerAudioContext();

	function playMusic() {
		innerAudioContext.autoplay = false;
		innerAudioContext.src =
			'https://bjetxgzv.cdn.bspapp.com/VKCEYUGU-hello-uniapp/2cc220e0-c27a-11ea-9dfb-6da8e309e0d8.mp3';
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
	//格式化播放时间为00:00：00
	let formatDuration = (seconds) => {
		seconds = Math.round(seconds) //首先去掉小数
		let hour = Math.floor(seconds / 3600) >= 10 ? Math.floor(seconds / 3600) : '0' + Math.floor(seconds /
			3600);
		seconds -= 3600 * hour;
		let min = Math.floor(seconds / 60) >= 10 ? Math.floor(seconds / 60) : '0' + Math.floor(seconds / 60);
		seconds -= 60 * min;
		let sec = seconds >= 10 ? Math.round(seconds) : '0' + Math.round(seconds);
		if (hour == '00') {
			return min + ':' + sec
		}
		return hour + ':' + min + ':' + sec;
	}

	function toIpcMain(e) {
		ipcRenderer.send('action', e)
	}
	onMounted(() => {})
</script>

<style>
	.my-container {
		border-radius: 25px;
		background: #ffffff;
		box-shadow: 5px 5px 9px #e8e8e8,
			-5px -5px 9px #ffffff;
	}

	.linear-gradient-text {
		font-family: Georgia, 'Times New Roman', Times, serif;
		font-weight: bolder;
		background: linear-gradient(to right, hotpink, pink);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}

	.buttonClass {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 12px;
		/* width: 45px; */
		padding: 0px 6px;
		height: 25px;
		border-width: 1px;
		color: #666666;
		border-color: #dcdcdc;
		border-top-left-radius: 6px;
		border-top-right-radius: 6px;
		border-bottom-left-radius: 6px;
		border-bottom-right-radius: 6px;
		box-shadow: inset 0px 1px 0px 0px #ffffff;
		text-shadow: inset 0px 1px 0px #ffffff;
		background: linear-gradient(#f9f9f9, #e9e9e9);
	}

	.buttonClass:hover {
		cursor: pointer;
		background: linear-gradient(#e9e9e9, #f9f9f9);
	}
</style>
