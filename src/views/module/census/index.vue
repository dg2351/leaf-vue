<template>
    <div class="p10">
        <div class="xqPlace">
			<h1 class="plTit imageClass">监控报表 </h1>

			<queryParam ref="queryParam" :queryConfig="queryConfig" @queryBack="queryBack"/>

			<EchartModel v-if="timer" :key="timer" ref="EchartModel" title="请求日志"
						 :BLalias="`skrgScgmtbSczt`" :BLparams="queryParam"
						 :loadDataFunction="loadDataFunction"
						 :BLxAxisList="BLxAxisList"
						 BLxAxisKey="label" unit-l="次"
						 :dataZoom="8" :dataZoomShow="true"
						 :BLconfig="[
									{name:'总调用量',key:'value',color:['#6B9BFD'],type:'bar'},
									{name:'失败数',key:'no',color:['#e56464'],type:'line'},
									{name:'成功数',key:'yes',color:['#08a51c'],type:'line'},
							 ]"/>
		</div>
    </div>
</template>

<script>
import queryParam from "@/component/query/queryParam";
import EchartModel from "@/component/echart/echartModel";
import rxAjax from "@/assets/js/ajax";
import moment from 'moment'

export default {
    name: "index",
    components: {
		queryParam,
		EchartModel,
    },
    data(){
        return{
			// 表单
			queryConfig: [
				{
					label:"选择监控类型",
					value:'',
					key:"type",type:"select",
					data:[
						{label:"全部", value: ''},
						{label:"自定义查询", value: 'queryForJson'},
					]
				},
				{
					label:"监控日期",
					value:new Date().getFullYear(),
					key:"tjnf",type:"select",
					data:[
						{label:"2024年", value: 2024},
						{label:"2023年", value: 2023},
					]
				},
			],
			//
			timer: null,
			queryParam: {},
			BLxAxisList:[],
        }
    },
	mounted() {
		let $queryParam = this.$refs['queryParam']
		$queryParam.initQueryParamConfig().then(res=>{
			$queryParam.getParams();
		})
	},
	methods:{
		queryBack({params}){
			let tjnf = params.tjnf;
			this.queryParam = params;
			let BLxAxisList = [];
			for(let month=1;month<=12;month++){
				BLxAxisList.push(moment(`${tjnf}-${month}`).format("YYYY-MM"))
			}
			this.BLxAxisList = BLxAxisList;
			this.timer = new Date().getTime();
		},
		loadDataFunction(api, params){
			console.log(params)
			return new Promise(resolve => {
				rxAjax.postJson("/system/log/selectSysLogStat", params).then(res => {
					let {data} = res;
					resolve(res)
				})
			});
		},
    }
}
</script>

<style scoped>

</style>
