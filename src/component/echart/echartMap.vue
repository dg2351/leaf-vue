<template>
	<a-spin :spinning="loading" tip="地图加载中">
		<a-button v-if="showBack && showBtn" type="primary" class="echartMapButton" @click="back()">返回</a-button>
		<div ref="openingChart" :style="{ width: width, height: height }"/>
	</a-spin>
</template>

<script>
import FormMethods from "@/plugins/js-comps/FormMethods";
import * as echarts from "echarts";

const mapList = [];
const rangeData = [
	[1],
	[0.6,1],
	[0.3,0.6],
	[0.1,0.3],
	[0,0.1],
];
export default {
	name: "echart_map",
	props: {
		visualMap: {
			type: Object,
			default: () => ({
				type: "piecewise",
				left: 15,
				bottom: 15,
				itemWidth: 27,
				itemHeight: 15,
				textStyle: {
					color: "#666666",
					fontSize: 14,
				},
				inRange: {
					color: [
						"#B2CAE0","#D2EAFF","#8AC6FD",
						"#45A5F8","#3390ea",
					],
				},
				outOfRange: {
					color: ["#999999"],
				},
				pieces: [
					{
						min: 5000,
						label: ">5000",
					},
					{
						max: 4999,
						min: 1000,
						label: "1000~4999",
					},
					{
						max: 999,
						min: 500,
						label: "500~999",
					},
					{
						max: 499,
						min: 200,
						label: "200~499",
					},
					{
						max: 199,
						min: 0,
						label: "<199",
					},
				],
			}),
		},
		height: {
			type: String,
			default: "250px",
		},
		width: {
			type: String,
			default: "100%",
		},
		initAddr: {
			type: String,
			default: "china",
		},
		rank: {
			type: Number,
			default: 0,
		},
		showBack: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
			loading: true,
			level: 0,
			layoutSize: '100%',
			myChart: {},
			showBtn: false,
			mapData: [], unit:"",
		};
	},
	mounted() {
		this.initEchart();
	},
	methods: {
		async getMapJson(code){
			// 市辖区下调一级
			// if(code=="110100") code="110000";
			// if(code=="120100") code="120000";
			// if(code=="500100") code="500000";
			// if(code=="310100") code="310000";
			//
			let params = {
				code:code=='china'||code=='中国'?"100000":code
			}
			let {success,data} = await FormMethods.invokeCustomQueryPromise("sysMapJson", params);
			let $data = data?.[0] ?? null;
			let json_data = $data.json_data;
			this.level = $data.level;
			return json_data;
		},
		// 获取地图数据
		initMapData(){
			return JSON.parse(JSON.stringify(mapList));
		},
		// 构造地图区间
		getMapRange(name){
			let {mapData, visualMap, unit} = this;
			// 设置默认最大值 and 获取地图数据最大值
			let maxData = 100;
			mapData.forEach(m=> {
				if (m.value > maxData) maxData = parseInt(m.value)
			});
			// 设置区间倍率
			let size = Math.pow(10, String(maxData).length-1)
			maxData = Math.floor(maxData / size) * size
			// 构造区间
			let range = [];
			visualMap.pieces = [];
			rangeData.forEach((item,i)=>{
				if(item.length == 1){
					range.push([
						maxData * item[0]
					])
				}else if(item.length == 2){
					range.push([
						maxData * item[0],
						(maxData * item[1])-1
					])
				}
				visualMap.pieces.push({})
			})
			visualMap.pieces.forEach((item, i)=>{
				let config = range[i];
				let gte = parseFloat(config[0]);
				let lte = config[1] ? parseFloat(config[1]) : null;
				Object.assign(item, {
					min: gte,
					max: lte,
					label: lte ? (gte+"~"+lte) : (gte + unit + "及以上")
				});
				if(lte==null) delete item["max"];
			})
			return visualMap;
		},
		initEchart() {
			let self_ = this;
			let {initAddr} = this;
			self_.ready(initAddr).then(res=>{
				//单击切换到省级地图，当mapCode有值,说明可以切换到下级地图
				self_.myChart.on("click", function (params) {
					self_.$emit("mapClick", {...params.data, level:self_.level})
					if(self_.rank == 0)
						return;
					// 下钻事件
					self_.ready(params.data.code).then(()=>{
						self_.showBtn = true;
					})
				});
				self_.myChart.on("georoam", params => {
					if (params.dy || params.dx) return;		 //如果是拖拽事件则退出
					let _option = this.myChart.getOption();  //获取最新的option配制
					let _zoom = _option.geo[0].zoom;
					this.myChart.clear();
					this.myChart.setOption(_option);
				});
				window.onresize = function () {
					self_.myChart.resize();
				};
			});
		},
		ready(initAddr){
			let self_ = this;
			self_.loading = true;
			return new Promise((resolve, reject) => {
				this.$emit("ready", initAddr, (dataList, unitName)=>{
					if(unitName)
						self_.unit = unitName;
					// 构造地图数据
					let mapData = self_.initMapData();
					dataList.forEach(m=>{
						let $d = mapData.filter(p=>p.code == m.code);
						if($d.length > 0)
							self_.$set($d[0], "value", m.value);
						else if(m.code)
							mapData.push({name: m.name, value:m.value, code:m.code});
					})
					self_.mapData = mapData;
					// 获取地图json
					this.getMapJson(initAddr).then(jsonData=>{
						// 初始化and注册地图
						self_.myChart = echarts.init(self_.$refs.openingChart);
						echarts.registerMap(initAddr, jsonData);
						let optionXyMap = self_.buildXyMap(initAddr);
						self_.myChart.setOption(optionXyMap);
						self_.loading = false;
						resolve(true);
					});
				});
			})
		},
		back() {
			let {initAddr} = this;
			this.showBtn = false;
			this.myChart.clear();
			let optionXyMap = this.buildXyMap(initAddr);
			this.myChart.setOption(optionXyMap);
		},
		buildXyMap(name){
			let {mapData, unit} = this;
			let visualMap = this.getMapRange(name);
			name = name||"china"
			this.$emit("callback", name);
			let optionXyMap = {
				grid: {
					right: "2%",
					top: "10%",
					bottom: "10%",
					width: "18%",
				},
				tooltip: {
					formatter: function (e, t, n) {
						return `${e.name}：${e.value?e.value:0}${unit}`;
					},
				},
				geo: {
					map: name,
					show: true,
					zoom: 1.2,
					aspectScale: 0.75,
					roam: false,//['460000'].includes(name),//可缩放移动,
					scaleLimit:{min:1,max:6},
					layoutCenter: ["50%", "50%"],
					layoutSize: this.layoutSize,
					label: {
						emphasis: {
							show: false,
						},
					},
					itemStyle: {
						normal: {
							borderColor: "rgba(0,63,140,0.2)",
							shadowColor: "rgba(0,63,140,0.2)",
							shadowOffsetY: 10,
							shadowBlur: 10,
							// borderWidth: 1.5,
							// areaColor: "#a5f0cb",
						},
						// emphasis: {
						// 	areaColor: "#e54662",
						// 	shadowOffsetX: 0,
						// 	shadowOffsetY: 0,
						// 	borderWidth: 0,
						// },
					},
				},
				series: [
					{
						map: name,
						type: "map",
						data: mapData,
						zoom: 1.2,
						aspectScale: 0.75,
						roam: false,//['460000'].includes(name),//可缩放移动
						scaleLimit:{min:1,max:6}, //缩放范围
						layoutCenter: ["50%", "50%"],
						layoutSize: this.layoutSize,
						label: {
							normal: {
								show: true,
								fontSize: 10,
								color: "rgba(0,0,0,0.7)",
							},
							emphasis: {
								show: true,
							},
						},
						itemStyle: {
							normal: {
								areaColor: "#B2CAE0",
								borderColor: "#fff",
								borderWidth: 1,
							},
							emphasis: {
								areaColor: "#FFAE00",
							},
						},
					},
				],
				visualMap: visualMap,
			}
			return optionXyMap;
		},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.echartMapButton{
	position: absolute;
	/*right: 0px;*/
	/*top: -30px;*/
	z-index: 1000;
}
</style>
