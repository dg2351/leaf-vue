<template>
	<a-modal v-drag-modal title="消息盒子" dialogClass="modal_a" width="600px"
			 :visible="visible" @cancel="closeModal" :footer="null">
		<a-row>
			<a-col :span="4">
				<div style="width:90%;padding: 5px;border: 1px solid #adc5fd;" class="">
					<a-button type="primary" size="small" @click="reconnect">退出</a-button>
				</div>
			</a-col>
			<a-col :span="20">
				<div id="msgbox" class="chatbox">
					<div class="textCenter" style="color: darkgray">——————无更多历史消息——————</div>
					<template v-for="(item,i) in contents">
						<div v-if="item.sender == user.userId">
							<div class="mT5 mB10">
								<div class="textRight">
									<div style="justify-content:end">
										<span style="color: darkgray">{{item.time}}</span>
										<span class="mL15 mR5">我</span>
									</div>
									<div class="chatboxCont mT5" v-html="item.body"/>
								</div>
								<!--<div class="w-36px h-36px bg-[#fff] rounded-100% ml-12px overflow-hidden">
									<img :src="imgurl" width="36" height="36">
								</div>-->
							</div>
						</div>
						<div v-else>
							<div class="mT5 mB10">
								<div class="textLeft">
									<div style="justify-content:end">
										<span class="mL5 mR15">{{item.senderName}}</span>
										<span style="color: darkgray">{{item.time}}</span>
									</div>
									<div class="chatboxCont mT5" v-html="item.body"/>
								</div>
								<!--<div class="w-36px h-36px bg-[#fff] rounded-100% ml-12px overflow-hidden">
									<img :src="imgurl" width="36" height="36">
								</div>-->
							</div>
						</div>
					</template>
				</div>
				<div class="mT5">
					<a-input-search v-model="message" :loading="loading" @search="submitMessage" @keyup.enter.native="submitMessage()">
						<a-button slot="enterButton" type="primary">发送</a-button>
					</a-input-search>
				</div>
			</a-col>
		</a-row>
	</a-modal>
</template>

<script>
import {mapState} from "vuex";
import moment from 'moment';
import websocket from "@/plugins/utils/WebSocket";

export default {
	name: "chat",
	data() {
		return {
			visible: false,
			loading: false,
			//
			message: "",
			contents:[],
		}
	},
	computed: {
		...mapState({
			user: state => state.appSetting.user,
		}),
	},
	mounted() {
	},
	methods:{
		openModal(){
			this.connect();
			this.visible = true;
		},
		closeModal(){
			this.reconnect();
			this.visible = false;
		},
		// 连接
		async connect(){
			let self_ = this;
			let {userId} = this.user;
			if(!userId){
				console.log("用户不存在")
				return;
			}
			websocket.Init(userId, function messageHandle(data){
				let msg = JSON.parse(data)
				switch (msg.flag) {
					case 'message':
						self_.contents.push(msg)
						break;
					default:
						console.log("未知消息类型")
				}
			});
		},
		// 断连
		async reconnect(){
			websocket.close();
		},
		// 发送
		async submitMessage(e){
			let self_ = this;
			if(self_.loading) return;
			self_.loading = true;
			let {message,user} = this;
			let {userId,fullname} = user;
			if(!message || !userId){
				return self_.loading = false;
			}
			// 构造参数
			let time = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
			// 入列
			let data = {
				sender:userId,
				senderName:fullname,
				reception:userId,// 接收人
				time:time,
				body:message,
				flag:"message",
			}
			self_.contents.push(data)
			// 置底
			let msgbox = document.getElementById("msgbox");
			msgbox.scrollTop = msgbox.scrollHeight;
			// 构造参数
			websocket.Send(data);
			// 置底
			msgbox.scrollTop = msgbox.scrollHeight;
			//
			self_.message = "";
			self_.loading = false;
		},
		//
		async connectChatbox(data){
			let self_ = this;
			//-----------
			var body=document.getElementById("body");
			function send(){
				var msg=document.getElementById("content").value;//获取输入框内容
				socket.send(msg);//发送消息
				reset();//清空输入框
				body.innerHTML+="<br/>我："+msg;
			}

			function reset(){
				document.getElementById("content").value="";
			}
			return;

			let pk = new Date().getTime();
			if(this.isCreat){
				Object.assign(params, {
					temperature: this.temperature,
					top_p: this.top_p,
				})
			}
			if(!params.type)
				Object.assign(params, {type: this.activeTab})
			console.log(params)
			const response = await fetch("/api/api-qyzhfwpt/qyzhfwpt/chatbox/completions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					'Authorization':'Bearer ' + token
				},
				body: JSON.stringify({...params, pk:pk}),
			})
			const encode = new TextDecoder("utf-8");//获取UTF8的解码
			const reader = response.body.getReader();//获取body的reader
			let obj = {label:"",user:0,time:moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),pk:pk};
			self_.contents.push(obj)
			while (true) {// 循环读取reponse中的内容
				const {done, value} = await reader.read();
				if (done) {
					break;
				}
				self_.contents[self_.contents.length - 1].label += encode.decode(value)
				// 置底
				let msgbox = document.getElementById("msgbox");
				msgbox.scrollTop = msgbox.scrollHeight;
			}
		},
	}
}
</script>

<style scoped lang="less">
.chatbox{
	padding: 10px;
	height: 300px;
	overflow-y: auto;
	font-size: 10px;
	background-color: #eeeaea;
	border: 1px solid #adc5fd;
	.chatboxCont{
		text-align: left;
		white-space: pre-wrap;
		background-color: rgba(255,255,255,0.6);
		border-radius: 15px;
		font-size: 14px;
		padding: 15px;
	}
}
</style>
