<template>
    <a-spin :spinning="loading">
        <div class="inner_head mB10">
            <h1>自定义查询</h1>
        </div>
        <div class="p10 bor_a" v-if="!formConfig.loading">
            <!---->
			<form_model ref="formModel" :sourceData="sourceData" :formConfig="formConfig">
				<!--弹框-->
				<template #dsAlias>
					<dbModal ref="dbModal" :alias="sourceData.dsAlias" @init="v=>{sourceData.dsName = v?.name}"
							 @callBack="v=>{sourceData.dsName = v.name;sourceData.dsAlias = v.alias}"/>
					<a-input-search v-model="sourceData.dsName" enter-button :readOnly="true"
									@search="$refs['dbModal'].openModal(getValue(sourceData,'dsAlias'))"/>
				</template>
			</form_model>
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
    components: {form_model, dbModal, EditableCell},
    computed: {
        routerParams() {
            return this.$route.query;
        },
    },
    data() {
        return {
            loading:false,
            sourceData:{dsAlias:'',dsName:'',sql:''},
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
                        label: "标识名",
                        type: "input",
                        model: "alias",
                        maxLength: 20,
                        rule: [
                            {required: true, message: '该输入项不能为空', trigger: 'change'},
                        ],
                    },
                    {
                        label: "分类",
                        type: "select",
                        model: "treeId",
						data:[],
						initFunction: function (item) {
							item.data = []
						},
                    },
					{
						label: "数据源选择",
						type: "slot",
						model: "dsAlias",
					},
					{
						span:24, labelCol:4,
						label: "SQL",
						type: "codemirror",
						model: "sql",
						language: "sql"
					},
					{
						label: "是否分页",
						type: "radio",
						model: "isPage",
						data:[],
						initFunction: function (item) {
							item.data = [{label:'是',value:1},{label:'否',value:0}]
						},
					},
					{
						label: "分页大小",
						type: "input",
						model: "pageSize",
						maxLength: 20,
						rule: [
							{required: false, message: '该输入项不能为空', trigger: 'change'},
							{pattern: /^[0-9]*?$/, message: '请输入数字'},
						],
					},
					{
						label: "是否缓存",
						type: "radio",
						model: "isCache",
						data:[],
						initFunction: function (item) {
							item.data = [{label:'是',value:1},{label:'否',value:0}]
						},
					},
					{
						label: "缓存时间",
						type: "input",
						model: "cacheTime",
						maxLength: 4,
						rule: [
							{required: false, message: '该输入项不能为空', trigger: 'change'},
							{pattern: /^[0-9]*?$/, message: '请输入数字'},
						],
					},
                ],
            },
            columns:[
                {dataIndex: 'paramName',key: 'paramName',title:'参数名',width: '20%',scopedSlots: { customRender: 'paramName' }},
                {dataIndex: 'paramType',key: 'paramType',title:'类型',width: '20%',scopedSlots: { customRender: 'paramType' }},
                {dataIndex: 'remark',key: 'remark',title:'描述',width: '25%',scopedSlots: { customRender: 'remark' }},
                {dataIndex: 'value',key: 'value',title:'值',width: '20%',scopedSlots: { customRender: 'value' }},
                {dataIndex: 'action',key: 'action',title:'操作列',width: '15%',scopedSlots: { customRender: 'action' }},
            ],
            dataSource:[],
        };
    },
    created() {
        this.loadData(this.params.id);
    },
    methods:{
		back(){
			this.$util.component(this).event('list');
		},
		getValue(data, key){
			return data ? (data[key] ?? '') : '';
		},
        loadData(id){
            let that = this;
            if(id){
                let api = "/form/custom/query/info";
                let params = Object.assign({id:id});
                rxAjax.get(api, params).then(({success,data})=>{
                    that.sourceData = Object.assign(data, {
						dsName: data.dsName??'',
						dsAlias: data.dsAlias??'',
					});
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
            let api = "/form/custom/query/save";
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
</style>
