import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {
	appUser: null,
	themeStyle: "dark",
}
const modules = {

}
const actions = {
}
const mutations = {
	setAppUser(state, data){
		Vue.ls.set("appUser", data);
		state.appUser = data;
	},
}

export default () => {
	const store = new Vuex.Store({
		state,
		modules,
		mutations,
		actions,
		getters : {
			getAppUser(state){
				let user = Vue.ls.get("appUser");
				if(user){
					store.commit('setAppUser', user);
				}
				return state.appUser;
			},
		},
	})
	return store
}
