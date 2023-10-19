<template>
	<a-modal title="数据渲染" dialogClass="modal_a" width="600px"
			 :visible="visible" @cancel="closeModal" :footer="null">
		<div style="height: 350px;overflow-y: auto">
			<form_model ref="formModel" :sourceData="sourceData" :form-config="formConfig"/>
			<template v-if="current == 'config'">
				<edit_list ref="dataEdit" :columns="dataColumns" :data="sourceData.data"/>
			</template>
			<template v-else-if="current == 'queryForJson'">
				<form_model ref="queryModel" :sourceData="sourceData" :form-config="queryConfig"/>
			</template>
		</div>
		<div class="textCenter mB20">
			<a-button type="primary" class="mR15" @click="onSubmit(true)">提交</a-button>
			<a-button class="mR15"  @click="closeModal()">返回</a-button>
		</div>
	</a-modal>
</template>

<script>
import rxAjax from "@/assets/js/ajax";
import form_model from "@/component/form/form_model";
import edit_list from "@/component/table/edit_list";

export default {
	name: "ColumnList",
	components: {
		form_model,
		edit_list,
	},
	data() {
		let self_ = this;
		return {
			visible: false,
			sourceData:{},
			formConfig: {
				visible: false,
				loading: true,
				disabled: false,
				data: [
					{
						label: "值来源",
						type: "radio",
						model: "datasource",
						data:[],
						initFunction: async function (item) {
							item.data = [
								{label:'自定义',value:'config'},
								{label:'自定查询',value:'queryForJson'},
							]
						},
						changeFunction: function (v) {
							console.log(v);
							self_.current = v;
						}
					},
				]
			},
			// 页签
			current:"",
			// config
			dataColumns:[
				{title:"label",dataIndex:"label",align: "center",default:'',
					scopedSlots: { customRender: 'label' },
					editCell:true,type:'input'},
				{title:"value",dataIndex:"value",align: "center",default:'',
					scopedSlots: { customRender: 'value' },
					editCell:true,type:'input'},
			],
			// queryForJson
			queryConfig: {
				visible: false,
				loading: true,
				disabled: false,
				data: [
					{
						span:24, labelCol:4,
						label: "自定查询",
						type: "select",
						model: "url",
						data:[],
						initFunction: async function (item) {
							item.data = [];
							let api = "/form/custom/query/list";
							let {success, data} = await rxAjax.postJson(api, {})
							if(!success || data.length == 0){
								self_.$message.error("网络错误");
								return;
							}
							item.data = data.map(map=>{return {label:map.name, value:map.alias}});
						},
						changeFunction: function (v, e) {
							console.log(v, e);
						}
					},
				]
			},
		}
	},
	methods:{
		openModal(params){
			this.sourceData = {...params};
			this.current = params.datasource;
			this.visible = true;
		},
		closeModal(){
			this.visible = false;
		},
		onSubmit(validate){
			let {sourceData} = this;
			if(!['config'].includes(sourceData.datasource)){
				delete sourceData.url;
				Object.assign(sourceData, {data: []})
			}
			this.closeModal();
			this.$emit("callback", {validate,data:sourceData})
		},
	}
}
</script>

<style scoped>

</style>
