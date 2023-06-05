import Vue from 'vue'
import Vuex from 'vuex'
import {CODE} from "@/plugins/mutation-types";
import {getRouters} from "@/plugins/utils/routerUtil";
Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		themeStyle: "dark",
		appSetting: {
			user: {}, //当前用户
			isLogin: false,
			location: null,
			menus: [],//所有菜单
			// menuMap: {},
			routers: [], //路由
		},
	},
	mutations: {
		setUser: (state, user) => {
			state.appSetting.user = user;
			state.appSetting.isLogin = !!user.userid;
		},
		setIsLogin: (state) => {
			state.appSetting.isLogin = true;
		},
		setLocation: (state, data) => {
			state.appSetting.location = data;
		},
		setMenus: (state, menus) => {
			state.appSetting.menus = menus;
		},
		// setMenuMap: (state, menuMap) => {
		// 	state.appSetting.menuMap = menuMap;
		// },
		setRouters: (state, routers) => {
			state.appSetting.routers = routers;
		},
	},
	actions: {
		/**
		 * 构建路由
		 * @param commit
		 * @param data
		 * @returns {Promise<any>}
		 * @constructor
		 */
		buildRoutes({commit}) {
			let appKey = CODE;
			return new Promise(resolve => {
				getRouters(appKey).then(res => {
					let routers = res.routers;
					if (routers.length > 0) {
						routers[0].children.push({path: 'index', name: 'home-index', component: () => import('@/views/index'), hidden: true})
					}
					commit('setUser', res.user);
					commit('setMenus', res.menus);
					// commit('setMenuMap', res.menuMap);
					commit('setRouters', routers);
					resolve(routers)
				})
			})
		},
	}
})
