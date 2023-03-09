<template>
	<a-menu :theme="themeStyle" mode="inline"
			:default-selected-keys="selectKey"
			:open-keys="openKeys"
			@openChange="e=>menuEvent().change(e)">
		<template v-for="menu in leftMenu">
			<!--存在下级菜单-->
			<a-sub-menu v-if="menu.children && menu.children.length > 0" :key="menu.key">
				<span slot="title">
					<a-icon :type="menu.icon" @click="menuEvent().click(menu)"/><span>{{menu.label}}</span>
				</span>
				<a-menu-item v-for="child in menu.children" :key="child.key" @click="menuEvent().click(child)">
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
import FuncPublic from "@/mixin/FuncPublic";
import {buildTree,getTreeNode} from "@/utils/public";

export default {
	mixins:[FuncPublic],
	computed: {
		...mapState({
			themeStyle: state => state.themeStyle,
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
			leftMenu: [],
			selectKey: [],
			openKeys: [],
			rootSubmenuKeys: [],
		};
	},
	watch: {
		routerParams: {
			handler(){
				this.loadData().initData();
				this.loadData().selectKey();
			},
			immediate: true, deep: true
		},
	},
	methods:{
		loadData(){
			let self_ = this;
			let method={};
			method.initData = ()=>{
				let sourceData = [
					{id:'1',pid:'0',key:'home',label:'首页',value:'home',icon:'desktop'},
					{id:'2',pid:'0',key:'census',label:'数据统计',value:'census',icon:'pie-chart'},
					{id:'3',pid:'0',key:'wechat',label:'微信模块',value:'',icon:'appstore'},
					{id:'4',pid:'3',key:'visitor',label:'访客',value:'',icon:'mail'},
					{id:'5',pid:'3',key:'logging',label:'日志',value:'',icon:'mail'},
				];
				let treeData = [];
				buildTree(treeData, sourceData, '0')
				self_.leftMenu = treeData
			}
			method.selectKey = ()=>{
				let path = window.location.pathname.split('/')[2];
				let menuData = self_.leftMenu;
				let current = [];
				let openKeys = [];
				getTreeNode(current, openKeys, menuData, path, 'key')
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
				self_.linkGet(item.key, item.value?item.value:{});
			}
			return method
		},
	}
};
</script>

<style scoped>

</style>