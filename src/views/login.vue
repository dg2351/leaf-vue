<template>
	<div class="login_bg">
		<div class="main">
			<div class="login_form">
				<a-form id="formLogin" ref="formLogin" :form="form">
					<div class="login_logo">
						<h1>{{ctxTitle}}</h1>
					</div>
					<div class="login_box">
						<a-form-item>
							<a-input size="large" type="text" placeholder="请输入账户名" class="login_user" autocomplete="off"
								v-decorator="['username',{rules: [{ required: true, message: '请输入账户名' }], validateTrigger: 'change'}]">
							</a-input>
						</a-form-item>
						<a-form-item>
							<a-input size="large" type="password" placeholder="请输入密码" class="login_password" autocomplete="off"
									 v-decorator="['password',{rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}]">
							</a-input>
						</a-form-item>
						<!-- 验证码 -->
						<a-row v-if="codesrc" :gutter="8" style="width: 100%">
							<a-col class="gutter-row" :span="16">
								<a-form-item>
									<a-input size="large" type="text" class="login_code" placeholder="验证码"
											 v-decorator="['validCode', {rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur'}]">
									</a-input>
								</a-form-item>
							</a-col>
							<a-col class="gutter-row" :span="8">
								<img class="getCaptcha" :src="codesrc" @click="getImgCode" height="40" width="100%">
							</a-col>
						</a-row>
						<div v-if="false">
							<a-checkbox v-decorator="['rememberMe']">自动登录</a-checkbox>
						</div>
						<a-form-item style="margin-top:24px">
							<a-button class="login_btn" size="large" type="primary" htmlType="submit"
									  :loading="state.loginBtn" :disabled="state.loginBtn"
									  @click="handleSubmit">登录</a-button>
						</a-form-item>
					</div>
				</a-form>
			</div>
		</div>
	</div>
</template>

<script>
import Vue from "vue";
import uuid from "@/plugins/utils/uuid";
import {encode64} from "@/plugins/utils/util";
import {ACCESS_TOKEN, ACCESS_USER, TITLE} from "@/plugins/mutation-types";
import {LoginApi} from "@/plugins/utils/login";

export default {
	name: "login",
	data(){
		return{
			ctxTitle: TITLE,
			redirectUrl: "index",
			//
			deviceId: null,
			form: this.$form.createForm(this),
			codesrc: null,
			state: {
				time: 60,
				loginBtn: false,
				smsSendBtn: false
			},
		}
	},
	methods:{
		async getImgCode() {
			this.deviceId = uuid.getUuId(16, 32);
			// await LoginApi.imgcode(this.deviceId).then(res => {
			// 	const raw = res.data
			// 	this.codesrc = URL.createObjectURL(raw)
			// 	this.form.setFieldsValue({validCode: ''})
			// })
		},
		handleSubmit(e){
			const { form: {validateFields}, state, deviceId } = this
			//登录状态为true
			state.loginBtn = true
			const validateFieldsKey = ['username', 'password'];//, 'validCode'
			validateFields(validateFieldsKey, {force: true}, (err, values) => {
				if (err) {
					setTimeout(() => { state.loginBtn = false }, 600)
					return;
				}
				const loginParams = {...values}
				loginParams.deviceId = deviceId;
				loginParams.upe = encode64(`usernamegae${values.username}cendpasswordceq${values.password}cecjxeq${deviceId}`);
				delete loginParams.username;
				delete loginParams.password;
				LoginApi.login(loginParams).then(({success, message, data}) => {
					if (!success) {
						state.loginBtn = false;
						this.requestFailed(message)
						return;
					}
					this.handRedirect(data);
				})
			});
		},
		requestFailed(err) {
			this.$message.warning(err)
			this.getImgCode()
		},
		handRedirect(data){
			let {redirectUrl} = this;
			Vue.ls.set(ACCESS_TOKEN, data.token);
			Vue.ls.set(ACCESS_USER, data.user);
			this.$util.link(this).get(redirectUrl);
		},
	}
}
</script>

<style lang="less" scoped>
.login_bg {
	width: 100%;
	min-height: 100%;
	background: #f0f2f5 url(~@/assets/login_img/login_bg.png) no-repeat center fixed;
	background-size: cover;
	position: relative;
}

.wxspan {
	margin-top: 5px;
	border-right: 1px solid #666;
	line-height: 14px;
	padding-right: 26px;
}

.wxclict {
	color: #2ebc01;
	display: block;
	float: left;
	font-size: 25px;
	margin-right: 10px;
}

.bblict {
	color: #0089ff;
	display: block;
	float: left;
	font-size: 25px;
	margin-right: 10px;
}

.buttonobj {
	color: #666;
	line-height: 25px;
	margin-top: -5px;
}

.buttonobj span {
	display: block;
	float: left;
}

.main {
	display: flex;
	align-items: flex-start;
	position: fixed;
	left: 50%;
	top: 60%;
	transform: translate(-50%, -50%);
	z-index: 1;
	background: none !important;
	overflow: auto !important;
	width: auto !important;
	box-shadow: none !important;
	border-radius: 0 !important;
	padding: 0 !important;
}

.login_form {
	width: 464px;
	height: 540px;
	background: #FFFFFF;
	border-radius:4px;
	border: 1px solid #707070;
	padding-top: 45px;
	padding-left: 30px;
	padding-right: 30px;

}

.login_logo {
	width: 100%;

	margin-bottom: 20px;

	h1 {
		font-size: 30px;
		font-family: Microsoft YaHei-Bold, Microsoft YaHei;
		font-weight: bold;
		color: #000000;
	}
}

.login_user {
	background: url(~@/assets/login_img/user.png) no-repeat 12px center #F4F4F4 !important;
	padding-left: 46px;
	// box-shadow: 0 2px 5px #e2e7f0;
	border: 1px solid #E8E8E8 !important;

	height: 60px;
}

.login_password {
	background: url(~@/assets/login_img/password.png) no-repeat 12px center #F4F4F4 !important;
	padding-left: 46px;
	// box-shadow: 0 2px 5px #e2e7f0;
	border: 1px solid #E8E8E8 !important;

	height: 60px;
}

.login_code {
	background: #F4F4F4 !important;
	padding-left: 20px;
	// box-shadow: 0 2px 5px #e2e7f0;
	border: 1px solid #E8E8E8 !important;

	height: 60px;
}

.login_btn.ant-btn.ant-btn-primary {
	width: 100%;
	box-shadow: 0 2px 5px #e2e7f0;
	border-radius: 4px !important;

	background: linear-gradient(135deg, #3A94EF 0%, #0052D9 100%);

	height: 60px;
	line-height: 60px;
	&:hover,&:focus{
		background: linear-gradient(135deg, #0052D9 0%, #0052D9 100%);
	}
}

.jpaasbutton {
	width: 370px;
	overflow: hidden;
	margin: auto;
	margin-top: 16px;
	padding-bottom: 30px;
}

.imgwing img {
	width: 100%;
	height: 40px;
}

.ant-tabs-nav-wrap {
	border-bottom: 1px solid #eeeeee !important;
	// borderBottom: 'unset'
}

.user-layout-login {
	label {
		font-size: 14px;
	}

	.getCaptcha {
		display: block;
		width: 100%;
		height: 60px;
	}

	.forge-password {
		font-size: 14px;
	}

	button.login-button {
		padding: 0 10px;
		font-size: 16px;
		height: 40px;
		width: 100%;
	}

	.user-login-other {
		text-align: left;
		margin-top: 24px;
		line-height: 22px;

		.item-icon {
			font-size: 24px;
			color: rgba(0, 0, 0, 0.2);
			margin-left: 16px;
			vertical-align: middle;
			cursor: pointer;
			transition: color 0.3s;

			&:hover {
				color: #1890ff;
			}
		}

		.register {
			float: right;
		}
	}
}
</style>
