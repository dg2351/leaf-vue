<template>
    <a-spin :spinning="loading">
        <div class="inner_head mB10">
            <h1>数据源定义</h1>
        </div>
        <div class="p10 bor_a">
            <form_model ref="formModel" :sourceData="sourceData" :form-config="formConfig"/>
        </div>
        <div class="textCenter mB20">
            <a-button type="primary" class="mR15" @click="onSubmit(true)">提交</a-button>
            <a-button class="mR15"  @click="back('list')">返回</a-button>
        </div>
    </a-spin>
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
            loading:false,
            sourceData:{},
            formConfig: {
                visible: false,
                loading: true,
                disabled: false,
                data: [
                    {
                        label: "数据源名称",
                        type: "input",
                        model: "name",
                        maxLength: 20,
                        rule: [
                            {required: true, message: '该输入项不能为空', trigger: 'change'},
                        ],
                    },
                    {
                        label: "别名",
                        type: "input",
                        model: "alias",
                        maxLength: 20,
                        rule: [
                            {required: true, message: '该输入项不能为空', trigger: 'change'},
                        ],
                    },
                    {
                        label: "数据库类型",
                        type: "select",
                        model: "dbType",
                        rule: [
                            {required: true, message: '该输入项不能为空', trigger: 'change'},
                        ],
                        data:[
                            {label: 'MySQL', value: 'MySQL'},
                            {label: 'Oracle', value: 'Oracle'},
                            {label: 'PostgreSQL', value: 'PostgreSQL'},
                            {label: 'SQLServer', value: 'SQLServer'},
                            {label: 'Sqlite', value: 'Sqlite'},
                        ],
                    },
                    {
                        label: "库名",
                        type: "input",
                        model: "schema",
                        maxLength: 12,
                        rule: [
                            {required: true, message: '该输入项不能为空', trigger: 'change'},
                        ],
                    },
                    {
                        label: "地址",
                        type: "input",
                        model: "host",
                        maxLength: 20,
                        rule: [
                            {required: true, message: '该输入项不能为空', trigger: 'change'},
                        ],
                    },
                    {
                        label: "端口",
                        type: "input",
                        model: "port",
                        maxLength: 6,
                        rule: [
                            {required: true, message: '该输入项不能为空', trigger: 'change'},
                        ],
                    },
                    {
                        label: "用户",
                        type: "input",
                        model: "username",
                        maxLength: 12,
                        rule: [
                            {required: true, message: '该输入项不能为空', trigger: 'change'},
                        ],
                    },
                    {
                        label: "密码",
                        type: "input",
                        model: "password",
                        maxLength: 12,
                        rule: [
                            {required: true, message: '该输入项不能为空', trigger: 'change'},
                        ],
                    },
                    {
                        label: "编码",
                        type: "select",
                        model: "encoding",
                        initFunction: function (item) {
                            item.data = [
                                {label: 'utf8', value: 'utf8'},
                                {label: 'gb2312', value: 'gb2312'},
                                {label: 'gbk', value: 'gbk'},
                            ]
                        },
                        data:[],
                        rule: [
                            {required: true, message: '该输入项不能为空', trigger: 'change'},
                        ],
                    },
                ],
            },
        };
    },
    created() {
        this.loadData(this.params.id);
    },
    methods:{
        loadData(id){
            let that = this;
            if(id){
                let api = "/form/datasource/def/info";
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
            formData.setting = "{}";
            // 调用保存表单
            let api = "/form/datasource/def/save";
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
        }
    }
}
</script>

<style scoped>

</style>