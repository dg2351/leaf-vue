<template>
	<a-menu :theme="themeStyle" mode="inline"
			:default-selected-keys="selectKey"
			:open-keys="openKeys"
			@openChange="e=>menuEvent().change(e)">
		<template v-for="menu in menus" v-if="menu.showType == 1">
			<!--存在下级菜单-->
			<a-sub-menu v-if="menu.children && menu.children.length > 0" :key="menu.key">
				<span slot="title">
					<a-icon :type="menu.icon" @click="menuEvent().click(menu)"/><span>{{menu.label}}</span>
				</span>
				<a-menu-item v-for="child in menu.children" v-if="child.showType == 1"
							 :key="child.key" @click="menuEvent().click(child)">
					<a-icon :type="child.icon"/><span>{{child.label}}</span>
				</a-menu-item>
			</a-sub-menu>
			<!--仅有一级菜单-->
			<a-menu-item v-else :key="menu.key" @click="menuEvent().click(menu)">
				<a-icon :type="menu.icon"/><span>{{menu.label}}</span>
			</a-menu-item>
		</template>
	</a-menu>
</template>

<script>
import {mapState} from "vuex";

export default {
	computed: {
		...mapState({
			themeStyle: state => state.themeStyle,
			menus: state => state.appSetting.menus,
		}),
		routerParams() {
			return this.$route.params;
		},
		routerQuery() {
			return this.$route.query;
		},
	},
	data() {
		return {
			selectKey: [],
			openKeys: [],
			rootSubmenuKeys: [],
		};
	},
	watch: {
		routerParams: {
			handler(){
				this.loadData().selectKey();
			},
			immediate: true, deep: true
		},
	},
	methods:{
		loadData(){
			let self_ = this;
			let method={};
			method.selectKey = ()=>{
				let path = window.location.pathname.split('/')[2];
				let menuData = self_.menus;
				let current = [];
				let openKeys = [];
				this.$util.getTreeNode(current, openKeys, menuData, path, 'key')
				self_.selectKey = current;
				self_.openKeys = openKeys;
			}
			return method;
		},
		menuEvent(){
			let self_ = this;
			let method={};
			method.change = (openKeys)=>{
				const latestOpenKey = openKeys.find(key => self_.openKeys.indexOf(key) === -1);
				if (self_.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
					self_.openKeys = openKeys;
				} else {
					self_.openKeys = latestOpenKey ? [latestOpenKey] : [];
				}
			}
			method.click = (item)=>{
				self_.$util.link(this).get(item.key, item.params?JSON.parse(item.params):{});
			}
			return method
		},
	}
};
</script>

<style scoped>

</style>
