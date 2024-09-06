<template>
	<view class="page">
		<view class="title">NOJ</view>
		<view class="form">
			<view class="form-item">
				<view class="form-item-label">
					昵称：
				</view>
				<view class="form-item-value">
					<input type="nickname" v-model="form.nickname" />
				</view>
			</view>
			<view class="form-item">
				<view class="form-item-label">
					邮箱：
				</view>
				<view class="form-item-value">
					<input type="text" v-model="form.email" />
				</view>
			</view>
			<view class="form-item">
				<view class="form-item-label">
					验证码：
				</view>
				<view class="form-item-value captcha-value">
					<input type="number" v-model="form.captcha" />
					<button class="captcha-btn" @click="onSendCaptcha" :disabled="captcha.disabled">
						{{captcha.text}}
					</button>
				</view>
			</view>
			<view class="form-item">
				<view class="form-item-label">
					密码：
				</view>
				<view class="form-item-value">
					<input password type="text" v-model="form.password" />
				</view>
			</view>
			<view class="form-item">
				<view class="form-item-label">
					确认密码：
				</view>
				<view class="form-item-value">
					<input password type="text" v-model="form.confirmPassword" />
				</view>
			</view>
			<view class="finish">
				<button type="primary" @click="submit">完成</button>
			</view>
		</view>
	</view>
</template>

<script>
	import request from '@/utils/request.js'
	
	export default {
		data() {
			return {
				form: {
					nickname: '',
					email: '',
					captcha: '',
					password: '',
					confirmPassword: ''
				},
				captcha: {
					text: '获取验证码',
					disabled: false,
					timeout: 5
				}
			}
		},
		methods: {
			onSendCaptcha() {
				if (! this.form.email) {
					uni.showToast({
						title: '请输入邮箱'
					})
				}
				this.captcha.disabled = true
				const timer = setInterval(() => {
					this.captcha.timeout--
					if (this.captcha.timeout > 0) {
						this.captcha.text = `${this.captcha.timeout} s`
						return
					}
					clearInterval(timer)
					this.captcha.timeout = 5
					this.captcha.disabled = false
					this.captcha.text = '获取验证码'
				}, 1000)
				console.log('form: ', this.form);
				request.get({
					url: '/user/auth/captcha',
					data: {
						email: this.form.email
					}
				}).then(res => {
					uni.showToast({
						title: '发送成功'
					})
				})
			},
			submit() {
				request.post({
					url: '/user/auth/register',
					data: {
						...this.form
					}
				}).then(res => {
					console.log('/user/auth/register: ', res);
					uni.navigateTo({
						url: '/pages/index/index'
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
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.title {
		font-size: 1.6rem;
		font-family: '黑体';
		font-weight: bold;
		margin-bottom: 30px;
	}

	.form {
		height: 70vh;
		width: 90vw;
		font-size: 1.3rem;
		font-family: '黑体';
	}

	.form-item {
		border: 1px solid red;
		margin: 0 20px 10px 20px;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.form-item-label {
		width: 40%;
		text-align: right;
	}

	.form-item-value {
		width: 60%;
	}

	.form-item-value input {
		background-color: #fff;
		border-radius: 20px;
		border: 1px solid black;
		padding: 5px;
	}

	.captcha-value input {
		width: 45%;
	}

	.captcha-value button {
		font-size: 10px;
		width: 45%;
		padding: 0;
		font-size: 10px;
		background-color: #00b26a;
		color: #fff;
	}

	.captcha-value {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: space-between;
	}

	.finish button {
		margin-top: 30px;
		width: 50vw;
		border-radius: 30px;
	}
</style>