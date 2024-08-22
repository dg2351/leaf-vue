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
		full: {
			type: Object,
			default: function () {
				return {
					center:['50%', '45%'],
					radius: ['30%', '60%'],
					radius2: ['30%', '50%'],
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
		},
		//
		max:{type:Number,default:6},
		// 浮框
		tips:{type:Boolean,default:true},
		// roseType
		roseType:{type:Boolean,default:false},
		// label
		label:{type:Boolean,default:false},
		labelColor:{type:String,default:'inherit'},
		labelFormatter:{type:Function,default:null},
		labelLine:{type:Boolean,default:false},
		fontSize:{type:Number,default:12},
		// 是否展示可视化的工具箱
		toolbox:{type:Boolean,default:false},
		// 下钻事件
		restore:{type:Boolean,default:false},
		// 百分比图层
		percent:{type:Boolean,default:false},
		// 过滤空值
		filter:{type:Boolean,default:true},
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
		getData(series){
			let {max} = this;
			let pid = this.pid;
			let data = this.filter ? series.filter(p=>p.value != 0) : series;
			if(pid != null)
				data = data.filter(p=>!p.pid || String(p.pid)===String(pid)).map(m=>{return m});
			let result = [];
			let other = {name:"其它", value:0};
			data.forEach((map,i)=>{
				if(i<max)
					result.push({name:map.name, value:map.value})
				else
					other.value += map.value;
			});
			if(other.value > 0)
				result.push(other)
			return result;
		},
		initChart() {
			this.chart = echarts.init(this.$el)
			let series = this.getData(this.data.series)
			let option = {
				legend: {
					icon: 'circle',
					itemGap: 13,
					data: series.map(m=>{return m.name}),
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
						let marker =parmes.marker;
						let name =parmes.name;
						let data =(parmes.data.data!=null?parmes.data.data:'') + (parmes.data.unit??'') + "  ";
						let value =parmes.value+'%';
						return `${marker}${name}：${data}${value}`;
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
								show: !!this.label,
								fontSize: this.fontSize,
								fontFamily: 'DIN',
								color: this.labelColor,
								formatter: this.label?this.label.formatter:'{b}\n{d}%',
								lineHeight:20,
							}
						},
						labelLine: {
							normal: {
								show: true,
								length: 10,
								length2: 10,
							}
						},
						data: series,
						animationEasing: 'cubicInOut',
						animationDuration: 2600
					},
					{
						radius: this.full.radius2,
						center: this.full.center,
						type: "pie",
						roseType: this.roseType??'radius',
						itemStyle: {
							normal: {
								color: 'rgba(255,255,255,0.3)',
							},
						},
						labelLine: {
							normal: {
								show: false,
							},
						},
						label: {
							normal: {
								show: false,
							},
						},
						data: [1],
						tooltip: {
							show: false,

						},
					},
				]
			}
			this.chart.setOption(option)
			window.addEventListener('resize', () => {
				this.chart.resize();
			});
		}

	}
}
</script>
