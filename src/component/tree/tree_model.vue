<template>
	<!--a-directory-tree-->
	<a-tree style="max-height: 900px" class="treeA"
			:defaultExpandAll="true"
			:tree-data="treeData" @select="clickEvent">
		<template slot="custom" slot-scope="{title,key}">
			<a-dropdown :trigger="['contextmenu']">
				<span>{{ title }}</span>
				<template #overlay>
					<a-menu>
						<a-menu-item key="add" @click="({ key: menuKey }) => treeEvent(key, menuKey)">新增下级</a-menu-item>
						<a-menu-item key="addChild" @click="({ key: menuKey }) => treeEvent(key, menuKey)">新增同级</a-menu-item>
						<a-menu-item key="edit" @click="({ key: menuKey }) => treeEvent(key, menuKey)">编辑节点</a-menu-item>
					</a-menu>
				</template>
			</a-dropdown>
		</template>
	</a-tree>
</template>

<script>
import rxAjax from "@/assets/js/ajax";

export default {
	name: "tree_model",
	props:{
		alias:{
			type: String,
		},
		id:{
			type: String,
			default:"id",
		},
		pid:{
			type: String,
			default:"parentId",
		},
		label:{
			type: String,
			default:"name",
		},
	},
	data(){
		return{
			// 左侧树
			treeData:[],
		}
	},
	mounted() {
		this.initData();
	},
	methods:{
		initData(){
			let {alias, id, pid, label} = this;
			let params = {};
			rxAjax.postJson(alias, params).then(({success,data})=>{
				data.forEach(m=>{
					Object.assign(m, {
						title:m[label],
						slots: {icon: 'smile'},
						key:m[id],
						children:[],
						// selectable:false, //是否可选
						scopedSlots:{title: 'custom'}
					})
				})
				this.treeData = this.$util.buildTree(data, id, pid)
			})
		},
		// 树点击
		clickEvent(v){
			if(v.length > 0){
				this.$emit("callback", v[0])
			} else{
				this.$emit("callback", '')
			}
		},
		//
		treeEvent(key, menuKey){
			console.log(key, menuKey)

		},
	}
}
</script>

<style scoped>

</style>
