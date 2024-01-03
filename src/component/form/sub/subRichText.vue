<template>
    <div>
		<RichText class="" :text="sourceData[item.vModel]"
				  v-if="!(item.readonly || formConfig.readonly)" @editorChange="value=>editorChange(item.vModel,value)"></RichText>
		<p v-else class="content_wrap">{{sourceData[item.vModel]}}</p>
		<!--<slot name="extraFormItem"></slot>-->
	</div>
</template>

<script>
import RichText from "./rich-text.vue"
export default {
	name: "subRichText",
	props:['sourceData','formConfig', 'item'],
	components:{
		RichText,
	},
	methods:{
		// 富文本事件
		editorChange(key, e){
			// let html = '<div class="ql-editor">'+html+'</div>';
			this.sourceData[key] = e.html;
			this.sourceData[key+'_text'] = e.text;
		},
	}
}
</script>

<style scoped>

</style>
