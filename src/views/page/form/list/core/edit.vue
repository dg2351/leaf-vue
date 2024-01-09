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
			//
			alias: "",
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
		async openModal(params){
			this.visible = true;
			await this.initData();
			this.loadData(params.pkId);
		},
		closeModal(refresh = false){
			this.visible = false;
			if(refresh){
				this.$emit("callback", {refresh})
			}
		},
		async initData(){
			let api = "/form/design/alias";
			let params = Object.assign({alias:'testDesign'});
			let {success,data} = await rxAjax.get(api, params)
			let template = JSON.parse(data.template ?? '[]');
			this.alias = data.boAlias;
			this.formConfig.render = true
			this.formConfig.data = template;
		},
		loadData(pkId){
			let self_ = this;
			let alias = this.alias;
			if(pkId){
				let api = `/form/bo/entity/${alias}/dataInfo`;
				let params = Object.assign({pkId:pkId});
				rxAjax.get(api, params).then(({success,data})=>{
					if(!success){
						self_.$util.message().error("操作提示", "网络异常")
						return;
					}
					self_.sourceData = data;
					self_.formConfig.loading = false
				})
			} else{
				self_.formConfig.loading = false
			}
		},
		// 提交
		onSubmit(validate){
			let self_ = this;
			let alias = this.alias;
			if(self_.loading) return;
			self_.loading = true;
			let data = this.$refs['formModel'].formMethods().getData(validate);
			if(!(data.validate)){
				return self_.loading = false;
			}
			let formData = data.formData;
			// 调用保存表单
			let api = `/form/bo/entity/${alias}/dataSave`;
			rxAjax.postJson(api, formData).then(({success,data})=>{
				self_.loading = false;
				if(success){
					self_.$message.success("保存成功");
				} else{
					self_.$message.warning("保存失败");
				}
				if(validate){
					self_.closeModal(true);
				}
			});
		},
	}
}
</script>

<style scoped>

</style>
