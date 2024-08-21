<template>
    <div>
		<div class="pL10 pR10" v-if="queryConfig.length > 0">
			<div class="">
				<slot name="queryParam"/>
				<queryParam ref="queryParam" :show="showGd"
							:defaultParams="defaultParams" :queryConfig="queryConfig"
							@queryBack="queryBack">
					<template slot="queryParamBefore"><slot name="queryParamBefore"/></template>
					<template slot="queryParamAfter"><slot name="queryParamAfter"/></template>
				</queryParam>
			</div>
		</div>
		<div>
			<a-row>
				<a-col :span="20">
					<p v-if="showTotal" class="tableTotal mT20">根据您的条件筛选，共有 <b>{{pagination.total}}</b> 条</p>
				</a-col>
				<a-col :span="4">
					<slot name="headSlot"/>
				</a-col>
			</a-row>
		</div>
		<a-table class="table_a mT10 mB20" :loading="loading" :rowKey="rowKey?rowKey:'xh'"
				 :columns="columns" :data-source="sourceData" :expandIconColumnIndex="expandIconColumnIndex??0"
				 :rowSelection="rowSelectChange ? {
				 	selectedRowKeys:selectedRowKeys, onChange: onSelectChange, type: rowSelectType
				 } : null"
				 :pagination="isPage ? pagination : false" :locale="{emptyText: '暂无数据'}">
			<!--列头自定义插槽-->
			<template :slot="val.slots.title" v-for="val in columns.filter(p=>p.slots && p.slots.title)">
				<slot :name="val.slots.title"/>
			</template>
			<!--内容自定义插槽-->
			<template :slot="val.scopedSlots.title"
					  v-for="val in columns.filter(p=>p.scopedSlots && p.scopedSlots.title && p.scopedSlots.title!='action')"
					  slot-scope="text, record">
				<slot :name="val.scopedSlots.title" :data="record"/>
			</template>
			<!--列插槽-->
			<span slot="xh" slot-scope="text, record, index"><i class="xh">{{record.xh}}</i></span>
			<template slot="img" slot-scope="text, record, index">
				<img :src="text" height="55"/>
			</template>
			<template slot="href" slot-scope="text, record, index">
				<a :href="text" target="_blank">{{text}}</a>
			</template>
			<template slot="vhtml" slot-scope="text, record, index">
				<div v-html="text"/>
			</template>
			<span slot="action" slot-scope="text, record">
				<a-button v-if="isView" type="primary" size="small" @click="eventView(record)">查看</a-button>
				<slot name="action" :data="record"/>
			</span>
		</a-table>
	</div>
</template>

<script>
import FuncList from "@/component/table/js/FuncList";
import FormMethods from "@/plugins/js-comps/FormMethods";
import queryParam from "@/component/query/queryParam.vue";
import rxAjax from '@/assets/js/ajax.js';

export default {
	name: "table_model",
	props:{
		alias:String,
		method:{
			type: String,
			default:"postJson"
		},
		// 主键
		rowKey:String,
		rowPid:String,
		// 展开的图标显示在哪一列
		expandIconColumnIndex:{
			type: Number,
			default: 0
		},
		// 历史默认查询值
		defaultParams: String,
		// 默认查询值
		params:{
			type: Object,
			default: ()=>{return {};}
		},
		// 查询配置
		queryConfig:{
			type: Array,
			default: ()=>{return [];}
		},
		columns:{
			type: Array,
			default: ()=>{return [];}
		},
		xh:{
			type: Boolean,
			default: true,
		},
		action:{
			type: Boolean,
			default: true,
		},
		// 是否分页
		isPage:{
			type: Boolean,
			default: true,
		},
		// 是否可查看
		isView:{
			type: Boolean,
			default: true,
		},
		// 是否可编辑
		isEdit:{
			type: Boolean,
			default: false,
		},
		loadDataFunction:{
			type:Function,
			default: null,
		},
		// 筛选框是否更多
		showTotal:{
			type: Boolean,
			default: true,
		},
		// 筛选框是否更多
		showGd:{
			type: Boolean,
			default: false,
		},
		// 选择项
		defaultRowSelect:{
			type: Array,
			default: ()=>{return []},
		},
		rowSelectType:{
			type: String,
			default: 'checkbox',
		},
		// 行选择
		rowSelectChange:{
			type:Function,
			default: null,
		}
	},
	mixins:[FuncList],
	components:{queryParam},
	data(){
		return {
			loading:true,
			queryParam: {},		// 查询条件
			sourceData:[],
			selectedRowKeys:[],
		}
	},
	created() {
		this.initColumns();
	},
	mounted() {
		let $queryParam = this.$refs['queryParam']
		// 自定义查询
		if(this.queryConfig.length > 0){
			$queryParam.initQueryParamConfig().then(res=>{
				$queryParam.getParams();
			});
		} else {
			this.loadData(1);
		}
		if(this.defaultRowSelect && this.defaultRowSelect .length > 0){
			this.selectedRowKeys = this.defaultRowSelect;
		}
	},
	methods:{
		// 初始化列头
		initColumns(){
			this.columns.forEach(p=>{
				if(!p.align)
					p.align = "center";
			})
			// 是否增加序号列
			if(this.xh){
				let d = this.columns.filter(p=>p.dataIndex=='xh');
				if(d.length == 0)
					this.columns.unshift({title:"序号",dataIndex:"xh",width:"80px",align:"center"})
			}
			// 是否增加序号列
			if(this.action){
				let d = this.columns.filter(p=>p.dataIndex=='action');
				if(d.length == 0)
					this.columns.push({title:"操作列",dataIndex:"action",width:"160px",align:"center",scopedSlots: { customRender: 'action' }})
			}
		},
		// 分页查询
		paginationLoadData(pageIndex){
			this.loadData(pageIndex);
		},
		/**
		 * 查询
		 */
		queryBack(e){
			let params = JSON.parse(JSON.stringify(e.params));//回填
			let splitList = this.queryConfig.filter(p=> p.isSplit);
			splitList.forEach(item=>{
				if(params[item.key]){
					let v = params[item.key].split('/')
					params[item.key+'s'] = v?.[0];
					params[item.key+'e'] = v?.[1];
				}
			})
			Object.keys(params).forEach(key=>{
				if(params[key] instanceof Array){
					params[key] = params[key].join(",")
				}
			})
			this.queryParam = params;//回填
			this.loadData(1);
		},
		refreshData(){
			this.loadData(this.pagination.current);
		},
		/**
		 * 加载数据
		 */
		loadData(pageIndex){
			let self_ = this;
			let api = this.alias;
			this.loading = true;
			this.pagination.current = this.pagination.defaultCurrent = pageIndex;
			let params = Object.assign(this.queryParam, {
				pageIndex:pageIndex,
				pageSize:this.pagination.defaultPageSize,
			})
			if(this.loadDataFunction){
				this.loadDataFunction({...this.params, ...params}).then(({success, data, extraData}) => {
					this.loading = false;
					let sourceData = success && data ? data.map((m,i)=>{return Object.assign(m, {xh:i+1})}) : [];
					self_.sourceData = sourceData;
					let total = extraData?.totalCount ?? 0;
					self_.pagination.total = total;
					self_.$emit("eventTotal", {total, alias:api})
				})
			} else{
				let methodApi = null;
				if(this.method == 'postJson'){
					methodApi = rxAjax.postJson(api, {...this.params, ...params})
				} else if(this.method == 'postForm'){// 自定义查询
					methodApi = FormMethods.invokeCustomQueryPromise(api, {...this.params, ...params})
				}
				if(!methodApi){
					this.$util.message().error("操作提示", "method类型错误");
					return;
				}
				methodApi.then(({success,data, extraData})=>{
					self_.loading = false;
					let sourceData = success && data ? data.map((m,i)=>{return Object.assign(m, {xh:i+1})}) : [];

					// 构造树结构
					if(self_.rowPid){
						sourceData = self_.$util.buildTree(sourceData, self_.rowKey, self_.rowPid);
					}
					self_.sourceData = sourceData;
					let total = sourceData.length;//extraData?.totalCount ?? 0;
					self_.pagination.total = total;
					self_.$emit("eventTotal", {total, alias:api})
				})
			}
		},
		// 查看
		eventView(record){
			this.$emit("eventView", record)
		},
		// 选择项事件
		onSelectChange(k, v) {
			this.selectedRowKeys = k;
			if(this.rowSelectChange){
				this.rowSelectChange(k, v)
			}
		},
	},
}
</script>

<style scoped lang="less">
.tableTotal{
	color: #00051A;
	line-height: 16px;
	b{
		display: inline-block;
		background: #F9FAFB;
		color: #EF711D;
	}
}
</style>
