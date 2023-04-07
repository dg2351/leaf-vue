<template>
    <div>
		<a-input v-model="sourceData[item.model]" hidden/>
		<a-upload :showUploadList="true" :multiple="true"
				  v-if="!(item.readonly || formConfig.readonly)"
				  :disabled="item.disabled || formConfig.disabled"
				  :remove="value=>removeFile(value, item.model, item.file)"
				  :before-upload="value => uploadFile(value, item.model, item.file)"
				  :file-list="sourceData[item.model]?JSON.parse(sourceData[item.model]):[]">
			<a-button type="primary" v-if="!formConfig.disabled">
				<a-icon type="upload"/>{{item.file.text?item.file.text:'上传附件'}}
			</a-button>
			<span class="mL10" style="color: #8c939d"  v-if="item.remark">{{item.remark}}</span>
		</a-upload>
		<a-upload v-else :showUploadList="true" :multiple="true" :disabled="true" :file-list="getValue(item)"/>
	</div>
</template>

<script>
import FuncFile from "../js/FuncFile";
export default {
	name: "subFile",
	mixins:[FuncFile],
	props:['sourceData', 'formConfig', 'item'],
	methods:{
		getValue: function (item) {
			let value = this.sourceData[item.model];
			if(["file","fileImg"].includes(item.type)){
				value = value ? JSON.parse(value) : []
			}
			return value;
		},
	}
}
</script>

<style scoped>

</style>