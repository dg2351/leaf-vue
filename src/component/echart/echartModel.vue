// Echat图谱中转
<template>
    <div class="mT15" :class="classStr">
		<div class="titleB">
			<span class="tit">{{title}}</span>
			<slot name="querySlot"></slot>
		</div>
		<template v-if="hasData">
			<div v-if="type == 'pie'">
				<EchartPie v-if="echartData.timer" :key="echartData.timer" height="500px"
						   :data="echartData" :full="echartFull" />
				<view class="zsfbBox" v-if="showBox">
					<p v-for="(item,index) in echartData.series">
						<i :style="{background:colors[index]}"></i>{{item.name}}<span >{{item.data}}{{boxUnit ? boxUnit : (item.unit?item.unit:'项')}}</span>
					</p>
				</view>
			</div>
			<!--<div v-else-if="type == 'bar'">
				<template v-if="echartData.timer">
					<div class="echartLine">
						<p>{{leftUnit}}</p>
					</div>
					<EchartBar :key="echartData.timer" height="500rpx" :unitL="unitL" :dataZoom="dataZoom"
							   :dataA="echartData" :xAxis="false" />
					<ul class="echartLegend" style="margin:0 24rpx">
						<li v-for="(item,index) in echartData.dataBar[0].data" :key="index">
							<i :style="{ background: item.color }"></i>
							<span>{{ item.name }}</span>
						</li>
					</ul>
				</template>
			</div>
			<div v-else-if="type == 'Tbar'">
				<EchartTBar v-if="echartData.timer" height="500rpx" :dataZoom="5" legendHeight="20" barWidth="50%"
							:unit="leftUnit" :key="echartData.timer" :dataA="echartData" :dataZoomShow="false" />
			</div>-->
			<div v-else>
				<EchartLineBar height="400px" v-if="echartData.timer" :key="echartData.timer"
							   :dataZoom="dataZoom" :barWidth="barWidth"
							   :grid="grid" :dataA="echartData"
							   :unitL="unitL" :unitR="unitR" :textName="textName"
							   :dataZoomShow="dataZoomShow"/>
			</div>
		</template>
		<a-empty v-if="!hasData" mode="data" text="暂无数据" textSize="24" width="290"/>
    </div>
</template>

<script>
import EchartLineBar from '@/component/echart/echartBarLine.vue';
import EchartPie from '@/component/echart/echartPie.vue';
import FormMethods from "@/plugins/js-comps/FormMethods";
import moment from 'moment'

export default {
    name:"echartModel",
    components:{EchartLineBar, EchartPie},
    props:{
        type:String,
        id:String,
        title:String,
		//
		classStr:{
        	type:String,
			default:"",
		},
		barWidth:{
			type:String,
			default:"20%",
		},
		//
		textName:String,
        // 图表
        BLxAxisKey:{
            type: String, default: 'id',
        },
        BLxAxisLabel:String, // 饼状图使用
        BLproportionKey:{
            type: String,
        },
        BLxAxisList:{
            type:Array,
            default:()=>{
                return [];
            }
        },
        BLalias:String,
        BLparams:Object,
        BLconfig:Array,
        // 饼状图使用
        echartFull:{
            type:Object,
            default:()=>{
                return {
                    center: ['50%', '40%'],
                    radius: ['38%', '56%']
                }
            }
        },
		colors:{
			type:Array,
			default:()=>{
				return ['#6B9BFD', '#4ED9A0', '#FFCB32', '#F17665', '#67CDF7', '#FFA257']
			}
		},
		buildDataFunction:{
        	type:Function,
			default:null,
		},
		loadDataFunction:{
			type:Function,
			default:null,
		},
		isReverse: false,
		dataZoomShow: false,
		isMonth: false,
		grid: {
			type: Array,
			default:()=>[
				{
					left: "0",
					right: "5",
					bottom: "50",
					top: "10",
					containLabel: true,
				},
				{
					left: "0",
					right: "5",
					bottom: "50",
					top: "10",
					containLabel: true,
				},
			],
		},
		//
		unitL: {
			type: String,
			default: "",
		},
		unitR: {
			type: String,
			default: "%",
		},
		//
		showBox:{
        	type: Boolean,
			default: false,
		},
		dataZoom:{
			type: Number,
			default: 7,
		},
		boxUnit:{
        	type:String,
		}
    },
    data(){
        return{
        	hasData: false,
            //
            echartData: {
				timer: null
            },
        }
    },
    mounted() {
    	this.loadData();
    },
    methods:{
    	loadData(){
			let {BLalias, type} = this;
			if(!BLalias)
				return;
			if(type == 'pie'){
				this.echartData = {
					timer: null,
					name: this.title,
					color: this.colors,
					series:[]
				}
				this.loadPieData()
			}
			else if(type == 'bar'){
				this.echartData = {
					timer: null,
					barGap: '100%',
					barWidth: '40%',
					xAxis:[],
					dataBar:[]
				}
				this.loadBarData()
			}
			else if(type == 'Tbar'){
				this.echartData = {
					timer: null,
					xAxis:[],
					data:[]
				}
				this.loadTBarData()
			}
			else{
				this.echartData = {
					timer: null,
					// inverse: false,
					// lable: "inside",
					xAxis: [],
					data: [],
					dataLine: [],
				}
				this.loadBarLineData()
			}
		},
        // 柱状折线图
        loadBarLineData(){
            let {BLxAxisKey, BLproportionKey, BLxAxisList, BLconfig, isReverse} = this;
            if(this.loadDataFunction){
            	this.loadDataFunction(this.BLalias, this.BLparams).then(({success,data})=>{
					let dataList = [];
					if(this.buildDataFunction != null){
						dataList = this.buildDataFunction(data);
					} else{
						dataList = data;
					}
					let barList = [];
					let lineList = [];
					if(!BLxAxisList || BLxAxisList.length == 0){
						BLxAxisList = dataList.filter(p=>p[BLxAxisKey] != null).map(m=> {return m[BLxAxisKey]});
					}
					BLconfig.forEach(item=>{
						let values = [];
						let proportion = [];
						BLxAxisList.forEach(v=>{
							let $d = dataList.filter(p=>p[BLxAxisKey] == v);
							let value = ($d?.[0]?.[item.key]) ?? 0;
							values.push(value);
							if(BLproportionKey){
								proportion.push(($d?.[0]?.[BLproportionKey]) ?? 0);
							}
						})
						if(proportion.length > 0){
							// lalel 自定义数据
							Object.assign(item, {
								proportion: proportion,
							})
						}
						if(item.type == 'bar'){
							barList.push(Object.assign(item, {
								value: values,
							}))
						}if(item.type == 'line'){
							lineList.push(Object.assign(item, {
								value: values,
							}))
						}
						//
						Object.assign(item, {
							dataname: item.name,
							colors: item.color[0],
						})
					})
					Object.assign(this.echartData, {
						timer: new Date().getTime(),
						xAxis: this.isMonth ? BLxAxisList.map(map=>{return parseInt(moment(map).format("MM"))+"月"}):BLxAxisList,
						data: barList,
						dataLine: lineList,
					})
					if(BLxAxisList.length > 0 && (barList.length > 0 || lineList.length > 0))
						this.hasData = true;
				})
			} else{
				FormMethods.invokeCustomQueryPromise(this.BLalias, this.BLparams).then(({success,data})=>{
					if(isReverse)
						data.reverse();
					let dataList = [];
					if(this.buildDataFunction != null){
						dataList = this.buildDataFunction(data);
					} else{
						dataList = data;
					}
					let barList = [];
					let lineList = [];
					if(!BLxAxisList || BLxAxisList.length == 0){
						BLxAxisList = dataList.filter(p=>p[BLxAxisKey] != null).map(m=> {return m[BLxAxisKey]});
					}
					BLconfig.forEach(item=>{
						let values = [];
						let proportion = [];
						BLxAxisList.forEach(v=>{
							let $d = dataList.filter(p=>p[BLxAxisKey] == v);
							let value = ($d?.[0]?.[item.key]) ?? 0;
							values.push(value);
							if(BLproportionKey){
								proportion.push(($d?.[0]?.[BLproportionKey]) ?? 0);
							}
						})
						if(proportion.length > 0){
							// lalel 自定义数据
							Object.assign(item, {
								proportion: proportion,
							})
						}
						if(item.type == 'bar'){
							barList.push(Object.assign(item, {
								value: values,
							}))
						}if(item.type == 'line'){
							lineList.push(Object.assign(item, {
								value: values,
							}))
						}
						//
						Object.assign(item, {
							dataname: item.name,
							colors: item.color[0],
						})
					})
					Object.assign(this.echartData, {
						timer: new Date().getTime(),
						xAxis: this.isMonth ? BLxAxisList.map(map=>{return parseInt(moment(map).format("MM"))+"月"}):BLxAxisList,
						data: barList,
						dataLine: lineList,
					})
					if(BLxAxisList.length > 0 && (barList.length > 0 || lineList.length > 0))
						this.hasData = true;
				});
			}
        },
        // 饼状图
        loadPieData(){
            let {BLxAxisKey, BLxAxisLabel, BLproportionKey} = this;
            FormMethods.invokeCustomQueryPromise(this.BLalias, this.BLparams).then(({success,data})=>{
                let series = [];
                if(this.buildDataFunction != null){
                	series = this.buildDataFunction(data);
				} else{
                	let total = 0;
                	data.forEach(item=>{
                		total += (item[BLxAxisKey] ?? 0);
					})
					data.forEach(item=>{
						series.push({
							name: item[BLxAxisLabel],
							data: item[BLxAxisKey],
							value: total > 0 ? ((item[BLxAxisKey]/total ?? 0)*100).toFixedNum(2) : 0,
							unit: item.unit
						})
					})
				}
                Object.assign(this.echartData, {
                    timer: new Date().getTime(),
                    full: {
                        center: ['50%', '40%'],
                        radius: ['38%', '56%']
                    },
                    series: series,
                })
				this.hasData = series.length > 0;
            })
        },
		// 柱状图
		loadBarData(){
			let {BLxAxisKey, BLxAxisLabel, BLproportionKey, colors} = this;
			FormMethods.invokeCustomQueryPromise(this.BLalias, this.BLparams).then(({success,data})=>{
				let xAxis = [];
				let dataBar = [];
				let proportion = [];
				data.forEach((item,i)=>{
					let label = item[BLxAxisLabel]
					let value = item[BLxAxisKey];
					xAxis.push(label)
					proportion.push(value)
					dataBar.push({
						name: label,
						value: value,
						color: colors?.[i] ?? '#FFA257',
					})
				})
				Object.assign(this.echartData, {
					timer: new Date().getTime(),
					xAxis: xAxis,
					dataBar: [{
						// dataname: 'test',
						proportion: proportion,
						label: 'top',
						data: dataBar
					}],
				})
				this.hasData = dataBar.length > 0;
			})
		},
		// 横向柱状图
		loadTBarData(){
			let {BLxAxisKey, BLconfig} = this;
			FormMethods.invokeCustomQueryPromise(this.BLalias, this.BLparams).then(({success,data})=>{
				let xAxis = data.map((item,i)=>{return item[BLxAxisKey];})
				let dataList = [];
				BLconfig.forEach(item=>{
					let values = [];
					xAxis.forEach(val=>{
						let $d = data.filter(p=>p[BLxAxisKey] == val);
						let value = ($d?.[0]?.[item.key]) ?? 0;
						values.push(value);
					})
					dataList.push(Object.assign(item, {
						value: values
					}));
				})
				Object.assign(this.echartData, {
					timer: new Date().getTime(),
					xAxis: xAxis,
					data: dataList,
				})
				this.hasData = dataList.length > 0;
			})
		},
    }
}
</script>
