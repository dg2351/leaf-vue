import Vue from 'vue'//引入vue
const directives = require.context('../filters', true, /(?<!index)\.js$/); //实现自动化导入 文件路径，是否遍历子目录，正则匹配
directives.keys().map(item => {//在名字中遍历
	const componentConfig = directives(item)//文件内容
	const name = item.replace('./', '').replace(".js", '')//文件名字替换掉./和后缀.js
	Vue.filter(name,(e)=>componentConfig.filter(e))//vue中注册自定义指令
})