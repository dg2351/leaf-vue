<template>
	<a-form-model :ref="alias" :class="className" :rules="rules"
				  :model="sourceData" :label-col="{ span: labelCol }" :wrapper-col="{ span: wrapperCol }">
		<item v-for="(element,index) in formConfig.data" :index="index" :element="element"/>
	</a-form-model>
</template>

<script>
import item from "@/component/form/main/item";
import moment from "moment";

export default {
	name: "render_model",
	components:{item},
	props: {
		// 样式名称
		className: {
			type: String,
			default: 'from_model'
		},
		// 表单名称
		alias: {
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
					disabled: false,
					form: {},
					data: []
				}
			}
		},
	},
	data() {
		return {
			labelCol: 8,
			wrapperCol: 12,
			rules:{},
		};
	},
	created() {
		this.formConfig.data.forEach(item => {
			this.rules[item.vModel] = item.rule;
		});
	},
	methods:{
		// 表单方法
		formMethods(refs=this.alias){
			var ajax = {};
			var that = this;
			/**
			 * 获取数据
			 * @param validate 是否校验
			 */
			ajax.getData = function(validateData=true){
				let validate = true;
				if(validateData){
					that.$refs[refs].validate(valid=>{
						validate = !!valid;
					})
				}
				let formData = JSON.parse(JSON.stringify(that.sourceData));// 表单数据
				// 多选格式化
				that.formConfig.data.filter(p=>['selectTags'].includes(p.type)).forEach(item=>{
					let value = formData[item.vModel];
					formData[item.vModel] = value && value.length>0 ? value.join(',') : '';
				})
				// 日期格式化
				that.formConfig.data.filter(p=>['date','datetime'].includes(p.type)).forEach(item=>{
					let value = formData[item.vModel];
					formData[item.vModel] = value ? moment(value).format("YYYY-MM-DD HH:mm:ss") : null;
				})
				// 富文本格式化
				that.formConfig.data.filter(p=>p.type=='richtext').forEach(item=>{
					let value = formData[item.vModel];
					formData[item.vModel] = '<div class="ql-editor">'+value+'</div>';
				});
				// 文件格式化
				that.formConfig.data.filter(p=>['file'].includes(p.type)).forEach(item=>{
					let value = formData[item.vModel];
					formData[item.vModel] = value ? value : '[]';
				})
				return Object.assign({validate:validate,formData:formData});
			}
			return ajax
		},
	}
}
</script>

<style scoped lang="less">
.content_wrap{
	white-space: pre-wrap;
}
.ant-form-explain {
	position: absolute;
	/*margin-top: -5px;*/
}
/deep/ .ant-row.ant-form-item{
	align-items: flex-start;
}
</style>
