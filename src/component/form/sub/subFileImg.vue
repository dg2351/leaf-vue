<template>
    <div>
		<a-input v-model="sourceData[item.vModel]" hidden/>
		<template v-if="!(item.readonly || formConfig.readonly)">
			<template v-for="imgFile in sourceData[item.vModel]?JSON.parse(sourceData[item.vModel]):[]">
				<div class="imgList">
					<img :src="imgFile.url" class="imgCard"
						 :width="item.imgWidth?item.imgWidth:'79px'"
						 :height="item.imgHeight?item.imgHeight:'79px'"/>
					<a class="close">
						<img class="pa" style="height: 18px;width: 18px;" src="../img/close.png"
							 @click="removeFile(imgFile, item.vModel, item.file)">
					</a>
				</div>
			</template>
			<a-upload :showUploadList="false" :multiple="true" style="float: left;margin-right: 5px;"
					  :disabled="item.disabled || formConfig.disabled"
					  :remove="value=>removeFile(value, item.vModel, item.file)"
					  :before-upload="value => uploadFile(value, item.vModel, item.file)">
				<a size="small" type="primary"
				   v-if="!formConfig.disabled && (sourceData[item.vModel]?JSON.parse(sourceData[item.vModel]):[]).length < item.file.max">
					<img src="../img/add.png">
				</a>
			</a-upload>
			<span class="mL10" style="color: #8c939d"  v-if="item.remark">{{item.remark}}</span>
		</template>
		<template v-else>
			<a-upload :showUploadList="true" :multiple="true" :disabled="true" :file-list="getValue(item)"/>
		</template>
	</div>
</template>

<script>
import FuncFile from "../js/FuncFile";
export default {
	name: "subFile",
	mixins:[FuncFile],
	props:['sourceData','formConfig', 'item'],
	methods:{
		getValue: function (item) {
			let value = this.sourceData[item.vModel];
			if(["file","fileImg"].includes(item.type)){
				value = value ? JSON.parse(value) : []
			}
			return value;
		},
	}
}
</script>

<style scoped lang="less">
.close{
	position: absolute;
	margin-left: -20px;
	width: 18px;
	height: 18px;
	background-color: white;
}
.imgList{
	float: left;
	margin-right: 5px;
	a{
		margin-top: 2px;
		border-radius: 5px;
		display: none;
	}
}
.imgList:hover{
	a{
		display: initial;
	}
}
.imgCard{
	border-radius: 5px;
	border: 2px solid #c6d9ff;
	/*border-radius: 10px;*/
}
</style>
