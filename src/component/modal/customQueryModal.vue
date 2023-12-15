<template>
	<a-modal title="自定义查询选择" dialogClass="modal_a" width="800px"
			 :visible="visible" @cancel="closeModal" :footer="null">

		<table_model ref="table_model" alias="/form/custom/query/list" rowKey="alias"
					 rowSelectType="radio" :rowSelectChange="onSelectChange"
					 :query-config="queryConfig" :params="queryParam" :columns="columns" :action="false">
		</table_model>
		<div class="textCenter">
			<a-button type="primary" class="mR15" @click="submitModal">确定</a-button>
			<a-button class="mR15" @click="closeModal">返回</a-button>
		</div>
	</a-modal>
</template>

<script>
import table_model from "@/component/table/table_model";

export default {
	name: "customQueryModal",
	props:['alias'],
	components:{table_model},
	data() {
		return {
			visible: false,
			modalKey: null,
			// 查询配置
			queryConfig:[
				{span:12,labelCol:6,label:"数据源名称",value:null,key:"name",type:"input",placeholder:"请输入您要查找的内容"},
				{span:12,labelCol:6,label:"别名",value:null,key:"alias",type:"input"},
			],
			queryParam: {},		// 查询条件
			columns:[
				{title:"查询名称",dataIndex:"name"},
				{title:"标识名",dataIndex:"alias"},
			],
			selectedRow: null,
		}
	},
	methods:{
		onSelectChange(selectedRowKeys, v) {
			this.selectedRow = v;
		},
		openModal(val, key){
			this.selectedRow = null;
			this.modalKey = key;
			this.visible = true;
		},
		closeModal(){
			this.visible = false;
		},
		submitModal(){
			let {selectedRow, modalKey} = this;
			let params = {modalKey};
			if(selectedRow && selectedRow.length > 0){
				params['name']=selectedRow[0].name;
				params['alias']=selectedRow[0].alias;
				params['field']=JSON.parse(selectedRow[0].resultField).map(m=>{return {label:m.comment, value:m.fieldName}})
			}
			this.visible = false;
			this.$emit("callBack", params);
		},
	},
}
</script>

<style scoped>

</style>
