<template>
	<a-modal title="设置列头" dialogClass="modal_a" width="600px"
			 :visible="visible" @cancel="closeModal" :footer="null">
		<div style="height: 650px;overflow-y: auto">
			<table_model v-if="visible" ref="table_model" rowKey="fieldName"
						 :action="false" :rowSelectChange="rowSelectChange"
						 :load-data-function="loadData" :query-config="[]"
						 :params="queryParam" :columns="columns"/>
		</div>
		<div class="textCenter mB20">
			<a-button type="primary" class="mR15" @click="onSubmit(true)">提交</a-button>
			<a-button class="mR15"  @click="closeModal()">返回</a-button>
		</div>
	</a-modal>
</template>

<script>
import table_model from "@/component/table/table_model";
import rxAjax from "@/assets/js/ajax";

export default {
	name: "ColumnList",
	components: {table_model},
	data() {
		return {
			visible: false,
			queryParam:{},
			columns:[
				{title:"列名",dataIndex:"fieldName"},
				{title:"注释",dataIndex:"fieldLabel"},
			],
			//
			rowSelect: [],
		}
	},
	methods:{
		openModal(params){
			this.queryParam = params;
			this.visible = true;
		},
		closeModal(){
			this.visible = false;
		},
		loadData(params){
			let api = "/form/db/findColumnList";
			return new Promise((resolve) => {
				rxAjax.postJson(api, params).then(data => {
					resolve({success:true, data, extraData:{totalCount:data.length}});
				})
			});
		},
		rowSelectChange(v, e){
			this.rowSelect = e.map(map=>{
				return {
					fieldLabel: map.fieldLabel,
					fieldName: map.fieldName,
					fieldType: map.fieldType,
				}
			})
		},
		onSubmit(validate){
			this.closeModal();
			this.$emit("callback", {data:this.rowSelect})
		},
	}
}
</script>

<style scoped>

</style>
