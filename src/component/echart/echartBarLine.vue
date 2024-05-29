// 主要使用
<template>
	<div class="tubiao" style="padding-top: 0rpx" :style="{width: '100%',  height: height }">123
		<div  :style="{ width:width, height: '100%' }"></div>
	</div>
</template>

<script>
import * as echarts from "echarts";
// import echarts from '@/components/echarts/echarts.vue';

export default {
	// 3aa1ff、88d1ea，36cbcb，82dfbe，4ecb73，acdf82，fad336
	name: "Echart_bar",
	props: {
		dataZoom:Number,//显示几个、多余的可滚动
		dataZoomShow:{
			type:Boolean,
			default: false,
		},
		fileName:String,
		height: String,
		width: {
			type: String,
			default: "100%",
		},
		barGap: {
			type: String,
			default: null,
		},
		barWidth: {
			type: String,
			default: null,
		},
		label: {
			type: String,
			default: null,
		},
		unitL: {
			type: String,
			default: "",
		},
		unitR: {
			type: String,
			default: "",
		},
		textName: String,
		// 两个要一样
		grid: {
			type: Array,
			default:()=>[
				{
					left: "30",
					right: "5",
					bottom: "50",
					top: "10",
					containLabel: false,
				},
				{
					left: "30",
					right: "5",
					bottom: "50",
					top: "10",
					containLabel: false,
				},
			],
		},

		dataA: {
			type: Object,
			default() {
				return {
					xAxis: ["2020", "2021", "2022"],
					data: [],
					dataLine: [],
				};
			},
		},
		toolbox: {
			type: Object,
			default: () => {
				return {
					show: false,
					right: '0',
					top: 'top'
				}
			}
		}
	},
	data() {
		return {
			myChart: null,
		};
	},
	mounted() {
		this.flashData();
	},
	watch: {
		dataA: {
			//监听的对象
			deep: true, //深度监听设置为 true
			handler: function (newV, oldV) {
				this.dataA = newV;
				this.myChart.dispose();
				this.flashData();
			},
		},
	},
	methods: {
		flashData() {
			let {unitL,unitR,textName} = this;
			this.myChart = echarts.init(this.$el);
			let dataZoom = this.dataA.xAxis.length-1 > (this.dataZoom||11) ? (this.dataZoom||11) : this.dataA.xAxis.length-1
			let series = [];
			let legendName = [];
			let max = 0;

			if (this.dataA.data) {
				this.dataA.data.forEach((element) => {
					if (max < Math.max(...element.value)) {
						max = Math.max(...element.value);
					}
					legendName.push(element.name);
					if (element.k) {
						series.push({
							yAxisIndex: 2,
							xAxisIndex: 1,
							name: element.name,
							type: "bar",
							barWidth: this.barWidth ? this.barWidth : "20%",
							barGap: this.barGap,
							itemStyle: {
								normal: {
									label: {
										show: element.label ? element.label : false, //开启显示
										position: element.label ? element.label : "inside",
										textStyle: {
											// color: element.color[2],
											color: "rgba(0,0,0)",
											fontSize: 12,
										},
										formatter: function (params) {
											if (element.proportion) {
												let mas = element.proportion[params.dataIndex] + "%";
												return mas;
											} else {
												return params.data;
											}
										},
									},
									color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
										{
											offset: 1,
											color: element.color[0],
										},
										{
											offset: 0,
											color: element.color[0],
										},
									]),
								},
							},
							z: 3,
							data: element.value,
						});
					} else {
						series.push({
							name: element.name,
							stack: element.stack,
							type: "bar",
							barWidth: this.barWidth ? this.barWidth : "",
							barGap: this.barGap,
							itemStyle: {
								normal: {
									label: {
										show: element.label ? element.label : false, //开启显示
										position: element.label ? element.label : "inside",
										textStyle: {
											// color: element.color[2],
											color: "#595959",
											fontSize: 10,
											fontFamily: 'DIN'
										},
										formatter: function (params) {
											if (element.proportion) {
												let mas = element.proportion[params.dataIndex] + "%";
												return mas;
											} else {
												// console.log(params, 121212);
												return params.data;
											}
										},
									},
									// borderWidth: 6,
									// borderColor: "rgba(0,0,0,0)",
									color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
										{
											offset: 1,
											color: element.color[0],
										},
										{
											offset: 0,
											color: element.color[0],
										},
									]),
								},
							},
							z: 3,
							data: element.value,
						});
					}
				});
			}

			if (this.dataA.dataLine) {
				this.dataA.dataLine.forEach((element) => {
					legendName.push(element.name);
					series.push({
						name: element.dataname,
						yAxisIndex: 1,
						type: "line",
						data: element.value,
						symbol: 'none',
						smooth: element.smooth != null ? element.smooth : false,
						z: 7,
						itemStyle: {
							normal: {
								color: element.colors,
								borderColor: element.colors,
								lineStyle: {
									normal: {
									color: element.colors,
									}
								},
							},
						},
						tooltip: {
							trigger: "axis",
							formatter: "{value}%",
							axisPointer: {
								lineStyle: {
									color: "#dadada",
								},
							},
						},
					});
				});
			}
			let option = {
				legend: {
					show:true,
					icon: 'circle',
					bottom: 0,
					itemWidth: 6,
					itemHeight: 6,
					left: "center",
					padding: 0,
					textStyle: {
						color: "#595959",
						fontSize: 12,
						fontFamily: 'DIN'
					},
					 data: legendName,
				},
				//下载图片 fileName为下载的文件名称
				toolbox: {
					show: this.toolbox.show,
					orient: "vertical",
					right: this.toolbox.right,
					top: this.toolbox.top,
					feature: {
						saveAsImage: { show: true,name:this.fileName },  // 保存图表
					},
				},
				tooltip: {
					show: true,
					trigger: "axis",
					formatter: function (parmes) {
						let value = "";
						let arrObj = parmes.sort((a, b) => {
							return a.seriesIndex - b.seriesIndex;
						});
						arrObj.forEach(function (a) {
							a.data = a.data != undefined ? a.data : "--";
							if (a.componentSubType == "line") {
								value = value + (textName?textName:a.seriesName) + "：" + a.data + unitR+"<br>";
							} else {
								value = value + (textName?textName:a.seriesName) + "：" + a.data + unitL + " <br>";
							}
						});
						return value;
						// console.log(parmes)
					},
					// formatter:'{a}:{c}<br>{a1}:{c1}<br>{a2}:{c2}%<br>{a3}:{c3}%<br>{a4}:{c4}%<br>{a5}:{c5}%<br>{a6}:{c6}<br>{a7}:{c7}',
					axisPointer: {
						lineStyle: {
							color: "#dadada",
						},
					},
					textStyle: {
						color: "#222",
					},
					backgroundColor: "rgba(255,255,255,0.9)",
					borderColor: "#e2e7ec",
					borderWidth: 1,
				},
				grid: this.grid
					? this.grid
					: [
						{
							left: "30",
							right: "5",
							bottom: "20",
							top: "10",
							containLabel: false,
						},
						{
							left: "30",
							right: "5",
							bottom: "80",
							top: "10",
							containLabel: false,
						},
					],
				xAxis: [
					{
						type: "category",
						// inverse:true,
						axisLine: {
							lineStyle: {
								color: "#e7e7f5",
							},
						},
						axisLabel: {
							interval: 0, //强制显示文字
							formatter: function (params) {
								let str = "{a|" + params + "}";
								return str;
							},
							show: true,
							color: "#5f5f5f",
							fontFamily: 'DIN',
							rich: {
								a: {
									lineHeight: 18,
									fontFamily: 'DIN',
								},
							},
						},

						data: this.dataA.xAxis,
					},
					{
						type: "category",
						gridIndex: 1,
						axisPointer: {
								    	type: "none",  // 取消当前轴的坐标轴指示器
								  	},
						axisLine: {
							show: false,
							lineStyle: {
								color: "rgba(0,0,0,0)",
							},
						},
						axisLabel: {
							interval: 0, //强制显示文字
							formatter: function (params) {
								let str = "{a|" + params + "}";
								return str;
							},
							show: true,
							color: "rgba(0,0,0,0)",
							fontFamily: 'DIN',
							rich: {
								a: {
									lineHeight: 18,
									fontSize: 12,
									fontFamily: 'DIN'
								},
							},
						},

						data: this.dataA.xAxis,
					},
				],
				yAxis: [
					{
						max: max,
						axisTick: {
							show: false,
						},
						axisLine: {
							show: false,
							lineStyle: {
								color: "#e7e7f5",
							},
						},
						axisLabel: {
							show: true,
							color: "#5f5f5f",
							fontSize: 12,
							fontFamily: 'DIN'
						},
						splitLine: {
							lineStyle: {
								width: 1,
								type: "dashed",
								color: "#e7e7f5",
							},
						},

						show: true,
					},
					{
						position: this.dataA.data && this.dataA.data.length > 0 ? "right" : "left",
						axisTick: {
							show: false,
						},
						axisLine: {
							show: false,
							lineStyle: {
								color: "#e7e7f5",
							},
						},
						axisLabel: {
							show: true,
							color: "#5f5f5f",
							fontSize: 12,
							formatter: `{value}${unitR}`,
							fontFamily: 'DIN'
						},
						splitLine: {
							show: false,
							lineStyle: {
								width: 1,
								type: "dashed",
								color: "#e7e7f5",
							},
						},

						show: true,
					},
					{
						max: max,
						gridIndex: 1,
						axisTick: {
							show: false,
						},
						axisLine: {
							show: false,
						},
						axisLabel: {
							show: false,
						},
						splitLine: {
							show: false,
						},

						show: true,
					},
				],
				dataZoom: [
					{
						show: true,
						type: 'inside',
						startValue: 0,
						endValue: dataZoom,
						zoomLock: true ,
					},
					{
						show:this.dataZoomShow,
						type: 'slider' ,
						height:20,
						fillerColor: 'rgba(82, 174, 254, 0.1)',
						borderColor: 'rgba(82, 174, 254,0.05)' ,
						handleStyle: {
							color: 'rgba(82, 174, 254,1)',
						},
						dataBackground: {
							lineStyle: {
								color: 'rgba(82, 174, 254,1)',
							},
							areaStyle: {
								color: 'rgba(82, 174, 254,0.5)',
							}
						},
					}
				],
				series: series,
			};
			setTimeout(()=>{
				this.myChart.resize();
			},500)
			this.myChart.setOption(option);
			window.onresize = function () {
				if (this.myChart) {
					this.myChart.resize();
				}
			};
		},
		triggerLegendItemClick(legendName) {
			// 在点击事件A中触发 legend 中数据的点击事件
			this.myChart.dispatchAction({
				type: "legendToggleSelect", // 这里使用 'legendToggleSelect' 触发 legend 数据的点击事件
				name: legendName, // 要触发的数据系列名称
			});
		},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.tubiao {
	text-align: left;
}
</style>
