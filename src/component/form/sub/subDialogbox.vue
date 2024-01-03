<template>
	<a-input v-model="sourceData[item.vModel].text"
			 :readOnly="true"
			 :style="item.style"
			 @click="Dialog(item)"/>
</template>

<script>
// import DialogBox from "@/assets/js/DialogBox";
export default {
	name: "subDialogbox",
	props:['sourceData','formConfig', 'item'],
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
					that.sourceData[item.vModel] = "";
					return false;
				}
				that.sourceData[item.vModel] = {
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
