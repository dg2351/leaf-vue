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
