import Vue from 'vue'
import router from './router'
import store from './store'
import {ACCESS_TOKEN, LOGIN_URL} from '@/plugins/mutation-types';

// 白名单
const whiteList = ['login'];
router.beforeEach((to, from, next) => {
	if (Vue.ls.get(ACCESS_TOKEN) || true) {
		if (to.name === 'login') {
			next()
		}else {
			console.log('permission:=', to, from)
			if (from.path !== '/') {
				next()
			}
			if (store.state.appSetting.routers.length > 0) {
				next()
			} else {
				if (to.params && to.params.appKey) {
					//设置应用标识
					store.state.appSetting.appKey = to.params.appKey;
				} else {
					var ary = to.path.split("/");
					store.state.appSetting.appKey = ary[1];
				}
				store.dispatch('appSetting/buildRoutes').then((routers) => {
					// 把已获取到的路由菜单加入到路由表中
					for (var i = 0; i < routers.length; i++) {
						router.addRoute(routers[i]);
					}
					if (routers.length > 0) {
						if (to.path === '/') {
							router.push('/home')
						}else {
							next({...to, replace: true})
						}
					} else {
						this.$message.error("您还未分配权限，请联系管理员！");
						Vue.ls.remove(ACCESS_TOKEN)
						setTimeout(()=>{
							window.open(LOGIN_URL, '_self');
						},1000)
					}
				});
			}
		}
	}else {
		if (whiteList.includes(to.name)) {
			next()
		} else {
			window.open(LOGIN_URL, '_self');
		}
	}
})