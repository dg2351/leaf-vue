// 自定义组件，列表配置消息框
<template>
	<a-modal v-drag-modal :title="title" dialogClass="modal_a" :width="`${width}px`"
			 :visible="visible" @cancel="closeModal" :footer="null">
		<table_model ref="table_model"
					 v-if="sourceData.url"
					 :method="sourceData.urlMethod"
					 :alias="sourceData.url"
					 :rowKey="sourceData.idField ?? 'id'"
					 :xh="sourceData.isXh == 1"
					 :params="{}"
					 :query-config="sourceData.searchJson"
					 :columns="sourceData.fieldsJson"
					 :is-page="sourceData.isPage == 1"
					 :isView="false" :isVSlot="true" :action="false"
					 :defaultRowSelect="defaultRowSelect"
					 :rowSelectType="rowSelectType"
					 :rowSelectChange="onSelectChange">
		</table_model>
		<div class="textCenter">
			<a-button type="primary" class="mR15" @click="submitModal">确定</a-button>
			<a-button class="mR15" @click="closeModal">返回</a-button>
		</div>
	</a-modal>
</template>

<script>
import table_model from "@/component/table/table_model";
import rxAjax from "@/assets/js/ajax";
import moment from "moment";
import FormMethods from "@/plugins/js-comps/FormMethods";

export default {
	name: "customQueryModal",
	props:{
		modalKey:String,
		title:{
			type: String,
			default: "对话框",
		},
		alias:String,
	},
	components:{table_model},
	data() {
		return {
			visible: false,
			rowSelectType:"radio",
			label:"name",
			value:"id",
			width:1200,
			//
			sourceData: {},
			//
			defaultRowSelect:[],
			selectedRow: null,
		}
	},
	mounted() {
		this.initData();
	},
	methods:{
		initData(){
			let {alias} = this;
			if(!alias){
				this.$util.message().error('操作提示', 'alias参数缺失')
				return;
			}
			let api = "/form/bo/list/alias";
			let params = Object.assign({alias});
			rxAjax.get(api, params).then(({success,data})=>{
				let sourceData = data;
				let searchJson = data.searchJson?JSON.parse(data.searchJson) : []
				let fieldsJson = data.fieldsJson?JSON.parse(data.fieldsJson) : []
				fieldsJson = fieldsJson.filter(p=>p.show == 1 && p.dataIndex != 'action').map(map=>{
					if(map.slots){
						switch (map.slots) {
							case "action":
								Object.assign(map, {
									scopedSlots: {
										customRender: 'v-'+map.dataIndex,
										title: 'v-'+map.dataIndex
									},
								})
								break;
							case "img":
								Object.assign(map, {
									scopedSlots: { customRender: 'img' }
								})
								break;
							case "date":
								Object.assign(map, {
									customRender:(text)=>{return moment(text).format("YYYY-MM-DD hh:mm")}
								})
								break;
						}
					}
					return map;
				})
				Object.assign(sourceData, {
					searchJson: searchJson,
					fieldsJson: fieldsJson,
				})
				searchJson.forEach(async (map)=>{
					if(map.datasource == "customQuery"){
						let {data} = await FormMethods.invokeCustomQueryPromise(map.url, {})
						map.data = data.map(m=>{
							return {label:m[map.dataLabel],value:m[map.dataValue]}
						});
					}
				})
				//
				let script = "<script>export default {methods:{"+(data.bodyScript??'') + "}}<\/script>"
				this.sourceData = Object.assign(sourceData, {script});
			})
		},
		onSelectChange(selectedRowKeys, v) {
			this.selectedRow = v;
		},
		openModal(val){
			if(val)
				this.defaultRowSelect.push(val);
			this.selectedRow = null;
			this.visible = true;
		},
		closeModal(){
			this.visible = false;
		},
		submitModal(){
			let {selectedRow, modalKey, label, value} = this;
			if(!selectedRow){// 未选择
				this.visible = false;
				return;
			}
			let params = {modalKey};
			if(selectedRow && selectedRow.length > 0){
				params['label']=selectedRow[0][label];
				params['value']=selectedRow[0][value];
			}
			this.visible = false;
			this.$emit("callBack", params);
		},
	},
}
</script>

<style scoped>
</style>
