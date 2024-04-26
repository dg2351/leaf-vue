<template>
	<a-modal title="编辑" dialogClass="modal_a" width="800px"
			 :visible="visible" @cancel="closeModal" :footer="null">
		<a-spin :spinning="loading">
			<div class="p10 bor_a" v-if="!formConfig.loading">
				<form_model ref="formModel" :sourceData="sourceData" :formConfig="formConfig"/>
			</div>
			<div class="textCenter mB20">
				<a-button type="primary" class="mR15" @click="onSubmit(true)">提交</a-button>
				<a-button class="mR15"  @click="closeModal">返回</a-button>
			</div>
		</a-spin>
	</a-modal>
</template>

<script>
import form_model from "@/component/form/form_model";
import rxAjax from "@/assets/js/ajax";

export default {
	name: "edit",
	props: {
		params: Object,
	},
	components: {form_model},
	computed: {
		routerParams() {
			return this.$route.query;
		},
	},
	data() {
		return {
			visible: false,
			loading:false,
			// base
			sourceData:{},
			formConfig: {
				visible: false,
				loading: true,
				disabled: false,
				data: []
			}
		}
	},
	methods:{
		async openModal(formConf, drawingList){
			this.visible = true;
			this.formConfig.data = JSON.parse(JSON.stringify(drawingList));
			this.formConfig.render = true
			this.formConfig.loading = false
		},
		closeModal(refresh = false){
			this.visible = false;
			if(refresh){
				this.$emit("callback", {refresh})
			}
		},
		// 提交
		onSubmit(validate){
			let self_ = this;
			if(self_.loading) return;
			self_.loading = true;
			let data = this.$refs['formModel'].formMethods().getData(validate);
			if(!(data.validate)){
				return self_.loading = false;
			}
			let formData = data.formData;
			// 调用保存表单
			this.$util.modal(this).confirm("表单结果", JSON.stringify(formData))
			return self_.loading = false;
		},
	}
}
</script>

<style scoped>

</style>
