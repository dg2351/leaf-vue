import Vue from 'vue'
import VueRouter from 'vue-router'
import {constantRouterMap} from "@/router/router";
Vue.use(VueRouter);
const path = process.env.VUE_APP_API_CTX_PATH;
export default new VueRouter({
    mode: "history",  // 一定要history
    base: path,
    scrollBehavior(to, from, savedPosition) {
        if (to.meta.keepAlive && from.meta.keepAlive) {// 返回滚动位置
            // return savedPosition
        }
        return {y: 0}
    },
    routes: constantRouterMap
})