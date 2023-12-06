<template>
    <div class="textLeft">
		<table_model v-if="!loading"
					 ref="table_model"
					 :method="sourceData.urlMethod"
					 :alias="sourceData.url"
					 :rowKey="sourceData.idField ?? 'id'"
					 :xh="sourceData.isXh == 1"
					 :is-page="sourceData.isPage == 1"
					 :action="false"
					 :params="{}"
					 :query-config="sourceData.searchJson"
					 :columns="sourceData.fieldsJson"
					 @eventView="v=>event().edit(v)">
			<template v-slot:headSlot>
				<a-button type="primary" class="floatR mT10" @click="event().add()">新增</a-button>
			</template>
		</table_model>

		<editModal ref="editModal"/>
    </div>
</template>

<script>
import table_model from "@/component/table/table_model";
import FormMethods from "@/plugins/js-comps/FormMethods";
import moment from "moment";
import rxAjax from "@/assets/js/ajax";
import editModal from "./edit"

export default {
    name: "list",
    components: {table_model,editModal},
	computed: {
		routerParams() {
			return this.$route.params;
		},
		routerQuery() {
			return this.$route.query;
		},
	},
    data() {
        return {
        	alias: "wechat_user",
        	loading: true,
			sourceData: {},
        }
    },
	mounted() {
    	this.loadData();
	},
	methods:{
    	loadData(){
    		let {alias} = this.routerQuery;
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
				searchJson.forEach(async (map)=>{
					if(map.datasource == "queryForJson"){
						let {data} = await FormMethods.invokeCustomQueryPromise(map.url, {})
						map.data = data.map(m=>{
							return {label:m[map.dataLabel],value:m[map.dataValue]}
						});
					}
				})
				this.sourceData = sourceData;
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
            method.add = (record)=>{
                let params = {id:record?record.ID_:null}
                self_.$refs.editModal.openModal(params);
            }
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
