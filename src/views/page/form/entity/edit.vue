<template>
    <a-spin :spinning="loading">
        <!--弹框-->
        <dbModal ref="dbModal" @callBack="v=>{sourceData.dsAlias = v.alias;sourceData.dsName = v.name;}"/>
        <tableModal ref="tableModal" @callBack="v=>{sourceData.tableName = v}"/>
        <!---->
        <div class="inner_head mB10">
            <h1>业务实体</h1>
        </div>
        <div class="p10 bor_a">
            <!---->
            <form_model ref="formModel" :sourceData="sourceData" :form-config="formConfig"/>
            <!---->
            <a-form-model :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
                <a-row>
                    <a-col :span="12" v-for="item in formTab1">
                        <template v-if="item.model == 'dsName'">
                            <a-form-model-item :label="item.label" :label-col="{span: 8 }">
                                <a-input-search v-model="sourceData.dsName" enter-button :readOnly="true"
                                                @search="$refs['dbModal'].openModal(getValue(sourceData,'dsAlias'))"/>
                            </a-form-model-item>
                        </template>
                        <template v-if="item.model == 'tableName'">
                            <a-form-model-item :label="item.label" :label-col="{span: 8 }">
                                <button type="button" class="ant-btn ant-btn-icon-only"
                                        @click="$refs['tableModal'].openModal(getValue(sourceData,'dsAlias'))">
                                    <i aria-label="图标: database" class="anticon anticon-database"><svg viewBox="64 64 896 896" data-icon="database" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class=""><path d="M832 64H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32zm-600 72h560v208H232V136zm560 480H232V408h560v208zm0 272H232V680h560v208zM304 240a40 40 0 1 0 80 0 40 40 0 1 0-80 0zm0 272a40 40 0 1 0 80 0 40 40 0 1 0-80 0zm0 272a40 40 0 1 0 80 0 40 40 0 1 0-80 0z"></path></svg></i>
                                </button>
								<a-input v-model="sourceData.tableName" style="width: 200px;" disabled/>
                            </a-form-model-item>
                        </template>
                    </a-col>
                </a-row>
            </a-form-model>
        </div>
        <div class="textCenter mB20">
            <a-button type="primary" class="mR15" @click="onSubmit(true)">提交</a-button>
            <a-button class="mR15"  @click="back('list')">返回</a-button>
        </div>
    </a-spin>
</template>

<script>
import form_model from "@/component/form/form_model";
import dbModal from "@/views/page/form/entity/modal/dbModal";
import tableModal from "@/views/page/form/entity/modal/tableModal";
import rxAjax from "@/assets/js/ajax";

export default {
    name: "edit",
    props: {
        params: Object,
    },
    components: {form_model, dbModal, tableModal},
    computed: {
        routerParams() {
            return this.$route.query;
        },
    },
    data() {
        return {
            loading:false,
            sourceData:{dsAlias:'',dsName:'',tableName:''},
            formConfig: {
                visible: false,
                loading: true,
                disabled: false,
                data: [
                    {
                        label: "名称",
                        type: "input",
                        model: "name",
                        maxLength: 20,
                        rule: [
                            {required: true, message: '该输入项不能为空', trigger: 'change'},
                        ],
                    },
                    {
                        label: "标识",
                        type: "input",
                        model: "alias",
                        maxLength: 20,
                        rule: [
                            {required: true, message: '该输入项不能为空', trigger: 'change'},
                        ],
                    },
                ],
            },
            //
            formTab1: [
                {label:'数据源',model:'dsName'},
                {label:'库表',model:'tableName'},
            ],
        };
    },
    created() {
        this.loadData(this.params.id);
    },
    methods:{
        loadData(id){
            let that = this;
            if(id){
                let api = "/form/bo/entity/info";
                let params = Object.assign({id:id});
                rxAjax.get(api, params).then(({success,data})=>{
                    let sourceData = {};
                    if(success && data){
                        Object.keys(data).forEach(key=>{
                            sourceData[key.toLowerCase()] = data[key]
                        });
                    }
                    that.sourceData = data;
                    that.formConfig.loading = false
                })
            } else{
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
            let api = "/form/bo/entity/save";
            rxAjax.postJson(api, formData).then(({success,data})=>{
                self_.loading = false;
                if(success){
                    self_.$message.success("保存成功");
                } else{
                    self_.$message.warning("保存失败");
                }
                if(validate){
                    self_.back();
                }
            });
        },
        back(){
            this.$util.component(this).event('list');
        },
        getValue(data, key){
            return data ? (data[key] ?? '') : '';
        }
    }
}
</script>

<style scoped>

</style>
