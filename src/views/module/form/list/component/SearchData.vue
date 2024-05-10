<template>
	<a-modal title="数据渲染" dialogClass="modal_a" width="600px"
			 :visible="visible" @cancel="closeModal" :footer="null">
		<div style="height: 350px;overflow-y: auto">
			<form_model ref="formModel" :sourceData="sourceData" :form-config="formConfig"/>
			<template v-if="current == 'config'">
				<edit_list ref="dataEdit" :columns="dataColumns" :data="sourceData.data"/>
			</template>
			<template v-else-if="current == 'customQuery'">
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
			sourceData:{data:[]},
			formConfig: {
				visible: false,
				loading: true,
				disabled: false,
				data: [
					{
						label: "值来源",
						tag: "a-radio",
						type: "radio",
						vModel: "datasource",
						options:[],
						initFunction: async function (item) {
							item.options = [
								{label:'自定义',value:'config'},
								{label:'自定义查询',value:'customQuery'},
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
			//
			queryConfig: {
				visible: false,
				loading: true,
				disabled: false,
				data: [
					{
						span:24, labelCol:4,
						label: "自定义查询",
						tag: "a-select",
						type: "select",
						vModel: "url",
						options:[],
						initFunction: async function (item) {
							item.options = [];
							let api = "/form/custom/query/list";
							let {success, data} = await rxAjax.postJson(api, {})
							if(!success || data.length == 0){
								self_.$message.error("网络错误");
								return;
							}
							item.options = data.map(map=>{return {label:map.name, value:map.alias, field:map.resultField}});
							if(self_.sourceData.url){
								let $data = item.options.filter(p=>p.value == self_.sourceData.url);
								self_.changeEvent($data);
							}
						},
						changeFunction: function (v, e) {
							let $data = e.options.filter(p=>p.value == v);
							self_.changeEvent($data);
						}
					},
					{
						span:12, labelCol:8,
						label: "文本",
						tag: "a-select",
						type: "select",
						vModel: "dataLabel",
						options:[],
					},
					{
						span:12, labelCol:8,
						label: "值",
						tag: "a-select",
						type: "select",
						vModel: "dataValue",
						options:[],
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
			if(['config'].includes(sourceData.datasource)) {
				delete sourceData.url;
				delete sourceData.dataLabel;
				delete sourceData.dataValue;
				sourceData.data = this.$refs['dataEdit'].getParam()
			} else if(['customQuery'].includes(sourceData.datasource)){
				Object.assign(sourceData, {data: []})
			}
			this.closeModal();
			this.$emit("callback", {validate,data:sourceData})
		},
		changeEvent($data){
			let self_ = this;
			let $label = self_.queryConfig.data.filter(p=>p.vModel == 'dataLabel')[0];
			let $value = self_.queryConfig.data.filter(p=>p.vModel == 'dataValue')[0];
			let selectData = [];
			if($data.length > 0){
				let field = JSON.parse($data[0].field);
				selectData = field.map(m=>{
					return {label:m.comment, value:m.fieldName}
				})
			}
			$label.options = $value.options = selectData;
		}
	}
}
</script>

<style scoped>

</style>
