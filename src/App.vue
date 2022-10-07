<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
	}
</script>

<style>
	/*每个页面公共css */
	@import url('static/free.css');
	@import url('static/iconfont.css');

	html,
	body {
		margin: 0;
		padding: 0;
		/* overflow: hidden; */
		color: #3C4043;
		height: 100%;
		font-size: 24rpx;
	}

	.canDrag {
		-webkit-app-region: drag;
	}

	.noDrag {
		-webkit-app-region: no-drag;
	}

	.index-top {
		/* color: #3C4043; */
		/* height: 30px; */
		/* background-color: hotpink; */
		background: linear-gradient(#ff5bb0, #ef027d);
		/* width: 100%; */
		-webkit-app-region: drag;
		-webkit-user-select: none;
	}

	.top-icon {
		/* background-color: #3C4043; */
	}

	.top-icon:hover {
		background-color: lightpink;
	}

	.main-bg {
		background-color: #F3F4F6;
		color: royalblue;
	}

	.linear-gradient-text {
		font-family: Georgia, 'Times New Roman', Times, serif;
		font-weight: bolder;
		background: linear-gradient(to right, deeppink, hotpink, yellowgreen, royalblue, pink, skyblue, deeppink, pink);
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
		color: white;
		border-color: #dcdcdc;
		border-top-left-radius: 6px;
		border-top-right-radius: 6px;
		border-bottom-left-radius: 6px;
		border-bottom-right-radius: 6px;
		box-shadow: inset 0px 1px 0px 0px #ffffff;
		text-shadow: inset 0px 1px 0px #ffffff;
		background: linear-gradient(hotpink, pink);
	}

	.buttonClass:hover {
		cursor: pointer;
		background: linear-gradient(pink, hotpink);
	}

	::-webkit-scrollbar {
		width: 4px;
		height: 9px;
	}

	/* 滚动条整体宽度 */
	::-webkit-scrollbar-track {
		background-color: #eee;
	}

	/*滚动条背景色*/
	::-webkit-scrollbar-thumb {
		background-color: #E0E0E0;
		border-radius: 8px;
	}
</style>
