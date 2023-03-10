<template>
    <div>
		<RichText class="" :text="formConfig.form[item.model]"
				  v-if="!(item.readonly || formConfig.readonly)" @editorChange="value=>editorChange(item.model,value)"></RichText>
		<p v-else class="content_wrap">{{formConfig.form[item.model]}}</p>
		<!--<slot name="extraFormItem"></slot>-->
	</div>
</template>

<script>
import RichText from "./rich-text.vue"
export default {
	name: "subRichText",
	props:['formConfig', 'item'],
	components:{
		RichText,
	},
	methods:{
		// 富文本事件
		editorChange(key, e){
			// let html = '<div class="ql-editor">'+html+'</div>';
			this.formConfig.form[key] = e.html;
			this.formConfig.form[key+'_text'] = e.text;
		},
	}
}
</script>

<style scoped>

</style>