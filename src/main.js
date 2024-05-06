import Vue from 'vue'
import App from './App.vue'
import AntDesign from 'ant-design-vue'
import store from './store/'
import router from './router'
import './middleware/permission'
import 'babel-polyfill'
import 'ant-design-vue/dist/antd.css';

import '@/assets/css/theme.less'
import '@/assets/css/base.css'
import '@/assets/css/commons.css'
import '@/assets/css/style.less'

import moment from 'moment'
moment.locale('zh-cn')
Vue.prototype.moment = moment;

import '@/plugins/utils/public';

import Storage from 'vue-ls';
Vue.use(Storage, {
	namespace: 'pro__', // key prefix
	name: 'ls', // name variable Vue.[ls] or this.[$ls],
	storage: 'local', // storage name session, local, memory
});

import Router from 'vue-router'
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

// 全局事件总线，创建一个vue实例，挂载到根实例
window.eventBus = new Vue();
Vue.use(AntDesign);

//敏感字符过滤
import '@/plugins/filters/index';
// 通用方法
import "@/plugins/utils/util";
import {TITLE} from "@/plugins/mutation-types";
document.title = TITLE;
// 子应用单独运行
new Vue({
    router,
    store,
    render: (h) => h(App)
}).$mount("#app");
