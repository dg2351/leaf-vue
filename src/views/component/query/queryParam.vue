<template>
	<a-form class="select-box clear" layout="inline" :label-col="{ span: 2 }" :wrapper-col="{ span: 22 }">
		<template v-if="queryParam" v-for="item in queryConfig">
			<a-form-item v-if="checkShow(item)" :label="item.label" style="width: 100%">
				<subInput v-if="item.type=='input'" :item="item" :query-param="queryParam"/>
				<subSelect v-else-if="item.type=='select'" :item="item" :query-param="queryParam"/>
				<subCheckbox v-else-if="item.type=='checkbox'" :item="item" :query-param="queryParam"/>
				<subRadio v-else-if="item.type=='radio'" :item="item" :query-param="queryParam"/>
				<subCascader v-else-if="item.type=='cascader'" :item="item" :query-param="queryParam"/>
				<subLabel v-else-if="item.type=='label'" :item="item" :query-param="queryParam"/>
				<subDatetime v-else-if="item.type=='datetimes'" :item="item" :query-param="queryParam"/>
				<subNumber v-else-if="item.type=='numbers'" :item="item" :query-param="queryParam"/>
				<template v-else-if="item.type=='other'">
					<template v-for="chrld in item.children">
						<subInput v-if="chrld.type=='input'" :item="chrld" :query-param="queryParam"/>
						<subSelect v-else-if="chrld.type=='select'" :item="chrld" :query-param="queryParam"/>
						<subCheckbox v-else-if="chrld.type=='checkbox'" :item="chrld" :query-param="queryParam"/>
						<subRadio v-else-if="chrld.type=='radio'" :item="chrld" :query-param="queryParam"/>
						<subCascader v-else-if="chrld.type=='cascader'" :item="chrld" :query-param="queryParam"/>
						<subLabel v-else-if="chrld.type=='label'" :item="chrld" :query-param="queryParam"/>
						<subDatetime v-else-if="chrld.type=='datetimes'" :item="chrld" :query-param="queryParam"/>
						<subNumber v-else-if="chrld.type=='numbers'" :item="chrld" :query-param="queryParam"/>
					</template>
				</template>
			</a-form-item>
		</template>
		<a-form-item label="" style="width: 100%">
			<div style="text-align: right">
				<a-button type="primary" class="mL10" @click="getParams()">{{button.query}}</a-button>
				<a-button type="" class="mL10" @click="resetParams()">{{button.reset}}</a-button>
				<a-button type="" v-if="show" class="mL10" @click="sxShow = !sxShow">{{sxShow?'??????':'??????'}}</a-button>
				<slot></slot>
			</div>
		</a-form-item>
	</a-form>
</template>

<script>
import subInput from "@/views/component/query/sub/subInput";
import subSelect from "@/views/component/query/sub/subSelect";
import subRadio from "@/views/component/query/sub/subRadio";
import subCheckbox from "@/views/component/query/sub/subCheckbox";
import subCascader from "@/views/component/query/sub/subCascader";
import subLabel from "@/views/component/query/sub/subLabel";
import subDatetime from "@/views/component/query/sub/subDatetime";
import subNumber from "@/views/component/query/sub/subNumber";
import moment from "moment";

export default {
	name: "queryParam",
	props: {
		queryConfig: {
			type: Array,
			default:()=>{
				return []
				/*//??????????????????
				queryConfig:[
					{label:"?????????",value:null,key:"keyword",type:"input",placeholder:"??????????????????????????????",show:true},
					{label:"?????????",value:'',key:"select",type:"select",show:true, initFunction:function (item) {
							let data = [{label:"??????", value: ''}];
							['1','2','3'].forEach(item=>{data.push({label:'??????'+item, value:item})})
							item.data = data;
						}},
					{label:"?????????",value:null,key:"checkbox",type:"checkbox",show:true, data:[], initFunction:function (item) {
							let data = ['1','2','3'].map(item=>{return {label:'??????'+item, value:item}})
							item.data = data;
						}},
					{label:"?????????",value:null,key:"radio",type:"radio",show:true, data:[], initFunction:function (item) {
							let data = ['1','2','3'].map(item=>{return {label:'??????'+item, value:item}})
							item.data = data;
						}},
					{label:"????????????",value:null,key:"cascader",type:"cascader",show:true, data:[], initFunction:function (item) {
							// ?????????????????? [{label,value,children:[]}]
							item.data = self_.addrData;
						}, changeOnSelect:true, format:true},
					{label:"??????",value:'',key:"label",type:"label",show:true, data:[], initFunction:function (item) {
							let data = [{label:"??????", value: ''}];
							['1','2','3'].forEach(item=>{data.push({label:'??????'+item, value:item})})
							item.data = data;
						}, max:1},
					{label:"??????",value:null,key:"datetimes",type:"datetimes",placeholder:['?????????????????????','?????????????????????'],show:true},
					{label:"??????",value:null,key:"numbers",type:"numbers",placeholder:['?????????????????????','?????????????????????'],show:true,suffix:'???'},
					{label:"??????",type:"other",children:[],show:true},
				],
				*/
			}
		},
		// ????????????????????????
		show:{
			type: Boolean,
			default: false,
		},
		// ????????????
		button:{
			type: Object,
			default:()=>{
				return { query:'??????',reset:'??????' }
			}
		},
	},
	components: {subInput, subSelect, subRadio, subCheckbox, subCascader, subLabel, subDatetime, subNumber},
	computed: {},
	data() {
		return {
			sxShow: false,
			queryParam: null,
		}
	},
	watch:{
		queryParam(){
			console.log('watch', this.queryParam)
		},
	},
	mounted() {
		// this.$refs['queryParam'].initQueryParamConfig();
	},
	methods:{
		//??????????????????
		checkShow(item){
			return item.show || this.sxShow;
		},
		//?????????????????????
		initQueryParamConfig(callback){
			let params = {}
			this.queryConfig.forEach(item=>{
				if(item.initFunction) item.initFunction(item);
				if(item.type == 'other'){
					item.children.forEach(children=>{
						if(children.initFunction) children.initFunction(children);
						params[children.key] = children.value;
					})
				} else{
					params[item.key] = item.value;
				}
			})
			if(callback)
				callback(params);
			this.queryParam = params;
		},
		/**
		 * ??????
		 */
		formBack(params, isLoad=false){
			this.$emit("queryBack", {params:params, isLoad:isLoad})
		},
		getParams(){
			let queryParam = {};
			Object.keys(this.queryParam).forEach(key=>{
				let queryConfig = {};
				this.queryConfig.forEach(map=>{
					if(map.key==key){
						queryConfig = map;
					} else if(map.type == 'other'){
						map.children.filter(p=>p.key==key).forEach(child=>{queryConfig = child})
					}
				})
				let type = queryConfig.type;
				if(['checkbox','cascader'].includes(type)) {// ?????????????????????
					let value = this.queryParam[key];
					let format = !(queryConfig.format!=null&&queryConfig.format==false);
					if(value && value.length > 0){
						queryParam[key] = format ? value.join('/') : value[value.length-1];
					}
				}else if(['datetimes'].includes(type)) {
					['S','E'].forEach(k=>{
						let value = this.queryParam[key+k];
						if(value){
							this.queryParam[key+k] = moment(value).format('YYYY-MM-DD')
						}
					})
				} else{
					queryParam[key] = this.queryParam[key]
				}
			})
			console.log('queryParam:=', queryParam)
			this.formBack(queryParam);
		},
		resetParams(){
			Object.keys(this.queryParam).forEach(key=>{
				let defaultValue = null
				let queryConfig = this.queryConfig.filter(p=>p.key==key);
				if(queryConfig && queryConfig.length > 0){
					defaultValue = queryConfig[0].value
				} else{
					let queryConfig = this.queryConfig.filter(p=>p.type=='other');
					queryConfig.forEach(item=>{
						let children = item.children.filter(p=>p.key==key);
						if(children && children.length > 0)
							defaultValue = children[0].value
					})
				}
				this.queryParam[key] = defaultValue
			})
			this.formBack(this.queryParam);
		},
	},
}
</script>

<style scoped>

</style>