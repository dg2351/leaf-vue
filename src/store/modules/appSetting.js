import {getRouters} from '@/plugins/utils/routerUtil'
import {CODE} from '@/plugins/mutation-types'

const appSetting = {
	namespaced: true,
	state: {
		user: {}, //当前用户
		appKey: "",//应用标识
		menus: [],//所有菜单
		menuMap: {},
		routers: [], //路由
	},
	mutations: {
		setUser: (state, user) => {
			state.user = user;
		},
		setAppKey: (state, appKey) => {
			state.appKey = appKey;
		},
		setMenus: (state, menus) => {
			state.menus = menus;
		},
		setMenuMap: (state, menuMap) => {
			state.menuMap = menuMap;
		},
		setRouters: (state, routers) => {
			state.routers = routers;
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
			var appKey = this.state.appSetting.appKey;
			if(!appKey)
				appKey = CODE;
			return new Promise(resolve => {
				getRouters(appKey).then(res => {
					var routers = res.routers;
					if (routers.length > 0) {
						routers[0].children.push({path: 'index', name: 'home-index', component: () => import('@/views/index'), hidden: true})
					}
					commit('setUser', res.user);
					commit('setAppKey', appKey);
					commit('setMenus', res.menus);
					commit('setMenuMap', res.menuMap);
					commit('setRouters', routers);
					resolve(routers)
				})
			})
		},
	}
}
export default appSetting;
