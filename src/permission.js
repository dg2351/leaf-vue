import Vue from 'vue'
import router from './router'
import store from './store'
import {ACCESS_TOKEN, menuKey} from '@/store/mutation-types';

router.beforeEach(async (to, from, next) => {
	console.log('permission:=', to, from)
	if (!localWhile(store(), to.name) && !(checkLogin())) {
		console.log(false)
		next({path: '/fwpt/home'})
	} else {
		console.log(true)
		next();
	}
})

function checkLogin() {
	return !!(Vue.ls.get(ACCESS_TOKEN) && Vue.ls.get("appUser") != null);
}

function localWhile(store, name) {
	// let routers = store.getters.getRoutes;
	// if(!routers)
	// 	return true;
	// 本地路由黑名单
	// let whileIndex = routers.filter(p=>String(p.white) === '0' && p[type] === name).map(m=>{return 1});
	// if(whileIndex.length > 0){
	// 	return false;
	// }
	return true;
}
