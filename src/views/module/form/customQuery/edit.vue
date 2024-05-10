<template>
    <a-spin :spinning="loading">
		<!--列头设置窗口-->
		<ColumnList ref="ColumnList" @callback="callback"/>
		<!--数据源设置-->
		<dbModal ref="dbModal" :alias="sourceData.dsAlias" @init="v=>{sourceData.dsName = v?.name}"
				 @callBack="v=>{sourceData.dsName = v.name;sourceData.dsAlias = v.alias}"/>
		<!---->
        <div class="inner_head mB10">
            <h1>自定义查询</h1>
        </div>
        <div class="p10 bor_a" v-if="!formConfig.loading">
			<a-tabs class="nav_big1" v-model="activeTab">
				<a-tab-pane key="base" tab="基本配置">
					<form_model ref="formModel" :sourceData="sourceData" :formConfig="formConfig">
						<!--弹框-->
						<template #dsAlias>
							<a-input-search v-model="sourceData.dsAlias" enter-button :readOnly="true"
											@search="$refs['dbModal'].openModal(getValue(sourceData,'dsAlias'))"/>
						</template>
					</form_model>
				</a-tab-pane>
				<a-tab-pane key="result" tab="返回字段">
					<edit_list ref="resultEdit" :columns="resultColumns" :data="sourceData.resultField">
						<template slot="buttonBefore">
							<a-button type="primary" class="floatR" @click="findColumnList">列头设置</a-button>
						</template>
					</edit_list>
				</a-tab-pane>
				<a-tab-pane key="where" tab="条件字段">
					<edit_list ref="whereEdit" :columns="whereColumns" :data="sourceData.whereField"/>
				</a-tab-pane>
			</a-tabs>
            <!---->
        </div>
        <div class="textCenter mB20">
            <a-button type="primary" class="mR15" @click="onSubmit(true)">提交</a-button>
            <a-button class="mR15"  @click="back('list')">返回</a-button>
        </div>
    </a-spin>
</template>

<script>
import rxAjax from "@/assets/js/ajax";
import form_model from "@/component/form/form_model";
import edit_list from "@/component/table/edit_list";
import dbModal from "@/component/modal/dbModal";
import ColumnList from "@/views/module/form/customQuery/component/ColumnList";

export default {
    name: "edit",
    props: {
        params: Object,
    },
    components: {form_model, dbModal, edit_list, ColumnList},
    computed: {
        routerParams() {
            return this.$route.query;
        },
    },
    data() {
    	let self_ = this;
        return {
            loading:false,
			activeTab:"base",
			// base
            sourceData:{dsAlias:'',dsName:'',sql:''},
            formConfig: {
                visible: false,
                loading: true,
                disabled: false,
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
                        label: "标识名",
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
						label: "数据源选择",
						tag: "slot",
						type: "slot",
						vModel: "dsAlias",
					},
					{
						span:24, labelCol:4,
						label: "SQL",
						tag: "codemirror",
						type: "codemirror",
						vModel: "sql",
						language: "sql"
					},
					{
						label: "是否分页",
						tag: "a-radio",
						type: "radio",
						vModel: "isPage",
						options:[],
						initFunction: function (item) {
							item.options = [{label:'是',value:1},{label:'否',value:0}]
						},
					},
					{
						label: "分页大小",
						tag: "a-input",
						type: "input",
						vModel: "pageSize",
						maxLength: 20,
						rule: [
							{required: false, message: '该输入项不能为空', trigger: 'change'},
							{pattern: /^[0-9]*?$/, message: '请输入数字'},
						],
					},
					{
						label: "是否缓存",
						tag: "a-radio",
						type: "radio",
						vModel: "isCache",
						options:[],
						initFunction: function (item) {
							item.options = [{label:'是',value:1},{label:'否',value:0}]
						},
					},
					{
						label: "缓存时间",
						tag: "a-input",
						type: "input",
						vModel: "cacheTime",
						maxLength: 4,
						rule: [
							{required: false, message: '该输入项不能为空', trigger: 'change'},
							{pattern: /^[0-9]*?$/, message: '请输入数字'},
						],
					},
                ],
            },
            dataSource:[],
			//
			resultColumns:[
				{dataIndex: 'id', title:'序号',width:"65px",align: "center"},
				{dataIndex: 'comment',title:'字段注解',width:"255px",default:'',align: "center",
					scopedSlots: { customRender: 'comment' },
					editCell:true,type:'input'},
				{dataIndex: 'fieldName',title:'字段名',width:"255px",default:'',align: "center",
					scopedSlots: { customRender: 'fieldName' },
					editCell:true,type:'input'},
				{dataIndex: 'renderType',title:'字段渲染',default:'',align: "center",
					scopedSlots: { customRender: 'renderType' },
					editCell:true,type:'select',selectList:[
						{label:"-",value:""},
						{label:"日期",value:"DATE"},
						{label:"数字",value:"NUMBER"},
						{label:"数据匹配",value:"SEARCH"},
					]},
			],
			//
			whereColumns:[
				{dataIndex: 'id', title:'序号',width:"65px",align: "center"},
				{dataIndex: 'comment',title:'字段注解',default:'',align: "center",
					scopedSlots: { customRender: 'comment' },
					editCell:true,type:'input'},
				{dataIndex: 'fieldName',title:'字段名',default:'',align: "center",
					scopedSlots: { customRender: 'fieldName' },
					editCell:true,type:'input'},
				{dataIndex: 'columnType',title:'数据类型',width:"120px",default:'varchar',align: "center",
					scopedSlots: { customRender: 'columnType' },
					editCell:true,type:'select',selectList:[
						{label:"字符串",value:"varchar"},
						{label:"数字",value:"number"},
						{label:"日期",value:"date"},
					]},
				{dataIndex: 'valueSource',title:'来源',width:"85px",default:'param',align: "center"},
			],
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
						dsAlias: data.dsAlias??'',
						resultField : data.resultField ? JSON.parse(data.resultField) : [],
						whereField : data.whereField ? JSON.parse(data.whereField) : [],
					});
                    that.formConfig.loading = false
                })
            } else{
				that.sourceData = {
					dsAlias:'',sql:'',
					isPage: 0, pageSize: 10, isCache: 0,
				}
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
            formData['sqlBuildType'] = "freeMarkerSql";
			{// 字段处理
				if(!this.$refs['resultEdit']){
					delete formData['resultField'];
					// self_.loading = false;
					// return self_.activeTab = "result";
				} else{
					let resultField = this.$refs['resultEdit'].getParam();
					resultField.forEach((item,i)=>{Object.assign(item,{id:(i+1)})})
					formData['resultField'] = JSON.stringify(resultField);
				}

				if(!this.$refs['whereEdit']){
					delete formData['whereField'];
					// self_.loading = false;
					// return self_.activeTab = "where";
				} else{
					let whereField = this.$refs['whereEdit'].getParam();
					whereField.forEach((item,i)=>{Object.assign(item,{id:(i+1)})})
					formData['whereField'] = JSON.stringify(whereField);
				}
			}
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
		// 列头设置
		findColumnList(){
			let self_ = this;
			let sourceData = self_.sourceData;
			let params = {
				queryType: "freeMarkerSql",
				dsAlias: sourceData.dsAlias,
				query: sourceData.sql
			}
			self_.$refs.ColumnList.openModal(params);
		},
		callback(v){
			console.log(v);
			let resultField = this.$refs['resultEdit'].getParam();
			let max = 0;
			resultField.forEach(item=>{if(item.id > max) max = item.id});
			v.data.forEach((m,i)=>{
				let d = resultField.filter(p=>p.fieldName == m.fieldName);
				if(d.length == 0){
					resultField.push({
						id: (max + i + 1),
						comment: m.fieldLabel,
						fieldName: m.fieldName,
						columnType: 'varchar',//m.fieldType,
						valueSource: 'param',
					})
				}
			});
			this.$refs['resultEdit'].setParam(resultField)
		},
    }
}
</script>

<style scoped lang="less">
</style>
