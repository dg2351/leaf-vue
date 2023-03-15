<template>
    <a-spin :spinning="loading">
        <div class="inner_head mB10">
            <h1>脚本定义</h1>
            <a-button type="primary" class="zsbtnA mR15" @click="onTest()">测试</a-button>
        </div>
        <div class="p10 bor_a">
            <form_model v-if="!formConfig.loading" ref="formModel" :form-config="formConfig"/>
        </div>
        <div class="btn_box textCenter mB20">
            <a-button type="primary" class="zsbtnA mR15" @click="onSubmit(true)">提交</a-button>
            <a-button class="zsbtnA mR15"  @click="back('list')">返回</a-button>
        </div>
        <a-modal title="测试结果" :visible="modalConfig.visible" :width="950" :height="700"
                 @cancel="modalConfig.visible=false" :footer="null">
            <a-textarea class="content_wrap"
                        :readOnly="true"
                        :auto-size="{minRows: 5,maxRows: 30}"
                        v-model="modalConfig.content"/>
        </a-modal>
    </a-spin>
</template>

<script>
import form_model from "@/views/component/form/form_model";
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
            loading:false,
            formConfig: {
                visible: false,
                loading: true,
                disabled: false,
                form: {},
                data: [
                    {
                        label: "名称",
                        type: "input",
                        model: "name",
                        rule: [
                            {required: true, message: '该输入项不能为空', trigger: 'change'},
                            {type: "string", max: 20, message: '长度不能大于20字符', trigger: 'change'},
                        ],
                    },
                    {
                        label: "别名",
                        type: "input",
                        model: "alias",
                        rule: [
                            {required: true, message: '该输入项不能为空', trigger: 'change'},
                            {type: "string", max: 20, message: '长度不能大于20字符', trigger: 'change'},
                        ],
                    },
                    {
                        span:24, labelCol:4,
                        label: "说明",
                        type: "textarea",
                        model: "descp",
                        rule: [
                            {type: "string", max: 200, message: '长度不能大于200字符', trigger: 'change'},
                        ],
                    },
                    {
                        span:24, labelCol:4,
                        label: "Groovy脚本",
                        type: "codemirror",
                        model: "content",
                        language: "java"
                    },
                ],
            },
            modalConfig:{
                visible: false,content: "",
            }
        };
    },
    created() {
        this.loadData(this.params.id);
    },
    methods:{
        loadData(id){
            let that = this;
            if(id){
                let api = "/system/invokeScript/info";
                let params = Object.assign({id:id});
                rxAjax.get(api, params).then(({success,data})=>{
                    let sourceData = {};
                    if(success && data){
                        Object.keys(data).forEach(key=>{
                            sourceData[key.toLowerCase()] = data[key]
                        });
                    }
                    Object.assign(that.formConfig, {form: data, loading: false})
                })
            } else{
                Object.assign(that.formConfig, {loading: false})
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
            let api = "/system/invokeScript/save";
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
        onTest(){
            let data = this.$refs['formModel'].formMethods().getData(false);
            let formData = data.formData;
            let script = formData.content;
            if(!script){
                return;
            }
            let api = "/system/invokeScript/test";
            let params = Object.assign({
                params:[{paramName:'key',paramType:'string',value:'测试结果返回值'}],
                script:script,
            });
            rxAjax.postJson(api, params).then(res=>{
                console.log("invokeScript:=", res)
                Object.assign(this.modalConfig, {
                    visible: true, content: JSON.stringify(res)
                })
            })
        }
    }
}
</script>

<style scoped>

</style>