<template>
	<a-menu :theme="themeStyle" mode="inline"
			:default-selected-keys="['1']"
			:default-open-keys="['sub1']"
			:open-keys="openKeys"
			@openChange="onOpenChange">
		<template v-for="menu in leftMenu">
			<!--存在下级菜单-->
			<a-sub-menu v-if="menu.children && menu.children.length > 0" :key="menu.key">
				<span slot="title"><a-icon :type="menu.icon" @click="menuLink(menu)"/><span>{{menu.label}}</span></span>
				<a-menu-item v-for="child in menu.children" :key="child.key" @click="menuLink(child)">
					<a-icon :type="child.icon"/><span>{{child.label}}</span>
				</a-menu-item>
			</a-sub-menu>
			<!--仅有一级菜单-->
			<a-menu-item v-else :key="menu.key" @click="menuLink(menu)">
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
		}),
	},
	data() {
		return {
			rootSubmenuKeys: ['sub1', 'sub2'],
			openKeys: ['sub1'],
			leftMenu: [],
		};
	},
	created() {
		this.initData();
	},
	methods:{
		onOpenChange(openKeys) {
			const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1);
			if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
				this.openKeys = openKeys;
			} else {
				this.openKeys = latestOpenKey ? [latestOpenKey] : [];
			}
		},
		initData(){
			this.leftMenu = [
				{key:'home',label:'首页',value:'',icon:'desktop',children:[]},
				{key:'census',label:'数据统计',value:'',icon:'pie-chart',children:[]},
				{key:'3',label:'管理模块',value:'',icon:'appstore',children:[
						{key:'4',label:'微信号用户',value:'',icon:'mail'},
						{key:'5',label:'消息日志',value:'',icon:'mail'},
					]},
			]
		},
		menuLink(item){
			console.log(item)
		}
	}
};
</script>

<style scoped>

</style>