<template>
    <div>
		<component ref="current" :is="currentView" :onload="onload" :destroy="destroy"
				   :data="data" :layerid="layerid" :lydata="lydata" :dialogVm="customVm?customVm:this"/>
	</div>
</template>

<script>
import Vue from 'vue';
import table_model from "@/component/table/table_model";
import editModal from "@/views/module/form/list/core/edit";
import rxAjax from "@/assets/js/ajax";

export default {
	name: "boList",
	components: {
		table_model,editModal,
	},
	props: {
		onload: {
			type: Function
		},
		destroy: {
			type: Function
		},
		customVm:{
			type:Object
		},
		//表单数据映射
		data:{
			type:Object
		},
		layerid: {
			type: String
		},
		lydata:{
			type: Object
		}
	},
	data(){
		return {
			currentView: {
				template: "<div>正在加载...</div>"
			}
		}
	},
	created() {
		this.load();
	},
	methods:{
		load() {
			let {data} = this;
			let xhr = new XMLHttpRequest()
			xhr.open("GET", "template/list.txt", false); // public文件夹下的绝对路径
			xhr.overrideMimeType("text/html;charset=utf-8")
			xhr.send(null)

			let html = xhr.responseText;
			var template="<div>正在加载...</div>",script={};
			var templateMath = html.match(/<template>([\s\S]*)<\/template>/);
			if (templateMath != null) {
				template=templateMath[1];
			}
			var scriptMath = (data.script).match(/<script>([\s\S]*)<\/script>/);
			if (scriptMath != null) {
				script=scriptMath[1];
				script=eval('('+script.substring(script.indexOf("export default")+14)+')');
			}
			// 默认脚本添加
			Object.assign(script.methods, {
				event(){// 事件
					let self_ = this;
					let {formAlias} = this;
					let method = {};
					method.load = (e)=>{
						if(e.refresh) self_.$refs.table_model.loadData(1);
					}
					method.add = (record)=>{// 添加
						self_.editModalKey = new Date().getTime();
						self_.$nextTick(() => {
							let params = {pkId:null, formAlias:formAlias}
							self_.$refs.editModal.openModal(params);
						})
					}
					method.edit = (record)=>{// 修改
						self_.editModalKey = new Date().getTime();
						self_.$nextTick(() => {
							let params = {pkId:record[self_.sourceData.idField], formAlias:formAlias}
							self_.$refs.editModal.openModal(params);
						})
					}
					method.del = (record)=>{
						self_.$confirm({
							title: '操作提示',
							content: '彻底删除后，数据不可恢复！请谨慎操作',
							okText: '确认',
							cancelText: '取消',
							// zIndex:2000,
							onOk() {
								let api = `/form/bo/entity/${formAlias}/dataDelete?pkId=${record[self_.sourceData.idField]}`;
								rxAjax.get(api, {}).then(({success,data})=>{
									self_.$refs.table_model.refreshData();
								});
							},
							onCancel() {}
						})
					}
					method.func = async (e, record)=>{
						self_[e.value](record);
					}
					return method;
				},
			})
			var listComponet= Vue.component('custom-list', {
				mixins: [],
				props:{data:Object},
				template: html,
				components: {
					table_model,editModal,
				},
				...script,
				data() {
					return {
						loading: true,
						formAlias: null,// 表单方案
						sourceData: {},
						editModalKey: null,
					}
				},
				created() {
					let {data} = this;
					this.formAlias = data.formAlias;
					this.sourceData = data;
					this.loading = false;
				},
			})
			this.loadLink();
			this.loadStyle();
			this.currentView=listComponet;
		},
		loadLink(){
			let {data} = this;
			var linkMath = data.script.match(/<link id=".*" href=".*" \/>/g);
			if(linkMath==null){
				return;
			}
			for(var i=0;i<linkMath.length;i++){
				var link = linkMath[i].match(/<link id="([\s\S]*)" href="([\s\S]*)" \/>/);
				if(link){
					var id=link[1];
					var newLink=document.getElementById(id);
					if(!newLink){
						newLink=document.createElement('link');
						document.getElementsByTagName('head')[0].appendChild(newLink)
					}
					newLink.id=id;
					newLink.rel="stylesheet";
					newLink.type="text/css";
					newLink.href=link[2];
				}
			}
		},
		loadStyle(){
			let {data} = this;
			var style="";
			var styleMath = data.script.match(/<style scoped>([\s\S]*)<\/style>/) || data.script.match(/<style>([\s\S]*)<\/style>/);
			if (styleMath != null) {
				style=styleMath[1];
			}

			var newStyle=document.getElementById("previewStyle");
			if(!newStyle){
				newStyle = document.createElement('style');
				document.getElementsByTagName('head')[0].appendChild(newStyle)
			}
			newStyle.id="previewStyle";
			newStyle.innerHTML = style;
		},
		loadByParams(params){
			var ctl=this.$refs.current;
			ctl.loadByParams(params);
		},
		loadData(){
			var ctl=this.$refs.current;
			ctl.loadData();
		}
	}
}
</script>

<style scoped>

</style>
