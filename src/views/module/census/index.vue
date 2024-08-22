<template>
    <div class="p10">
        <div class="xqPlace">
			<h1 class="plTit imageClass">监控报表 </h1>

			<queryParam ref="queryParam" :queryConfig="queryConfig" @queryBack="queryBack"/>
			<a-tabs class="nav_big1">
				<a-tab-pane key="1" tab="接口请求趋势">
					<EchartModel v-if="timer" :key="timer" ref="EchartModel" title="请求日志"
								 :BLalias="`skrgScgmtbSczt`" :BLparams="queryParam"
								 :loadDataFunction="loadDataFunction"
								 :BLxAxisList="BLxAxisList"
								 BLxAxisKey="label" unit-l="次" unit-r="次"
								 :dataZoom="8" :dataZoomShow="true"
								 :BLconfig="[
									{name:'总调用量',key:'value',color:['#6B9BFD'],type:'bar',stack:1},
									{name:'失败数',key:'no',color:['#e56464'],type:'bar',stack:2},
									{name:'成功数',key:'yes',color:['#08a51c'],type:'bar',stack:2},
									{name:'失败趋势',key:'no',color:['#e38b5b'],type:'line'},
									{name:'成功趋势',key:'yes',color:['#51d9a3'],type:'line'},
							 ]"/>
				</a-tab-pane>
				<a-tab-pane key="2" tab="接口请求占比">
					<EchartModel v-if="timer" :key="timer+'pie'" ref="EchartModel" title="请求日志" type="pie"
								 :BLalias="`skrgScgmtbSczt`" :BLparams="queryParam"
								 :loadDataFunction="loadDataFunction"
								 BLxAxisLabel="label" BLxAxisKey="value" :showBox="true"/>
				</a-tab-pane>
			</a-tabs>
		</div>
    </div>
</template>

<script>
import queryParam from "@/component/query/queryParam.vue";
import EchartModel from "@/component/echart/echartModel.vue";
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
						{label:"自定义脚本", value: 'invokeScript'},
						{label:"图片文字识别", value: 'tess4j'},
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
		this.$nextTick(() => {
			let $queryParam = this.$refs['queryParam']
			$queryParam.initQueryParamConfig().then(res=>{
				$queryParam.getParams();
			})
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
