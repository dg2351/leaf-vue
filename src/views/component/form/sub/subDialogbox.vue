<template>
	<a-input v-model="formConfig.form[item.model].text"
			 :readOnly="true"
			 :style="item.style"
			 @click="Dialog(item)"/>
</template>

<script>
// import DialogBox from "@/assets/js/DialogBox";
export default {
	name: "subDialogbox",
	props:['formConfig', 'item'],
	methods:{
		// 弹框选择方法
		Dialog(item){
			let that = this;
			DialogBox.dialog({
				key: item.key,
				params: '',
			}, {
				curVm: that,
				max: false,
				widthHeight: ['70vw', '80vh']
			}, function (data) {
				console.log("回调>>>", data.rows)
				if (data.rows.length === 0) {
					that.formConfig.form[item.model] = "";
					return false;
				}
				that.formConfig.form[item.model] = {
					text:data.rows[0][item.result.text],
					id:data.rows[0][item.result.id],
				};
			});
		},
	}
}
</script>

<style scoped>

</style>