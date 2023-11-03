<template>
    <div>
		<!--输入框-->
		<template v-if="item.type==='input'">
			<template v-if="!(item.readonly || formConfig.readonly)">
				<a-input-number :style="item.style" v-if="item.inputType=='number'"
								v-model="sourceData[item.model]"
								:min="item.min" :max="item.max"
								:disabled="item.disabled || formConfig.disabled"
								:suffix="item.suffix ?? ''"
								:formatter="value => `${value}${item.suffix??''}`"
								:parser="value => value.replace(item.suffix??'', '')"
								@change="value=>item.changeFunction(value, item)"/>
				<a-input-password :style="item.style" v-else-if="item.inputType=='password'"
								  v-model="sourceData[item.model]"
								  :addon-before="item.addonBefore"
								  :allowClear="item.allowClear"
								  :disabled="item.disabled || formConfig.disabled"
								  :suffix="item.suffix"
								  :maxLength="item.maxLength?item.maxLength:100"/>
				<a-input :style="item.style" v-else
						 @input="sourceData[item.model] = sensitiveFormat(sourceData[item.model])"
						 v-model="sourceData[item.model]"
						 :addon-before="item.addonBefore"
						 :allowClear="item.allowClear"
						 :disabled="item.disabled || formConfig.disabled"
						 :suffix="item.suffix"
						 :placeholder="item.placeholder"
						 :maxLength="item.maxLength?item.maxLength:100"/>
			</template>
			<p v-else class="content_wrap">{{getValue(item)}}{{item.suffix ? item.suffix: ''}}</p>
		</template>
		<!--输入框-->
		<template v-if="item.type==='between'">
			<a-input style="width:calc(50% - 15px); text-align: center" :style="item.config[0].style"
					 @input="sourceData[item.config[0].model] = sensitiveFormat(sourceData[item.config[0].model])"
					 v-model="sourceData[item.config[0].model]"
					 :addon-before="item.config[0].addonBefore"
					 :disabled="item.config[0].disabled || formConfig.disabled"
					 :suffix="item.config[0].suffix"
					 :maxLength="item.maxLength?item.maxLength:100"
					 :placeholder="item.config[0].placeholder"
					 @change="value=>item.config[0].changeFunction(value, item)"/>
			<a-input style="width: 30px; border-left: 0; pointer-events: none; backgroundColor: #fff"
					 placeholder="~"disabled/>
			<a-input style="width:calc(50% - 15px); text-align: center" :style="item.config[1].style"
					 @input="sourceData[item.config[1].model] = sensitiveFormat(sourceData[item.config[1].model])"
					 v-model="sourceData[item.config[1].model]"
					 :addon-before="item.config[1].addonBefore"
					 :disabled="item.config[1].disabled || formConfig.disabled"
					 :suffix="item.config[1].suffix"
					 :maxLength="item.maxLength?item.maxLength:100"
					 :placeholder="item.config[1].placeholder"
					 @change="value=>item.config[1].changeFunction(value, item)"/>
		</template>
		<!--文本框-->
		<template v-else-if="item.type==='textarea'">
			<a-textarea :style="item.style" v-if="!(item.readonly || formConfig.readonly)"
						@input="sourceData[item.model] = sensitiveFormat(sourceData[item.model])"
						v-model="sourceData[item.model]"
						:readOnly="item.readonly || formConfig.readonly"
						:disabled="item.disabled || formConfig.disabled"
						:maxLength="item.maxLength?item.maxLength:100"
						:placeholder="item.placeholder"
						:auto-size="{
										minRows: item.minRows?item.minRows:3,
										maxRows: item.maxRows?item.maxRows:5
									}"/>
			<p v-else class="content_wrap">{{getValue(item)}}</p>
		</template>
		<!--选择-->
		<template v-else-if="item.type==='radio'">
			<a-radio-group v-model="sourceData[item.model]"
						   v-if="!(item.readonly || formConfig.readonly)"
						   :options="item.data"
						   :readOnly="item.readonly || formConfig.readonly"
						   :disabled="formConfig.disabled"
						   @change="e=>item.changeFunction(e.target.value, item)">
				<!--<a-radio v-for="(ls,index) in item.radio" :value="ls.value">{{ ls.label }}</a-radio>-->
			</a-radio-group>
			<p v-else class="content_wrap">{{getValue(item)}}</p>
		</template>
		<!--选择-->
		<template v-else-if="item.type==='select'">
			<template v-if="!(item.readonly || formConfig.readonly)">
				<a-select v-model="sourceData[item.model]"
						  :style="item.style"
						  :show-search="item.showSearch"
						  :allowClear="item.allowClear"
						  :filter-option="false"
						  :not-found-content="item.fetching ? undefined : null"
						  :options="item.data"
						  option-filter-prop="children"
						  @search="value=>item.searchFunction(value, item)"
						  @change="value=>item.changeFunction(value, item)"
						  @popupScroll="value=>item.popupScroll(value, item)"
						  :readOnly="item.readonly || formConfig.readonly"
						  :disabled="item.disabled || formConfig.disabled"
						  :placeholder="item.placeholder"
						  :getPopupContainer="triggerNode => {return triggerNode.parentNode || document.body;}">
					<template v-if="item.fetching" #notFoundContent>
						<a-spin size="small"/>
					</template>
				</a-select>
			</template>
			<p v-else class="content_wrap">{{getValue(item)}}</p>
		</template>
		<!--多选择-->
		<template v-else-if="item.type==='selectTags'">
			<a-select mode="multiple" v-model="sourceData[item.model]"
					  v-if="!(item.readonly || formConfig.readonly)"
					  :style="item.style"
					  :show-search="item.showSearch"
					  :options="item.data"
					  option-filter-prop="children"
					  @change="value=>item.changeFunction(value, item.data)"
					  :readOnly="item.readonly || formConfig.readonly"
					  :disabled="item.disabled || formConfig.disabled"
					  :placeholder="item.placeholder"
					  :getPopupContainer="triggerNode => {return triggerNode.parentNode || document.body;}">
				<!--<a-select-option v-for="(ls,index) in item.select" :value="ls.value">{{ ls.label }}</a-select-option>-->
			</a-select>
			<p v-else class="content_wrap">{{getValue(item)}}</p>
		</template>
		<!--树状选择-->
		<template v-else-if="item.type==='selectTree'">
			<a-tree-select :style="item.style"
						   v-if="!(item.readonly || formConfig.readonly)"
						   v-model="sourceData[item.model]"
						   :tree-checkable="item.treeCheckable??false"
						   :tree-data="item.data" :maxTagCount="item.maxTagCount??1"
						   :search-placeholder="item.placeholder?item.placeholder:('请选择'+item.label)"
						   :readOnly="item.readonly || formConfig.readonly"
						   :disabled="item.disabled || formConfig.disabled"
						   :getPopupContainer="triggerNode => {return triggerNode.parentNode || document.body;}"
						   @change="value=>item.changeFunction(value, item.data)"/>
			<p v-else class="content_wrap">{{getValue(item)}}</p>
		</template>
		<!--滑块-->
		<template v-else-if="item.type==='switch'">
			<a-switch :default-checked="sourceData[item.model]"
					  @change="value=>{sourceData[item.model]=value}"/>
		</template>
		<!--日期-->
		<template v-if="item.type==='date'">
			<a-date-picker style="width: 100%;"
						   v-if="!(item.readonly || formConfig.readonly)"
						   v-model="sourceData[item.model]"
						   :placeholder="item.placeholder"
						   :inputReadOnly="item.readonly || formConfig.readonly"
						   :disabled="item.disabled || formConfig.disabled"
						   :getCalendarContainer="triggerNode => {return triggerNode.parentNode || document.body;}"/>
			<p v-else class="content_wrap">{{getValue(item)}}</p>
		</template>
		<!--日期 时间-->
		<template v-if="item.type==='datetime'">
			<a-date-picker style="width: 100%;"
						   format="YYYY-MM-DD HH:mm:ss"
						   :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
						   v-if="!(item.readonly || formConfig.readonly)"
						   v-model="sourceData[item.model]"
						   :placeholder="item.placeholder"
						   :inputReadOnly="item.readonly || formConfig.readonly"
						   :disabled="item.disabled || formConfig.disabled"
						   :getCalendarContainer="triggerNode => {return triggerNode.parentNode || document.body;}"/>
			<p v-else class="content_wrap">{{getValue(item)}}</p>
		</template>
		<!--级联-->
		<template v-else-if="item.type==='cascader'">
			<a-cascader :style="item.style"
						v-model="sourceData[item.model]"
						v-if="!(item.readonly || formConfig.readonly)"
						:placeholder="item.placeholder"
						:readOnly="item.readonly || formConfig.readonly"
						:disabled="item.disabled || formConfig.disabled"
						:options="item.data"
						change-on-select
						:field-names="{ label: 'label', value: 'label', children: 'children' }"
						:default-value="[]"
						:getPopupContainer="triggerNode => {return triggerNode.parentNode || document.body;}"/>
			<p v-else class="content_wrap">{{getValue(item)}}</p>
		</template>
		<!--文件上传-->
		<subFile v-else-if="item.type==='file'" :sourceData="sourceData" :formConfig="formConfig" :item="item"/>
		<!--图片上传-->
		<subFileImg v-else-if="item.type==='fileImg'" :sourceData="sourceData" :formConfig="formConfig" :item="item"/>
		<!-- 富文本 -->
		<subRichText v-else-if="item.type==='richtext'" :sourceData="sourceData" :formConfig="formConfig" :item="item"/>
		<!-- 代码编辑器 -->
		<subCodemirror v-else-if="item.type==='codemirror'" :sourceData="sourceData" :formConfig="formConfig" :item="item"/>
		<!-- 百度地图 -->
		<subBaiduMap v-else-if="item.type==='baiduMap'" :sourceData="sourceData" :formConfig="formConfig" :item="item"/>
		<!-- 对话弹框 -->
		<subDialogbox v-else-if="item.type==='dialogbox'" :sourceData="sourceData" :formConfig="formConfig" :item="item"/>
		<!-- 自定义插槽 -->
		<slot :name="item.model" v-else-if="item.type==='slot'" :sourceData="sourceData" :formConfig="formConfig" :item="item"/>
	</div>
</template>

<script>
import subFile from "@/component/form/sub/subFile";
import subFileImg from "@/component/form/sub/subFileImg";
import subRichText from "@/component/form/sub/subRichText";
import subBaiduMap from "@/component/form/sub/subBaiduMap";
import subDialogbox from "@/component/form/sub/subDialogbox";
import subCodemirror from "@/component/form/sub/subCodemirror";
import Vue from "vue";

export default {
	name: "subMain",
	props: {
		// 组件配置
		item: Object,
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
		subFile,subFileImg,subRichText,subBaiduMap,subDialogbox,subCodemirror
	},
	methods:{
		//过滤敏感字符，不能输入
		sensitiveFormat(val){
			if(typeof val === "string" || val instanceof String){
				return Vue.filter('sensitive')(val)
			} else{
				return val;
			}
		},
		getValue: function (item) {
			let value = this.sourceData[item.model];
			if(["radio","select"].includes(item.type)){
				let select = item.data.filter(p=>p.value==value);
				value = select.length > 0 ? select[0].label : value;
			} else if(["file","fileImg"].includes(item.type)){
				value = value ? JSON.parse(value) : []
			} else if(["cascader","address"].includes(item.type)){
				value = value ? value.join('') : ''
			}
			return value;
		},
	}
}
</script>

<style scoped>

</style>
