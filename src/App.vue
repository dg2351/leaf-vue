<template>
	<div style="height: 100%">
		<a-config-provider :locale="locale">
			<div id="app">
				<router-view id="view"/>
			</div>
		</a-config-provider>
	</div>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
export default {
	name: 'App',
	data(){
		return {
			locale: zhCN,
		}
	},
	methods: {
		getCookie(name) {
			var nameEQ = name + "=";
			var ca = document.cookie.split(';');    //把cookie分割成组
			for(var i=0;i < ca.length;i++) {
				var c = ca[i];                      //取得字符串
				while (c.charAt(0)==' ') {          //判断一下字符串有没有前导空格
					c = c.substring(1,c.length);      //有的话，从第二位开始取
				}
				if (c.indexOf(nameEQ) == 0) {       //如果含有我们要的name
					return unescape(c.substring(nameEQ.length,c.length));    //解码并截取我们要值
				}
			}
			return false;
		},

		//清除cookie
		clearCookie(name) {
			this.setCookie(name, "", -1);
		},

		//设置cookie
		setCookie(name, value, seconds) {
			seconds = seconds || 0;   //seconds有值就直接赋值，没有为0，这个根php不一样。
			var expires = "";
			if (seconds != 0 ) {      //设置cookie生存时间
				var date = new Date();
				date.setTime(date.getTime()+(seconds*1000));
				expires = "; expires="+date.toGMTString();
			}
			document.cookie = name+"="+escape(value)+expires+"; path=/";   //转码并赋值
		},
	}
}
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;

	color: #2c3e50;
}
html, body, #app {
	height: 100%;
}
#view{
	position: absolute;
	height: 100%;
	width: 100%;
}
</style>
