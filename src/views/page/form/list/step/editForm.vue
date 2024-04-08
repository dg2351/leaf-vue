<template>
    <div>
		<!--弹框-->
		<customQueryModal ref="customQueryModal" @callBack="v=>{sourceData.url = v.alias;}"/>
		<formModal ref="formModal" @callBack="v=>{sourceData.formAlias = v.alias;}"/>
		<!---->
		<div class="p10 bor_a" style="height: 650px;overflow-y: auto">
			<form_model ref="formModel" :sourceData="sourceData" :form-config="formConfig">
				<template v-slot:url="v">
					<a-input-search v-model="sourceData.url" enter-button :readOnly="true"
									@search="$refs['customQueryModal'].openModal(sourceData['url'] ?? '', 'url')"/>
				</template>
				<template v-slot:formAlias="v">
					<a-input-search v-model="sourceData.formAlias" enter-button :readOnly="true"
									@search="$refs['formModal'].openModal(sourceData['formAlias'] ?? '')"/>
				</template>
			</form_model>
		</div>
		<div class="textCenter mB20">
			<a-button type="primary" class="mR15" v-if="sourceData.id" @click="next">下一步</a-button>
			<a-button type="primary" class="mR15" @click="onSubmit(true)">保存&下一步</a-button>
			<a-button class="mR15"  @click="close()">返回</a-button>
		</div>
	</div>
</template>

<script>
import rxAjax from "@/assets/js/ajax";
import form_model from "@/component/form/form_model";
import customQueryModal from "@/component/modal/customQueryModal";
import formModal from "@/component/modal/formModal";

export default {
	name: "editForm",
	props:{
		sourceData:Object,
	},
	components: {
		form_model,
		customQueryModal,
		formModal,
	},
	computed: {
		routerParams() {
			return this.$route.query;
		},
	},
	data(){
		let self_ = this;
		return{
			formConfig: {
				visible: false,
				loading: true,
				disabled: false,
				collapseKey: ["基本信息","参数配置","来源配置"],
				collapse: [
					{label:"基本信息", data: ["name","alias","treeId","formAlias"]},
					{label:"参数配置", data: ["isXh","isPage"]},
					{label:"来源配置", data: ["url", "urlMethod"]},
				],
				data: [
					{
						label: "名称",
						tag: "a-input",
						type: "input",
						vModel: "name",
						maxLength: 20,
						rule: [
							{required: true, message: '该输入项不能为空', trigger: 'change'},
						],
					},
					{
						label: "别名",
						tag: "a-input",
						type: "input",
						vModel: "alias",
						maxLength: 20,
						rule: [
							{required: true, message: '该输入项不能为空', trigger: 'change'},
						],
					},
					{
						label: "分类",
						tag: "a-select-tree",
						type: "selectTree",
						vModel: "treeId",
						options:[],
						initFunction: async function (item) {
							let {data} = await rxAjax.postJson("/system/tree/list", {});
							let sourceData = data.map(m=>{return {id:m.id, pid:m.parentId, label:m.name, value:m.id }})
							item.options = self_.$util.buildTree(sourceData, "id", "pid");
						},
					},
					{
						label: "绑定表单",
						tag: "a-slot",
						type: "slot",
						vModel: "formAlias",
						maxLength: 20,
						rule: [
							{required: false, message: '该输入项不能为空', trigger: 'change'},
						],
					},
					{
						label: "是否显示序号",
						tag: "a-radio",
						type: "radio",
						vModel: "isXh",
						options:[
							{label:'是',value:1},
							{label:'否',value:0},
						],
						maxLength: 20,
						rule: [
							{required: true, message: '该输入项不能为空', trigger: 'change'},
						],
					},
					{
						label: "是否分页",
						tag: "a-radio",
						type: "radio",
						vModel: "isPage",
						options:[
							{label:'是',value:1},
							{label:'否',value:0},
						],
						maxLength: 20,
						rule: [
							{required: true, message: '该输入项不能为空', trigger: 'change'},
						],
					},
					{
						label: "数据来源",
						tag: "a-slot",
						type: "slot",
						vModel: "url",
						maxLength: 60,
						rule: [
							{required: true, message: '该输入项不能为空', trigger: 'change'},
						],
					},
					{
						label: "请求方式",
						tag: "a-radio",
						type: "radio",
						vModel: "urlMethod",
						options:[
							{label:'postForm',value:'postForm'},
							// {label:'postJson',value:'postJson'},
						],
						rule: [
							{required: true, message: '该输入项不能为空', trigger: 'change'},
						],
					},
				]
			},
		}
	},
	mounted() {
		this.formConfig.loading = false
	},
	methods:{
		next(){
			this.$emit("nextEvent");
		},
		close(){
			this.$emit("closeEvent");
		},
		onSubmit(){
			let self_ = this;
			if(self_.loading) return;
			self_.loading = true;
			let data = this.$refs['formModel'].formMethods().getData(true);
			if(!(data.validate)){
				return self_.loading = false;
			}
			let formData = data.formData;
			delete formData.idField;
			delete formData.fieldsJson;
			delete formData.searchJson;
			// 调用保存表单
			let api = "/form/bo/list/save";
			rxAjax.postJson(api, formData).then(({success,data})=>{
				self_.loading = false;
				if(success && data){
					self_.$message.success("保存成功");
					self_.sourceData.id = data;
					self_.next();
				}
			}).catch(err=>{
				self_.loading = false;
				self_.$message.error("网络错误");
			});
		},
	}
}
</script>

<style scoped>

</style>
