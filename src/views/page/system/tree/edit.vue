<template>
	<a-modal title="编辑-系统分类树" dialogClass="modal_a" width="600px"
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
                data: [
                    {
						span:24, labelCol:4,
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
						span:24, labelCol:4,
						label: "别名",
						tag: "a-input",
						type: "input",
						vModel: "code",
						maxLength: 20,
						rule: [
							{required: true, message: '该输入项不能为空', trigger: 'change'},
						],
					},
                    {
						span:24, labelCol:4,
                        label: "分类",
						tag: "a-select",
                        type: "select",
                        vModel: "alias",
                        maxLength: 20,
						options: [
							{label:'系统分类', value:'system'},
						],
                        rule: [
                            {required: true, message: '该输入项不能为空', trigger: 'change'},
                        ],
                    },
					{
						span:24, labelCol:4,
						label: "序号",
						tag: "a-input",
						type: "input",
						vModel: "sort",
						maxLength: 20,
						rule: [
							{required: true, message: '该输入项不能为空', trigger: 'change'},
						],
					},
                ],
            },
        };
    },
    methods:{
		openModal(params){
			this.visible = true;
			this.loadData(params.id, params.parentId);
		},
		closeModal(refresh = false){
			this.visible = false;
			if(refresh){
				this.$emit("callback", {refresh})
			}
		},
        loadData(id, parentId='0'){
            let that = this;
            if(id){
                let api = "/system/tree/info";
                let params = Object.assign({id:id});
                rxAjax.get(api, params).then(({success,data})=>{
                    that.sourceData = data;
                    that.formConfig.loading = false
                })
            } else{
				that.sourceData = {parentId}
                that.formConfig.loading = false
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
            let api = "/system/tree/save";
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

<style scoped lang="less">
</style>
