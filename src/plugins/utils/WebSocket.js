let url = `ws://${window.location.host}:18083/leaf/websocket/api/`
let ws;
let clientId = null//客户端id

var websocket = {
	Send:function(data){
		let msg= JSON.stringify(data)
		console.log("发送消息："+msg)
		ws.send(msg)
	},
	Init: function(userId, messageHandle) {
		clientId = userId
		if ("WebSocket" in window) {
			ws = new WebSocket(url + clientId);
		} else if ("MozWebSocket" in window) {
			ws = new MozWebSocket(url + clientId);
		} else {
			console.log("您的浏览器不支持 WebSocket!");
			return;
		}
		ws.onmessage = function(e) {
			heartCheck.start()
			if(e.data=='HeartBeat') return;//心跳消息不做处理
			messageHandle(e.data)
		}
		ws.onclose = function() {
			console.log("连接关闭")
		}
		ws.onopen = function() {
			console.log("连接成功")
			heartCheck.start();
		}
		ws.onerror = function(e) {
			console.error("数据传输发生错误", e);
		}
	},
	close:function(){
		ws.close();
	},
	getWebSocket(){
		return ws;
	},
	getStatus() {
		if (ws.readyState == 0) {
			return "未连接";
		} else if (ws.readyState == 1) {
			return "已连接";
		} else if (ws.readyState == 2) {
			return "连接正在关闭";
		} else if (ws.readyState == 3) {
			return "连接已关闭";
		}
	}
}

export default websocket;

//心跳检测
let heartCheck = {
	timeout: 1000 * 60 * 3,
	timeoutObj: null,
	serverTimeoutObj: null,
	start: function(){
		console.log('开始心跳检测');
		var self = this;
		self.timeoutObj && clearTimeout(self.timeoutObj);
		self.serverTimeoutObj && clearTimeout(self.serverTimeoutObj);
		self.timeoutObj = setTimeout(function(){
			//这里发送一个心跳，后端收到后，返回一个心跳消息，
			//onmessage拿到返回的心跳就说明连接正常
			console.log('心跳检测...');
			ws.send("HeartBeat");
			self.serverTimeoutObj = setTimeout(function() {
				if(ws.readyState!=1){
					websocket.close();
				}
			}, self.timeout);
		}, self.timeout)
	}
}

