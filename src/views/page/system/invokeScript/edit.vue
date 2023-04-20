<template>
    <a-spin :spinning="loading">
        <div class="inner_head mB10">
            <h1>脚本定义</h1>
        </div>
        <div class="p10 bor_a">
            <!---->
            <a-form-model :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
                <a-row>
                    <a-col :span="24" v-for="item in formTab1">
                        <template v-if="item.model == 'config'">
                            <a-form-model-item :label="item.label" :label-col="{span: 4 }">
                                <div class="tableForm">
                                    <a-button type="primary" class="mL10" @click="paramsEvent().add()">新增参数</a-button>
                                    <a-button class="mL10">删除参数</a-button>
                                    <a-button class="mL10">向上</a-button>
                                    <a-button class="mL10">向下</a-button>
                                    <a-button type="primary" class="mL10" @click="onTest()">测试</a-button>
                                    <a-table class="tableForm" :columns="columns" :dataSource="dataSource" bordered
                                             :pagination="false" :locale="{emptyText: '暂无数据'}">
                                        <template v-for="item in [
                                                        {name:'paramName',type:'input'},
                                                        {name:'paramType',type:'select'},
                                                        {name:'remark',type:'input'},
                                                        {name:'value',type:'input'},
                                                    ]" :slot="item.name" slot-scope="text, record">
                                            <editable-cell :record="record" :type="item.type" :itemKey="item.name"/>
                                        </template>
                                        <a-button slot="action" slot-scope="text, record, index"
                                                  @click="paramsEvent().remove(index)">移除</a-button>
                                    </a-table>
                                </div>
                            </a-form-model-item>
                        </template>
                        <template v-else></template>
                    </a-col>
                </a-row>
            </a-form-model>
            <!---->
            <form_model v-if="!formConfig.loading" ref="formModel" :sourceData="sourceData" :formConfig="formConfig"/>
        </div>
        <div class="textCenter mB20">
            <a-button type="primary" class="mR15" @click="onSubmit(true)">提交</a-button>
            <a-button class="mR15"  @click="back('list')">返回</a-button>
        </div>
        <!--弹框-->
        <a-modal title="测试结果" :visible="modalConfig.visible" :width="950" :height="700"
                 @cancel="modalConfig.visible=false" :footer="null">
            <a-textarea class="content_wrap" :readOnly="true" :auto-size="{minRows: 5,maxRows: 30}" v-model="modalConfig.content"/>
        </a-modal>
    </a-spin>
</template>

<script>
import form_model from "@/views/component/form/form_model";
import rxAjax from "@/assets/js/ajax";

const EditableCell = {
    template: `
      <div class="editable-cell">
          <div v-if="editable" class="editable-cell-input-wrapper">
              <a-input ref="ipt" v-if="type=='input'" style="width: calc(100% - 0px)" v-model="record[itemKey]"
                       @pressEnter="check" @blur="check"/>
              <a-select ref="slt" v-if="type=='select'" v-model="record[itemKey]" :options="paramType" option-filter-prop="children"
                       @pressEnter="check" @blur="check"/>
              <a-icon type="check" v-if="false" class="editable-cell-icon-check" @click="check"/>
          </div>
          <div v-else class="editable-cell-text-wrapper" @click="edit">
              <a-icon v-if="type=='input'" type="edit" class="editable-cell-icon" @click="edit" /> {{ record[itemKey] }}
          </div>
      </div>
    `,
    props: {
        record: Object,
        itemKey:String,
        type: String,
    },
    data() {
        return {
            editable: false,
            paramType:[
                {label:'字符串',value:'string'},
                {label:'整形',value:'int'},
                {label:'长整形',value:'long'},
                {label:'数字',value:'double'},
                {label:'布尔型',value:'boolean'},
                {label:'日期型',value:'date'},
                {label:'对象型',value:'obj'},
            ],
        };
    },
    methods: {
        check() {
            this.editable = false;
        },
        edit() {
            this.editable = true;
            if(this.type == 'input'){
                this.$nextTick(() => {
                    this.$refs.ipt.focus();
                })
            } else if(this.type == 'select'){
                this.$nextTick(() => {
                    this.$refs.slt.focus();
                })
            }
        },
    },
};
export default {
    name: "edit",
    props: {
        params: Object,
    },
    components: {form_model, EditableCell},
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
                        label: "名称",
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
                        span:24, labelCol:4,
                        label: "说明",
                        type: "textarea",
                        model: "descp",
                        maxLength: 200,
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
            //
            formTab1: [
                {label:'参数定义',model:'config'},
            ],
            columns:[
                {dataIndex: 'paramName',key: 'paramName',title:'参数名',width: '20%',scopedSlots: { customRender: 'paramName' }},
                {dataIndex: 'paramType',key: 'paramType',title:'类型',width: '20%',scopedSlots: { customRender: 'paramType' }},
                {dataIndex: 'remark',key: 'remark',title:'描述',width: '25%',scopedSlots: { customRender: 'remark' }},
                {dataIndex: 'value',key: 'value',title:'值',width: '20%',scopedSlots: { customRender: 'value' }},
                {dataIndex: 'action',key: 'action',title:'操作列',width: '15%',scopedSlots: { customRender: 'action' }},
            ],
            dataSource:[],
            //
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
                    if(data.params != null){
                        this.dataSource = JSON.parse(data.params);
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
            let {dataSource} = this;
            if(dataSource.length > 0){
                formData.params = JSON.stringify(dataSource);
            }

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
            let paramsConfig = this.dataSource ?? [];
            let params = Object.assign({
                params: paramsConfig,
                script: script,
            });
            rxAjax.postJson(api, params).then(res=>{
                Object.assign(this.modalConfig, {
                    visible: true, content: JSON.stringify(res)
                })
            })
        },
        // 参数定义事件
        paramsEvent(){
            let self_ = this;
            let method = {};
            method.add = ()=>{
                self_.dataSource.push({
                    paramName:"",paramType:'string',remark:"",value:""
                })
            }
            method.remove = (index)=>{
                let obj = self_.dataSource;
                const newFileList = obj.slice();
                newFileList.splice(index, 1);
                self_.dataSource = newFileList;
            }
            return method;
        }
    }
}
</script>

<style scoped lang="less">
.tableForm{
    border: 1px solid #ddd;
}
.editable-cell {
    position: relative;
}

.editable-cell-input-wrapper,
.editable-cell-text-wrapper {
    padding-right: 24px;
}

.editable-cell-text-wrapper {
    padding: 5px 24px 5px 5px;
}

.editable-cell-icon,
.editable-cell-icon-check {
    position: absolute;
    right: 0;
    width: 20px;
    cursor: pointer;
}

.editable-cell-icon {
    line-height: 18px;
    display: none;
}

.editable-cell-icon-check {
    line-height: 28px;
}

.editable-cell:hover .editable-cell-icon {
    display: inline-block;
}

.editable-cell-icon:hover,
.editable-cell-icon-check:hover {
    color: #108ee9;
}

.editable-add-btn {
    margin-bottom: 8px;
}
</style>