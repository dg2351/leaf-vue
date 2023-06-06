<template>
    <a-spin :spinning="loading">
        <!--弹框-->
        <dbModal ref="dbModal" @callBack="v=>{sourceData.dsAlias = v.alias;sourceData.dsName = v.name;}"/>
        <tableModal ref="tableModal" @callBack="getByName"/>
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
                            <a-form-model-item :label="item.label" :label-col="{span: 8 }" :required="true">
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
				<!--已选择表-->
				<template>
					<div class="p10 bor_a">
						<a-button-group>
							<a-button type="primary" icon="plus" @click="paramsEvent().add()">添加</a-button>
							<a-button type="danger" icon="delete" @click="paramsEvent().removes()">删除</a-button>
							<a-button type="" icon="up" @click="paramsEvent().up()">向上</a-button>
							<a-button type="" icon="down" @click="paramsEvent().down()">向下</a-button>
							<a-button type="primary" @click="onSubmit(true)">保存并生成表单</a-button>
						</a-button-group>
					</div>
					<a-tabs class="nav_big1">
						<a-tab-pane tab="实体字段">
							<div class="p10 bor_a">
								<a-radio-group name="pkId" v-model="pkId" style="width: 100%">
									<a-table class="table_a mB20" rowKey="pk"
											 :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
											 :columns="columns" :data-source="columnList"
											 :pagination="false" :locale="{emptyText: '暂无数据'}">
										<span slot="isPk" slot-scope="text, record, index">
											<a-radio :value="record.pk"/>
										</span>
										<span slot="isNull" slot-scope="text, record, index">
											<a-checkbox v-model="record.isNotNull"/>
										</span>
										<template v-for="item in [
                                                        {name:'comment',type:'input'},
                                                        {name:'fieldName',type:'input'},
                                                        {name:'name',type:'input'},
                                                        {name:'columnType',type:'select'},
                                                    ]" :slot="item.name" slot-scope="text, record">
											<editable-cell :record="record" :type="item.type" :itemKey="item.name"/>
										</template>
										<template slot="intLen" slot-scope="text, record">
											<editable-cell :record="record" type="input" itemKey="intLen"
														   :disabled_="specialType.includes(record.columnType)"/>
										</template>
										<template slot="decimalLen" slot-scope="text, record">
											<editable-cell :record="record" type="input" itemKey="decimalLen"
														   :disabled_="!['DECIMAL'].includes(record.columnType)"/>
										</template>
										<a-button slot="action" slot-scope="text, record, index"
												  type="danger" icon="delete"
												  @click="paramsEvent().removes(record.pk)"/>
									</a-table>
								</a-radio-group>
							</div>
						</a-tab-pane>
					</a-tabs>
				</template>
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
import uuid from "@/plugins/utils/uuid"

const specialType = ['INT','TEXT','LONGTEXT','MEDIUMTEXT','DATETIME'];
const paramType = [
	{label:'VARCHAR',value:'VARCHAR'},
	{label:'CHAR',value:'CHAR'},
	{label:'INT',value:'INT'},
	{label:'DECIMAL',value:'DECIMAL'},
	{label:'TEXT',value:'TEXT'},
	{label:'LONGTEXT',value:'LONGTEXT'},
	{label:'MEDIUMTEXT',value:'MEDIUMTEXT'},
	{label:'DATETIME',value:'DATETIME'},
];
const EditableCell = {
	template: `
      <div class="editable-cell">
          <div class="editable-cell-input-wrapper">
              <a-input ref="ipt" v-if="type=='input'" style="width: calc(100% - 0px)"
					   v-model="record[itemKey]" :disabled="disabled_" @blur="inputEvent"/>
              <a-select ref="slt" v-if="type=='select'" v-model="record[itemKey]" :options="paramType" :disabled="disabled_"
						option-filter-prop="children" @change="changeEvent"/>
          </div>
      </div>
    `,
	props: {
		record: Object,
		itemKey:String,
		type: String,
		disabled_: {
			type: Boolean,
			default: false
		},
	},
	data() {
		return {
			editable: false,
			paramType,
		};
	},
	methods: {
		changeEvent(v){
			if(specialType.includes(v)){
				this.record.intLen = 0;
			}
			if(!['DECIMAL'].includes(v)){
				this.record.decimalLen = 0;
			}
		},
		inputEvent(){
			if(this.itemKey == 'fieldName' && !this.record['name']){
				let str = String(this.record[this.itemKey]);
				this.record['name'] = str.toCamelCase();
			}
		}
	},
};
export default {
    name: "edit",
    props: {
        params: Object,
    },
    components: {form_model, dbModal, tableModal, EditableCell},
    computed: {
        routerParams() {
            return this.$route.query;
        },
    },
    data() {
        return {
			specialType,
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
			//
			columns:[
				{dataIndex: 'xh',key: 'xh',title:'序号',width: '6%',customRender:(text, record, index)=>`${index + 1}`},
				{dataIndex: 'isPk',key: 'isPk',title:'主键',width: '6%',scopedSlots: { customRender: 'isPk' }},
				{dataIndex: 'isNull',key: 'isNull',title:'非空',width: '6%',scopedSlots: { customRender: 'isNull' }},
				{dataIndex: 'comment',key: 'comment',title:'备注',width: '15%',scopedSlots: { customRender: 'comment' }},
				{dataIndex: 'fieldName',key: 'fieldName',title:'字段名',width: '14%',scopedSlots: { customRender: 'fieldName' }},
				{dataIndex: 'name',key: 'name',title:'属性名',width: '14%',scopedSlots: { customRender: 'name' }},
				{dataIndex: 'columnType',key: 'columnType',title:'数据类型',width: '15%',scopedSlots: { customRender: 'columnType' }},
				{dataIndex: 'intLen',key: 'intLen',title:'长度',width: '8%',scopedSlots: { customRender: 'intLen' }},
				{dataIndex: 'decimalLen',key: 'decimalLen',title:'精度',width: '8%',scopedSlots: { customRender: 'decimalLen' }},
				{dataIndex: 'action',key: 'action',title:'操作列',width: '8%',scopedSlots: { customRender: 'action' }},
			],
			columnList:[],
			pkId: null,//主键
			selectedRowKeys:[],// 选择项
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
		// 获取数据
        loadData(id){
            let that = this;
            if(id){
                let api = "/form/bo/entity/info";
                let params = Object.assign({id:id});
                rxAjax.get(api, params).then(({success,data})=>{
                    if(data.columns){
						this.columnList = data.columns.map(item=>{
							let pk = item.id;
							if(item.isPk) this.pkId = pk;
							return Object.assign(item, {pk,isNotNull: !item.isNull})
						})
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
			if(!formData.dsName){
				this.$util.message().warning("操作提示","请选择数据源!");
				return self_.loading = false;
			}
            if(!this.pkId){
				this.$util.message().warning("操作提示","不能没有主键!");
				return self_.loading = false;
			}
            let temp = true;
			formData.columns = this.columnList.map(item=>{
				if(!item.comment || !item.name || !item.fieldName || !item.columnType){
					temp = false;
				}
				return Object.assign(item, {
					isNull: item.isNotNull ? 0 : 1,
					isPk: this.pkId == item.pk ? 1 : 0,
				})
			});
			if(!temp){
				this.$util.message().warning("操作提示","备注、字段名、属性名不能为空!");
				return self_.loading = false;
			}
			if(!formData.tableName)
				formData.tableName = formData.alias;
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
		// 获取列信息
		getByName(tbName) {
        	this.sourceData.tableName = tbName;
        	if(!tbName){
				return this.columnList = [];
			}
			let api = "/form/db/getByName";
			let params = {dsAlias:this.sourceData.dsAlias, tbName};
			rxAjax.postForm(api, params).then(data=>{
				this.columnList = data.columnList.map(item=>{
					let pk = uuid.getUuId(18)
					if(item.isPk) this.pkId = pk;
					return Object.assign(item, {pk,isNotNull: !item.isNull})
				})
			})
		},
		// 参数定义事件
		paramsEvent(){
			let self_ = this;
			let method = {};
			method.add = ()=>{
				let pk = uuid.getUuId(18)
				self_.columnList.push({
					pk,entId:self_.params.id,isPk:0,isNull:1,
					comment:"",fieldName:"",name:"",
					columnType:"VARCHAR",intLen:64,decimalLen:0
				})
			}
			method.removes = (pk)=>{
				let keys = pk ? [pk] : (self_.selectedRowKeys ?? []);
				self_.columnList = self_.columnList.filter(p=>!keys.includes(p.pk)).map(m=>{return m});
			}
			method.up = ()=>{
				let keys = self_.selectedRowKeys ?? [];
				let list = JSON.parse(JSON.stringify(self_.columnList));
				for(let i=0;i<=list.length;i++){
					let temp = list[i];
					if(!temp) continue;
					if(keys.includes(temp.pk) && i > 0){
						list[i] = list.splice(i - 1, 1, list[i])[0];
					}
				}
				self_.columnList = list;
			}
			method.down = ()=>{
				let keys = self_.selectedRowKeys ?? [];
				let list = JSON.parse(JSON.stringify(self_.columnList));
				for(let i=list.length-1;i>=0;i--){
					let temp = list[i];
					if(!temp) continue;
					if(keys.includes(temp.pk) && i != list.length-1){
						list[i] = list.splice(i + 1, 1, list[i])[0];
					}
				}
				self_.columnList = list;
			}
			return method;
		},
		onSelectChange(selectedRowKeys){
			this.selectedRowKeys = selectedRowKeys;
		}
    }
}
</script>

<style scoped>

</style>
