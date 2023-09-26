<template>
	<a-form class="select-box clear" layout="inline">
		<a-row>
			<template v-if="queryParam" v-for="(item,index) in queryConfig">
				<a-col :span="item.span??24">
					<a-form-item v-if="checkShow(item)" style="width: 100%"
								 :label="item.label" :label-col="{span:item.labelCol??8}">
						<subInput v-if="item.type=='input'" :item="item" :query-param="queryParam"/>
						<subSelect v-else-if="item.type=='select'" :item="item" :query-param="queryParam"/>
						<subSelectTree v-else-if="item.type=='subSelectTree'" :item="item" :query-param="queryParam"/>
						<subCheckbox v-else-if="item.type=='checkbox'" :item="item" :query-param="queryParam"/>
						<subRadio v-else-if="item.type=='radio'" :item="item" :query-param="queryParam"/>
						<subCascader v-else-if="item.type=='cascader'" :item="item" :query-param="queryParam"/>
						<subLabel v-else-if="item.type=='label'" :item="item" :query-param="queryParam"/>
						<subDatetime v-else-if="item.type=='datetimes'" :item="item" :query-param="queryParam"/>
						<subNumber v-else-if="item.type=='numbers'" :item="item" :query-param="queryParam"/>
						<template v-else-if="item.type=='other'">
							<template v-for="chrld in item.children" v-if="checkShow(chrld)">
								<subInput v-if="chrld.type=='input'" :item="chrld" :query-param="queryParam"/>
								<subSelect v-else-if="chrld.type=='select'" :item="chrld" :query-param="queryParam"/>
								<subSelectTree v-else-if="chrld.type=='subSelectTree'" :item="chrld" :query-param="queryParam"/>
								<subCheckbox v-else-if="chrld.type=='checkbox'" :item="chrld" :query-param="queryParam"/>
								<subRadio v-else-if="chrld.type=='radio'" :item="chrld" :query-param="queryParam"/>
								<subCascader v-else-if="chrld.type=='cascader'" :item="chrld" :query-param="queryParam"/>
								<subLabel v-else-if="chrld.type=='label'" :item="chrld" :query-param="queryParam"/>
								<subDatetime v-else-if="chrld.type=='datetimes'" :item="chrld" :query-param="queryParam"/>
								<subNumber v-else-if="chrld.type=='numbers'" :item="chrld" :query-param="queryParam"/>
							</template>
						</template>
					</a-form-item>
				</a-col>
			</template>
		</a-row>
		<a-form-item label="" style="width: 100%">
			<div class="mB10" style="text-align: right">
				<slot name="queryParamBefore"/>
				<a-button type="primary" class="mL10" @click="getParams()">{{button.query}}</a-button>
				<a-button type="" class="mL10" @click="resetParams()">{{button.reset}}</a-button>
				<a-button type="" v-if="show" class="mL10" @click="sxShow = !sxShow">{{sxShow?'收起':'展开'}}</a-button>
				<slot name="queryParamAfter"/>
			</div>
		</a-form-item>
	</a-form>
</template>

<script>
import subInput from "@/component/query/sub/subInput";
import subSelect from "@/component/query/sub/subSelect";
import subSelectTree from "@/component/query/sub/subSelectTree";
import subRadio from "@/component/query/sub/subRadio";
import subCheckbox from "@/component/query/sub/subCheckbox";
import subCascader from "@/component/query/sub/subCascader";
import subLabel from "@/component/query/sub/subLabel";
import subDatetime from "@/component/query/sub/subDatetime";
import subNumber from "@/component/query/sub/subNumber";
import moment from "moment";

export default {
	name: "queryParam",
	props: {
		queryConfig: {
			type: Array,
			default:()=>{
				return []
				/*//查询条件配置
				queryConfig:[
					{label:"文本框",value:null,key:"keyword",type:"input",placeholder:"请输入您要查找的内容",show:true},
					{label:"选择框",value:'',key:"select",type:"select",show:true, initFunction:function (item) {
							let data = [{label:"全部", value: ''}];
							['1','2','3'].forEach(item=>{data.push({label:'选项'+item, value:item})})
							item.data = data;
						}},
					{label:"多选框",value:null,key:"checkbox",type:"checkbox",show:true, data:[], initFunction:function (item) {
							let data = ['1','2','3'].map(item=>{return {label:'选项'+item, value:item}})
							item.data = data;
						}},
					{label:"单选框",value:null,key:"radio",type:"radio",show:true, data:[], initFunction:function (item) {
							let data = ['1','2','3'].map(item=>{return {label:'选项'+item, value:item}})
							item.data = data;
						}},
					{label:"级联选择",value:null,key:"cascader",type:"cascader",show:true, data:[], initFunction:function (item) {
							// 返回数据格式 [{label,value,children:[]}]
							item.data = self_.addrData;
						}, changeOnSelect:true, format:true},
					{label:"标签",value:'',key:"label",type:"label",show:true, data:[], initFunction:function (item) {
							let data = [{label:"全部", value: ''}];
							['1','2','3'].forEach(item=>{data.push({label:'选项'+item, value:item})})
							item.data = data;
						}, max:1},
					{label:"时间",value:null,key:"datetimes",type:"datetimes",placeholder:['请输入开始区间','请输入结束区间'],show:true},
					{label:"数字",value:null,key:"numbers",type:"numbers",placeholder:['请输入开始区间','请输入结束区间'],show:true,suffix:'元'},
					{label:"其它",type:"other",children:[],show:true},
				],
				*/
			}
		},
		// 是否展示更多按钮
		show:{
			type: Boolean,
			default: false,
		},
		// 按钮文本
		button:{
			type: Object,
			default:()=>{
				return { query:'搜索',reset:'重置' }
			}
		},
	},
	components: {subInput, subSelect, subSelectTree, subRadio, subCheckbox, subCascader, subLabel, subDatetime, subNumber},
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
		//控制展开隐藏
		checkShow(item){
			if(item.show==null)
				item.show = true;
			return !item.hidden && (item.show || this.sxShow);
		},
		//初始化查询条件
		initQueryParamConfig(callback){
			let params = {}
			this.queryConfig.forEach(item=>{
				// 初始化方法
				if(item.initFunction)
					item.initFunction(item);
				if(['select','selectTree','radio','cascader'].includes(item.type)){
					if(!item.changeFunction)
						item.changeFunction = function () {}
				}
				if(item.type == 'other'){
					item.children.forEach(children=>{
						if(children.initFunction) children.initFunction(children);
						params[children.key] = children.value;

						if(['select','selectTree','radio','cascader'].includes(children.type)){// 初始化方法
							if(!children.changeFunction)
								children.changeFunction = function () {}
						}
					})
				} else{
					params[item.key] = item.value;
				}
				// 初始化宽度
				if(!item.span){
					item.span = 24
				}
				if(!item.labelCol){
					item.labelCol = 4
				}
			})
			if(callback)
				callback(params);
			this.queryParam = params;
		},
		/**
		 * 回调
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
				if(['checkbox','cascader'].includes(type)) {// 需要切割的数据
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
