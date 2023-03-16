import Vue from 'vue'
import Vuex from 'vuex'
import appSetting from './modules/appSetting'
Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		appSetting,
	},
	state: {
		themeStyle: "dark",
	},
	mutations: {

	},
	actions: {

	}
})
