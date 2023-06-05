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
				<!--已选择表-->
				<template v-if="sourceData.tableName">
					<div class="p10 bor_a">
						<a-button-group>
							<a-button type="primary" icon="plus" @click="">添加</a-button>
							<a-button type="danger" icon="delete" @click="">删除</a-button>
							<a-button type="" icon="up" @click="">向上</a-button>
							<a-button type="" icon="down" @click="">向下</a-button>
							<a-button type="primary" @click="">保存并生成表单</a-button>
						</a-button-group>
					</div>
					<a-tabs class="nav_big1">
						<a-tab-pane tab="实体字段">
							<div class="p10 bor_a">
								<a-radio-group name="pkId" v-model="pkId" style="width: 100%">
									<a-table class="table_a mB20"
											 rowKey="xh"
											 :columns="columns"
											 :data-source="columnList"
											 :pagination="false"
											 :locale="{emptyText: '暂无数据'}">
										<span slot="isPk" slot-scope="text, record, index">
											<a-radio :value="record.fieldName"/>
										</span>
										<span slot="isNull" slot-scope="text, record, index">
											<a-checkbox v-model="record.isNotNull"/>
										</span>
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
			//
			columns:[
				{dataIndex: 'xh',key: 'xh',title:'序号',width: '5%',customRender:(text, record, index)=>`${index + 1}`},
				{dataIndex: 'isPk',key: 'isPk',title:'主键',width: '5%',scopedSlots: { customRender: 'isPk' }},
				{dataIndex: 'isNull',key: 'isNull',title:'非空',width: '5%',scopedSlots: { customRender: 'isNull' }},
				{dataIndex: 'comment',key: 'comment',title:'备注',width: '12%'},
				{dataIndex: 'fieldName',key: 'fieldName',title:'字段名',width: '12%'},
				{dataIndex: 'name',key: 'name',title:'属性名',width: '12%'},
				{dataIndex: 'columnType',key: 'columnType',title:'数据类型',width: '10%'},
				{dataIndex: 'intLen',key: 'intLen',title:'长度',width: '10%'},
				{dataIndex: 'decimalLen',key: 'decimalLen',title:'精度',width: '8%'},
			],
			columnList:[],
			pkId: null,
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
							if(item.isPk){
								this.pkId = item.fieldName;
							}
							return Object.assign(item, {
								isNotNull: !item.isNull
							})
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
            if(!this.pkId){
				self_.$message.success("不能没有主键");
				return self_.loading = false;
			}
            let formData = data.formData;
			formData.columns = this.columnList.map(item=>{
				return Object.assign(item, {
					isNull: item.isNotNull ? 0 : 1,
					isPk: this.pkId == item.fieldName ? 1 : 0,
				})
			});
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
					if(item.isPk){
						this.pkId = item.fieldName;
					}
					return Object.assign(item, {
						isNotNull: !item.isNull
					})
				})
			})
		},
    }
}
</script>

<style scoped>

</style>
