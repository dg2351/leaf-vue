<template>
	<a-drawer title="系统菜单"
			  :width="420"
			  :visible="visible"
			  :body-style="{ paddingBottom: '80px' }"
			  @close="closeModal">
		<a-spin :spinning="loading">
			<div class="p10 bor_a" v-if="!formConfig.loading">
				<form_model ref="formModel" :sourceData="sourceData" :formConfig="formConfig">
					<template #icon>
						<a-input v-model="sourceData.icon" placeholder="请选择" readOnly @click="selectIcon(sourceData.icon)"/>
					</template>
				</form_model>
			</div>
			<div class="textCenter mB20">
				<a-button type="primary" class="mR15" @click="onSubmit(true)">提交</a-button>
				<a-button class="mR15"  @click="closeModal">返回</a-button>
			</div>
		</a-spin>

		<!--弹窗-->
		<iconModal ref="iconModal" :key="timer" @callback="callback"/>
	</a-drawer>
</template>

<script>
import form_model from "@/component/form/form_model";
import iconModal from "@/component/modal/iconModal";
import rxAjax from "@/assets/js/ajax";

export default {
    name: "edit",
    props: {
        params: Object,
    },
    components: {form_model,iconModal},
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
			timer: null,
			// base
            sourceData:{},
            formConfig: {
                visible: false,
                loading: true,
                disabled: false,
                data: [
                    {
						span:24, labelCol:6,
                        label: "菜单名称",
                        type: "input",
						vModel: "name",
                        maxLength: 20,
                        rule: [
                            {required: true, message: '该输入项不能为空', trigger: 'change'},
                        ],
                    },
					{
						span:24, labelCol:6,
						label: "标识键",
						type: "input",
						vModel: "key",
						maxLength: 20,
						rule: [
							{required: true, message: '该输入项不能为空', trigger: 'change'},
						],
					},
					{
						span:24, labelCol:6,
						label: "菜单展示",
						type: "radio",
						vModel: "showType",
						options: [
							{label:'是', value:1},
							{label:'否', value:0},
						],
					},
					{
						span:24, labelCol:6,
						label: "配置类型",
						type: "radio",
						vModel: "settingType",
						options: [
							{label:'Vue组件', value:'custom'},
							{label:'IFrame', value:'iframe'},
						],
					},
                    {
						span:24, labelCol:6,
                        label: "组件路径",
                        type: "input",
						vModel: "component",
                        maxLength: 60,
						remark: "组件路径是src/views 目录下的组件。<br>列表组件路径：page/form/list/core/index"
                    },
					{
						span:24, labelCol:6,
						label: "组件参数",
						type: "input",
						vModel: "params",
						maxLength: 60,
					},
					{
						span:24, labelCol:6,
						label: "图标",
						type: "slot",
						vModel: "icon",
						rule: [
							{required: true, message: '该输入项不能为空', trigger: 'change'},
						],
					},
					{
						span:24, labelCol:6,
						label: "显示顺序",
						type: "input",
						inputType: "number",
						vModel: "sort",
						min:1,
						max:100,
						rule: [
							{required: true, message: '该输入项不能为空', trigger: 'change'},
						],
					},
					{
						span:24, labelCol:6,
						label: "菜单状态",
						type: "radio",
						vModel: "status",
						options: [
							{label:'启用', value:1},
							{label:'禁用', value:0},
						],
						rule: [
							{required: true, message: '该输入项不能为空', trigger: 'change'},
						],
					},
					{
						span:24, labelCol:6,
						label: "系统值",
						type: "radio",
						vModel: "sys",
						options: [
							{label:'Y', value:1},
							{label:'N', value:0},
						],
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
			this.loadData(params.id, params.pid);
		},
		closeModal(refresh = false){
			this.visible = false;
			if(refresh){
				this.$emit("callback", {refresh})
			}
		},
		getValue(data, key){
			return data ? (data[key] ?? '') : '';
		},
        loadData(id, pid='0'){
            let that = this;
            if(id){
                let api = "/system/menu/info";
                let params = Object.assign({id:id});
                rxAjax.get(api, params).then(({success,data})=>{
                    that.sourceData = data;
                    that.formConfig.loading = false
                })
            } else{
            	let sourceData = {};
            	this.formConfig.data.forEach(item=>{
            		sourceData[item.vModel] = null;
				})
				that.sourceData = Object.assign(sourceData, {
					pid,
					showType:1,
					sort:1,
					status:1,
					settingType:'custom',
					sys:0,
				})
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
            let api = "/system/menu/save";
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
		// icon弹窗
		selectIcon(data){
			this.timer = new Date().getTime();
			this.$nextTick(()=>{
				this.$refs.iconModal.openModal(data);
			})
		},
		callback(v){
			this.sourceData.icon = v.data;
		}
    }
}
</script>

<style scoped lang="less">
</style>
