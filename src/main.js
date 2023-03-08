import Vue from 'vue'
import App from './App.vue'
import AntDesign from 'ant-design-vue'
import Storage from 'vue-ls';
import store from './store/'
import router from './router'
import './permission'
import 'babel-polyfill'
import 'ant-design-vue/dist/antd.css';

import '@/assets/css/theme.less'
import '@/assets/css/base.css'

import moment from 'moment'

moment.locale('zh-cn')
Vue.prototype.moment = moment;

var options = {
    namespace: 'pro__', // key prefix
    name: 'ls', // name variable Vue.[ls] or this.[$ls],
    storage: 'local', // storage name session, local, memory
};
Vue.use(Storage, options);
//引用
Vue.config.productionTip = false

import Router from 'vue-router'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

// 全局事件总线，创建一个vue实例，挂载到根实例
window.eventBus = new Vue();
Vue.use(AntDesign);

console.log(router)
// 子应用单独运行
new Vue({
    router,
    store,
    render: (h) => h(App)
}).$mount("#app");