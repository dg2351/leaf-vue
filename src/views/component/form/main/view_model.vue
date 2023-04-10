<template>
	<a-descriptions v-if="sourceData" :class="className" bordered :column="2">
		<template v-for="item in formConfig.data">
			<a-descriptions-item v-if="['input','textarea'].includes(item.type)" :label="getLabel(item)" :span="getSpan(item)">
				<p :class="item.class" :style="item.style" class="content_wrap" v-html="getValue(item)"></p>
			</a-descriptions-item>
			<a-descriptions-item v-if="['select','radio'].includes(item.type)" :label="getLabel(item)" :span="getSpan(item)">
				{{getValue(item)}}
			</a-descriptions-item>
			<a-descriptions-item v-if="item.type=='richtext'" :label="getLabel(item)" :span="getSpan(item)">
				<p :class="item.class" :style="item.style" class="content_wrap" v-html="getValue(item)"></p>
			</a-descriptions-item>
			<a-descriptions-item v-if="item.type=='file'" :label="getLabel(item)" :span="getSpan(item)">
				<a-upload :showUploadList="true" :multiple="true" :disabled="true" :file-list="getValue(item)"/>
			</a-descriptions-item>
			<a-descriptions-item v-if="item.type=='fileImg'" :label="getLabel(item)" :span="getSpan(item)">
				<img v-for="imgFile in getValue(item)" :src="imgFile.url" :width="item.imgWidth?item.imgWidth:'100px'"/>
			</a-descriptions-item>
			<a-descriptions-item v-if="item.type=='date'" :label="getLabel(item)" :span="getSpan(item)">
				{{getValue(item)}}
			</a-descriptions-item>
			<a-descriptions-item v-if="item.type=='datetime'" :label="getLabel(item)" :span="getSpan(item)">
				{{getValue(item)}}
			</a-descriptions-item>
		</template>
	</a-descriptions>
</template>

<script>
import moment from 'moment'
export default {
	name: "view_model",
	props: {
		// 样式名称
		className: {
			type: String,
			default: 'des_a mB20'
		},
		// 表单名称
		alias:{
			type: String,
			default: 'form'
		},
		// 表单参数
		sourceData: {
			type: Object,
			default:function() {
				return {}
			}
		},
		// 表单配置
		formConfig: {
			type: Object,
			default:function() {
				return {
					visible: false,
					loading: true,
					disabled: true,
					data: []
				}
			}
		},
	},
	data() {
		return {
			moment,
			labelCol: 8,
			wrapperCol: 12,
		};
	},
	methods:{
		getValue: function (item) {
			let value = this.sourceData[item.model];
			if(["radio","select"].includes(item.type)){
				let select = item.data.filter(p=>p.value==value);
				value = select.length > 0 ? select[0].label : value;
			} else if(["file","fileImg"].includes(item.type)){
				value = value ? JSON.parse(value) : []
			} else if(["date"].includes(item.type)){
				moment(value).format('YYYY-MM-DD')
			} else if(["datetime"].includes(item.type)){
				moment(value).format('YYYY-MM-DD HH:mm:ss')
			}
			if(!value){
				value = "-";
			}else if(value && item.suffix && typeof(value)!='object'){
				value = value +''+(item.suffix?item.suffix:'')
			}
			return value;
		},
		getLabel(item){
			return item.label;
		},
		getSpan(item){
			return item.span?item.span:1;
		},
		// 数值千分位转换
		numberToCurrencyNo(value) {
			if (!value) return 0
			// 获取整数部分
			const intPart = Math.trunc(value)
			// 整数部分处理，增加,
			const intPartFormat = intPart.toString().replace(/(d)(?=(?:d{3})+$)/g, '$1,')
			// 预定义小数部分
			let floatPart = ''
			// 将数值截取为小数部分和整数部分
			const valueArray = value.toString().split('.')
			if (valueArray.length === 2) { // 有小数部分
				floatPart = valueArray[1].toString() // 取得小数部分
				return intPartFormat + '.' + floatPart
			}
			return intPartFormat + floatPart
		}
	}
}
</script>

<style scoped lang="less">
</style>