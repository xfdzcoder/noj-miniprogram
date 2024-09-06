<template>
	<view class="page">
		<button class="login-btn" @click="onLogin">微信登录</button>
	</view>
</template>

<script>
	import request from '@/utils/request.js';
	export default {
		data() {
			return {

			}
		},
		onLoad() {
			const userInfo = uni.getStorageSync('user-info')
			if (userInfo) {
				this.loginSuccess(userInfo)
			}
		},
		methods: {
			loginSuccess(userInfo) {
				if (userInfo.userInfoResp.nickname) {
					uni.navigateTo({
						url: '/pages/index/index'
					})
				} else {
					uni.navigateTo({
						url: '/pages/portal/guide/index'
					})
				}
			},
			onLogin() {
				uni.login({
						onlyAuthorize: true
					})
					.then(({
						code
					}) => {
						console.log('get code: ', code);
						request.get({
							url: '/user/auth/login',
							data: {
								code: code
							}
						}).then(res => {
							uni.setStorageSync('user-info', res.data)
							uni.showToast({
								title: '登录成功'
							})
							this.loginSuccess(res.data)
							console.log('login success: ', res);
						})
					})
			}
		}
	}
</script>

<style>
	.page {
		height: 100vh;
		width: 100vw;
		display: flex;
		align-items: center;
		justify-content: space-around;
	}

	.login-btn {
		width: 50vw;
		color: #fff;
		background-color: #07c160;
	}
</style>