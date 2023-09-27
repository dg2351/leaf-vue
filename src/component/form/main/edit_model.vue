<template>
	<a-form-model v-else :ref="alias" :class="className"
					  :rules="rules"
					  :model="sourceData"
					  :label-col="{ span: labelCol }"
					  :wrapper-col="{ span: wrapperCol }">
		<template v-if="formConfig.collapse && formConfig.collapse.length > 0">
			<template v-for="collapse in formConfig.collapse">
				<a-collapse v-model="formConfig.collapseKey">
					<a-collapse-panel :key="collapse.label" :header="collapse.label">
						<a-row>
							<a-col v-if="!item.hidden && collapse.data.includes(item.model)"
								   v-for="item in formConfig.data"
								   :span="item.span?item.span:wrapperCol">
								<a-form-model-item :label="item.label" :prop="item.model"
												   :label-col="{span:item.labelCol?item.labelCol:labelCol}"
												   :wrapper-col="{span:item.wrapperCol?item.wrapperCol:wrapperCol}">
									<subMain :item="item" :form-config="formConfig" :source-data="sourceData"/>
								</a-form-model-item>
							</a-col>
						</a-row>
					</a-collapse-panel>
				</a-collapse>
			</template>
		</template>
		<a-row v-else>
			<a-col v-for="item in formConfig.data" v-if="!item.hidden"
				   :span="item.span?item.span:wrapperCol">
				<a-form-model-item :label="item.label" :prop="item.model"
								   :label-col="{span:item.labelCol?item.labelCol:labelCol}"
								   :wrapper-col="{span:item.wrapperCol?item.wrapperCol:wrapperCol}">
					<subMain :item="item" :form-config="formConfig" :source-data="sourceData"/>
				</a-form-model-item>
			</a-col>
		</a-row>
	</a-form-model>
</template>

<script>
import subMain from "@/component/form/sub/subMain";
import moment from "moment";

export default {
	name: "edit_model",
	props: {
		// 样式名称
		className: {
			type: String,
			default: 'from_model'
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
					disabled: false,
					form: {},
					data: []
				}
			}
		},
	},
	components:{
		subMain,
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
			this.rules[item.model] = item.rule;
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
					let value = formData[item.model];
					formData[item.model] = value && value.length>0 ? value.join(',') : '';
				})
				// 日期格式化
				that.formConfig.data.filter(p=>['date','datetime'].includes(p.type)).forEach(item=>{
					let value = formData[item.model];
					formData[item.model] = value ? moment(value).format("YYYY-MM-DD HH:mm:ss") : null;
				})
				// 富文本格式化
				that.formConfig.data.filter(p=>p.type=='richtext').forEach(item=>{
					let value = formData[item.model];
					formData[item.model] = '<div class="ql-editor">'+value+'</div>';
				});
				// 文件格式化
				that.formConfig.data.filter(p=>['file'].includes(p.type)).forEach(item=>{
					let value = formData[item.model];
					formData[item.model] = value ? value : '[]';
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
