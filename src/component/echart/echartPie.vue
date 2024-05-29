<template>
	<div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts';

export default {
	props: {
		className: {
			type: String,
			default: 'chart'
		},
		width: {
			type: String,
			default: '100%'
		},
		height: {
			type: String,
			default: '250px'
		},
		label: {
			type: Object,
			default: function () {
				return {
					show: false,

					formatter: '{c}%',
				}
			}
		},
		full: {
			type: Object,
			default: function () {
				return {
					center:['50%', '45%'],
					radius: ['41%', '60%'],
				}
			}
		},
		data: {
			type: Object,
			default: function () {
				return {
					name: '任务统计',
					color: ['#6B9BFD', '#4ED9A0', '#FFCB32', '#F17665','#67CDF7', '#FFA257'],

					series: [
						{ value: 320, name: '未进行' },
						{ value: 240, name: '执行中' },
						{ value: 149, name: '已完成' },
						{ value: 100, name: '暂停' },
						{ value: 220, name: '重启' },
					],
				};
			},
		}
	},
	data() {
		return {
			chart: null
		}
	},
	mounted() {
		this.$nextTick(() => {
			this.initChart()
		})
	},
	beforeDestroy() {
		if (!this.chart) {
			return
		}
	},
	watch: {
		data(newData, oldData) {
			this.initChart();
		},
	},
	methods: {
		initChart() {
			this.chart = echarts.init(this.$el)

			let legendArray =[]
			for(let x in this.data.series){
				legendArray.push(this.data.series[x].name)
			}

			this.chart.setOption({

				legend: {
					icon: 'circle',
					itemGap: 13,
					data: legendArray,
					left: 'center',
					bottom: '0',
					itemWidth: 6,
					itemHeight: 6,
					// formatter: (parmes)=> {
					// 	return this.data.name+'<br>'+parmes.name+'：'+parmes.value+'%';
					// },
				},
				tooltip: {
					textStyle: {
						color: "#222",
					},
					backgroundColor: "rgba(255,255,255,0.9)",
					borderColor: "#e2e7ec",
					borderWidth: 1,
					formatter: (parmes)=> {
						let title =this.data.name;
						let marker =parmes.marker;
						let name =parmes.name;
						let data =(parmes.data.data!=null?parmes.data.data:'') + (parmes.data.unit??'') + "  ";
						let value =parmes.value+'%';
						return `${title}<br>${marker}${name}：${data}${value}`;
					},
				},
				series: [
					{
						name: this.data.name,
						type: 'pie',
						color: this.data.color,
						center: this.full.center,
						radius: this.full.radius,
						avoidLabelOverlap: true,
						startAngle: 90,
						label: {
							normal: {

								show: true,

								fontSize: 12,
								fontFamily: 'DIN',
								color: '#595959',
								formatter: this.label?this.label.formatter:'{b}\n{c}',
							}
						},
						labelLine: {
							normal: {
								show: true,
								length: 10,
								length2: 10,
							}
						},

						data: this.data.series,
						animationEasing: 'cubicInOut',
						animationDuration: 2600
					}
				]
			})
			var index = 0 // 播放所在下标
			// setInterval(() => {
			//   this.chart.dispatchAction({
			//     type: 'showTip',
			//     seriesIndex: 0, // 第几条series
			//     dataIndex: index // 第几个tooltip
			//   })
			//   index++
			//   if (index > 3) {
			//     index = 0
			//   }
			// }, 2000)
			window.addEventListener('resize', () => {
				this.chart.resize();
			});
		}

	}
}
</script>
