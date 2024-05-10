<template>
    <div>
		<form_model ref="formModel" :sourceData="sourceData" :form-config="formFields"/>
	</div>
</template>

<script>
import form_model from "@/component/form/form_model";
import FieldsData from "@/views/page/form/list/component/FieldsData";
import edit_list from "@/component/table/edit_list";
import rxAjax from "@/assets/js/ajax";

export default {
	name: "editScript",
	props:{
		sourceData:Object,
	},
	components:{
		form_model,
	},
	data(){
		return{
			formFields: {
				visible: false,
				loading: true,
				disabled: false,
				data: [
					{
						span:24, labelCol:0,
						label: "",
						tag: "codemirror",
						type: "codemirror",
						vModel: "bodyScript",
						language: "javascript"
					},
				]
			},
		}
	},
	methods:{
		// 获取返回数据
		getData(){
			if(this.$refs['formModel']){
				let data = this.$refs['formModel'].formMethods().getData(true);
				if(!(data.validate)){
					return null;
				}
				let formData = data.formData;
				return formData.bodyScript
			} else{
				return null
			}
		}
	}
}
</script>

<style scoped>

</style>
