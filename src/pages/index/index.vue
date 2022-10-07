<template>
	<!-- topMenu -->

	<view class="bg-white rounded-lg shadow position-relative" style="overflow: hidden;">

		<top-menu></top-menu>
		<vue-particles class="login-bg" color="#F72D96" :particleOpacity="0.5" :particlesNumber="150" shapeType="star"
			:particleSize="8" linesColor="#FDC0CC" :linesWidth="1" :lineLinked="true" :lineOpacity="0.5"
			:linesDistance="150" :moveSpeed="1" :hoverEffect="true" hoverMode="grab" :clickEffect="true"
			clickMode="repulse">
		</vue-particles>
		<view class="text-center text-dark p-1 flex flex-column justify-center">
			<view class="text-center flex flex-column">
				<view class=" pb-2 letterSpacing3 linear-gradient-text font-weight-bolder" style="font-size: 60px;">
					{{formatDuration(countSecond)}}
				</view>

			</view>
			<view class="bottom flex flex-column">
				<view class="flex align-center">
					<view class="myicon iconfont icon-notice"></view>
					<view style="color: pink;" class="mt-2 pl-2 flex align-center justify-center">
						当前铃声：{{music_name}}
					</view>
				</view>
				<view class="setView flex bg-white  ">
					<view class="flex align-center border rounded-lg mx-1" style="width: 100px;">
						<view class="border-right">
							<text class="p-1  font-sm iconfont icon-jian text-dark" @click="reduceSecond"></text>
						</view>
						<view class="font-md flex-1 p-0">{{setSecondStyle()}}</view>
						<view class="border-left">
							<text class="iconfont font-sm p-1 icon-jia text-dark " @click="addSecond"></text>
						</view>
					</view>
					<view class="flex ml-2 align-center">
						<text v-if="timerStatus==0" class="buttonClass mx-1" @click="timer2">设 定</text>
						<text v-if="timerStatus==1" class="buttonClass mx-1" @click="closeTimer(0)">关 闭</text>
						<text @click="toIpcMain('open-changeMusic')" class="ml-2 text-danger">换一首</text>
						<text @click="stopMusic" class="ml-2 text-danger">关闭音乐</text>
						<text @click="timer(5)" class="ml-2 text-danger">测试</text>
					</view>
				</view>
			</view>
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
	var schedule = require('node-schedule');
	let countSecond = ref(0) //倒计时时间
	let timerStatus = ref(0) //倒计时状态
	let clock = null //倒计时实例
	let setSecond = ref(5) //自定义闹钟时间

	function addSecond() {
		setSecond.value += 5
	}

	function reduceSecond() {
		if (setSecond.value > 5) setSecond.value -= 5
	}

	function setSecondStyle() {
		return setSecond.value.toFixed(0) + '分钟'
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
		if (innerAudioContext) innerAudioContext.destroy()
		if (!flag) {
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


	const innerAudioContext = uni.createInnerAudioContext();

	function playMusic() {
		innerAudioContext.autoplay = false;
		innerAudioContext.src = music_src.value
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

	function stopMusic() {
		innerAudioContext.stop()
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
	let autoSet = uni.getStorageSync('autoSet')
	let music_name = ref('默认')
	let music_src = ref('https://bjetxgzv.cdn.bspapp.com/VKCEYUGU-hello-uniapp/2cc220e0-c27a-11ea-9dfb-6da8e309e0d8.mp3')
	onMounted(() => {
		if (autoSet) {
			timer2()
		}

		ipcRenderer.on('changeMusic', (e, data) => {
			console.log(data)
			innerAudioContext.src = data.src
			music_name.value = data.title
			music_src.value = data.src
		})

	})
</script>

<style>
	.login-bg {
		width: 100%;
		height: 100%;
		position: absolute;
		z-index: 0;
	}

	.myicon {
		position: relative;
		top: 3px;
		font-size: 12px;
		color: pink;
	}

	.bottom {
		border-top: 1px solid #eee;
	}

	.bottom:hover .setView {
		opacity: .8;
		height: 100%;
		margin-top: 8px;
		margin-bottom: 5px;
	}

	.setView {
		opacity: 0;
		height: 0px;
		transition: all 0.4s ease-in-out;
	}
</style>
