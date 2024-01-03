<template>
	<!-- 加载 -->
	<a-spin :spinning="formConfig.loading">
		<template v-if="formConfig.render">
			<render_model :alias="alias" :className="className" :sourceData="sourceData" :formConfig="formConfig">
				<template :slot="val.vModel" v-for="val in formConfig.data.filter(p=>p.type == 'slot')">
					<slot :name="val.vModel"/>
				</template>
			</render_model>
		</template>
		<template v-else>
			<view_model v-if="formConfig.disabled"
						:alias="alias" :className="className"
						:sourceData="sourceData"
						:formConfig="formConfig">
				<template :slot="val.vModel" v-for="val in formConfig.data.filter(p=>p.type == 'slot')">
					<slot :name="val.vModel"/>
				</template>
			</view_model>
			<edit_model v-if="!formConfig.disabled"
						ref="edit_model"
						:alias="alias" :className="className"
						:sourceData="sourceData"
						:formConfig="formConfig">
				<template :slot="val.vModel" v-for="val in formConfig.data.filter(p=>p.type == 'slot')">
					<slot :name="val.vModel"/>
				</template>
			</edit_model>
		</template>
	</a-spin>
</template>

<script>
import view_model from "@/component/form/main/view_model";
import edit_model from "@/component/form/main/edit_model";
import render_model from "@/component/form/main/render_model";
import {mapState} from "vuex";
import FormMethods from "@/plugins/js-comps/FormMethods";

function getFormData(obj, key){
	return obj[key]?obj[key]:'';
}
export default {
	name: "from_model",
	props: {
		// 样式名称
		className: String,
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
					data: []
				}
			}
		},
		// loadFunc的查询参数
		params: {},
		loadFunc: {type: Function}
	},
	components: {
		view_model,edit_model,render_model,
	},
	computed: {
		...mapState({
			styleCode: state => state.styleCode,
		}),
	},
	created() {
		this.formConfig.data.forEach(item => {
			// 选择框初始化方法
			if(['input','radio','select','selectTags','selectTree'].includes(item.type)){
				// 初始化方法
				if(!item.searchFunction)
					item.searchFunction = function () {}
				if(!item.changeFunction)
					item.changeFunction = function () {}
				if(!item.popupScroll)
					item.popupScroll = function () {}
			}
			if(item.initFunction){
				item.initFunction(item)
			}
		});
		// 加载load方法
		this.formMethods().load();
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
				return that.$refs['edit_model'].formMethods(refs).getData(validateData)
			}
			/**
			 * 保存表单
			 * @param alias 表单标识
			 * @param formData 表单数据
			 * @param callback 回调
			 */
			ajax.save = function (alias, formData, callback) {
				if(!alias) alias = that.alias
				FormBoListFunc.saveForm({
					data: formData,setting: {action: "save", alias: alias}
				}).then(res=>{
					if(res.success){// 给表单赋上ID_
						that.formConfig.form.ID_ = res.data.pk;
					}
					callback(res);
				});
			}
			/**
			 * 读取表单
			 */
			ajax.load = function (alias) {
				if(!that.alias || !that.params){
					that.formConfig.loading = false;
					return
				}
				if(!alias) alias = that.alias
				FormMethods.invokeCustomQueryPromise(alias, that.params).then(res=>{
					let sourceData = {};
					if(res.success && res.data && res.data.length > 0){
						Object.keys(res.data[0]).forEach(key=>{
							// 过滤标准字段
							if(['ID_','UPDATE_VERSION_'].includes(key)){
								sourceData[key] = res.data[0][key]
							}else{
								sourceData[key.toLowerCase()] = res.data[0][key]
							}
						});
					}
					that.formConfig.data.filter(p=>['file','fileImg','richtext'].includes(p.type)).forEach(m=>{
						if(!sourceData[m.vModel]){
							sourceData[m.vModel] = "";
						}
					})
					if(that.loadFunc){// 获取存在回调时进行回调处理
						that.loadFunc(sourceData)
					}else{
						that.formConfig.form = sourceData;
						that.formConfig.loading = false;
					}
				})
			}
			return ajax
		},
	}
}
</script>

<style scoped>

</style>
