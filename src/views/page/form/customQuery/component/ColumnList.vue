<template>
	<a-modal title="设置列头" dialogClass="modal_a" width="600px"
			 :visible="visible" @cancel="closeModal" :footer="null">
		<table_model v-if="visible" ref="table_model" rowKey="fieldName"
					 :load-data-function="loadData" :query-config="[]" :params="queryParam" :columns="columns"/>
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
		}
	}
}
</script>

<style scoped>

</style>
