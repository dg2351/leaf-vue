<template>
    <div class="textLeft">
		<table_model v-if="!loading"
					 ref="table_model"
					 :method="sourceData.urlMethod"
					 :alias="'/form/custom/query/queryForJson_'+sourceData.url"
					 :rowKey="sourceData.idField ?? 'id'"
					 :xh="sourceData.isXh == 1"
					 :is-page="sourceData.isPage == 1"
					 :action="false"
					 :params="{}"
					 :query-config="sourceData.searchJson"
					 :columns="sourceData.fieldsJson"
					 @eventView="v=>event().edit(v)"/>
    </div>
</template>

<script>
import table_model from "@/component/table/table_model";
import moment from "moment";
import rxAjax from "@/assets/js/ajax";

export default {
    name: "list",
    components: {table_model},
    data() {
        return {
        	loading: true,
			sourceData: {},
        }
    },
	mounted() {
    	this.loadData();
	},
	methods:{
    	loadData(){
    		let id = "1695721118946";
			let api = "/form/bo/list/info";
			let params = Object.assign({id:id});
			rxAjax.get(api, params).then(({success,data})=>{
				let sourceData = data;
				let searchJson = data.searchJson?JSON.parse(data.searchJson) : []
				let fieldsJson = data.fieldsJson?JSON.parse(data.fieldsJson) : []
				fieldsJson = fieldsJson.filter(p=>p.show == 1).map(map=>{
					if(map.slots){
						switch (map.slots) {
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
				this.sourceData = sourceData;
				console.log(sourceData)
				this.loading = false;
			})
		},
        /**
         * 修改
         * @param record
         */
        event(){
            let self_ = this;
            let method = {};
            method.edit = (record)=>{
                let params = {id:record?record.ID_:null}
                self_.$util.component(self_).event('edit', params);
            }
            return method;
        }
    },
}
</script>

<style scoped>

</style>
