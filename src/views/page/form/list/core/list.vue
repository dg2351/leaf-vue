<template>
    <div class="textLeft">
		<comment ref="current" is="boList" v-if="sourceData.alias"
				 :data="sourceData" :formdata="{}" class="commentBoxs"/>
	</div>
</template>

<script>
import FormMethods from "@/plugins/js-comps/FormMethods";
import moment from "moment";
import rxAjax from "@/assets/js/ajax";
import boList from "@/views/page/form/list/core/boList";

export default {
    name: "list",
    components: {
		boList,
	},
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
			sourceData: {},
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
    },
}
</script>

<style scoped>

</style>
