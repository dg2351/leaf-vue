<template>
    <div class="textLeft">
		<table_model v-if="!loading"
					 ref="table_model"
					 :method="sourceData.urlMethod"
					 :alias="sourceData.url"
					 :rowKey="sourceData.idField ?? 'id'"
					 :xh="sourceData.isXh == 1"
					 :params="{}"
					 :query-config="sourceData.searchJson"
					 :columns="sourceData.fieldsJson"
					 :is-page="sourceData.isPage == 1"
					 :action="false" :isView="true" :isVSlot="true"
					 @eventView="v=>event().edit(v)">
			<template v-slot:headSlot>
				<a-button type="primary" class="floatR mT10" @click="event().add()">新增</a-button>
			</template>
			<span :slot="val.scopedSlots.title" slot-scope="v"
				  v-for="val in sourceData.fieldsJson.filter(p=>p.scopedSlots && p.scopedSlots.title && p.scopedSlots.title!='action')">
				<template v-for="data in val.data">
					<a-button v-if="data.value=='edit'" type="primary" size="small" @click="event().edit(v.data)">{{data.label}}</a-button>
					<a-button v-if="data.value=='del'" type="danger" size="small" @click="event().del(v.data)">{{data.label}}</a-button>
				</template>
			</span>
		</table_model>

		<editModal :key="editModalKey" ref="editModal" @callback="callback"/>
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
        	alias: "",
        	loading: true,
			sourceData: {},
			editModalKey: null,
        }
    },
	mounted() {
    	this.initData();
	},
	methods:{
    	initData(){
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
							case "action":
								console.log(map)
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
				this.sourceData = sourceData;
				this.loading = false;
			})
		},
		callback(e){
			console.log(e);
			if(e.refresh){
				this.$refs.table_model.loadData(1);
			}
		},
        /**
         * 修改
         * @param record
         */
        event(){
            let self_ = this;
            let method = {};
            method.add = (record)=>{
                self_.editModalKey = new Date().getTime();
				self_.$nextTick(() => {
					let params = {pkId:null}
					self_.$refs.editModal.openModal(params);
				})
            }
			method.edit = (record)=>{
				self_.editModalKey = new Date().getTime();
				self_.$nextTick(() => {
					let params = {pkId:record[self_.sourceData.idField]}
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
						console.log('删除操作')
					},
					onCancel() {}
				})
			}
            return method;
        }
    },
}
</script>

<style scoped>

</style>
