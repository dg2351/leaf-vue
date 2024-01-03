<template>
	<div>
		<a-modal title="编辑-自定义列表" dialogClass="modal_a" width="90%"
				 :visible="visible" @cancel="closeModal" :footer="null">
			<a-spin :spinning="loading">
				<template v-if="step == 1">
					<div class="p10 bor_a" style="height: 650px;overflow-y: auto">
						<form_model ref="formModel" :sourceData="sourceData" :form-config="formConfig"/>
					</div>
					<div class="textCenter mB20">
						<a-button type="primary" class="mR15" v-if="sourceData.id" @click="step = 2">下一步</a-button>
						<a-button type="primary" class="mR15" @click="onSubmit1(true)">保存&下一步</a-button>
						<a-button class="mR15"  @click="closeModal()">返回</a-button>
					</div>
				</template>
				<template v-if="step == 2">
					<div class="p10 bor_a" style="height: 650px;overflow-y: auto">
						<a-tabs class="nav_big1">
							<a-tab-pane key="fields" tab="列头配置">
								<form_model ref="formModel" :sourceData="sourceData" :form-config="formFields"/>
								<edit_list :key="fieldsTimer" ref="fieldsEdit" :columns="fieldsColumns" :data="sourceData.fieldsJson">
									<template slot="buttonBefore">
										<a-button type="primary" @click="getFields">重新加载表头</a-button>
									</template>
								</edit_list>
							</a-tab-pane>
							<a-tab-pane key="search" tab="条件配置">
								<edit_list :key="searchTimer" ref="searchEdit" :columns="searchColumns" :data="sourceData.searchJson">
									<template v-slot:buttonAfter="v">
										<a-button type="primary" @click="setSearchData().open(v)">配置</a-button>
									</template>
								</edit_list>
							</a-tab-pane>
						</a-tabs>
					</div>
					<div class="textCenter mB20">
						<a-button type="primary" class="mR15" @click="step = 1">上一步</a-button>
						<a-button type="primary" class="mR15" @click="onSubmit2(true)">保存</a-button>
						<a-button class="mR15"  @click="closeModal()">返回</a-button>
					</div>
				</template>
			</a-spin>
		</a-modal>
		<!--弹窗-->
		<SearchData :key="modalTimer" ref="SearchData" @callback="v=>setSearchData().callback(v)"/>
	</div>
</template>

<script>
import rxAjax from "@/assets/js/ajax";
import form_model from "@/component/form/form_model";
import edit_list from "@/component/table/edit_list";
import SearchData from "@/views/page/form/list/component/SearchData";

const dataKey = ['select','selectTree','checkbox','radio','cascader'];
export default {
    name: "edit",
    props: {
        params: Object,
    },
    components: {
    	form_model,
		edit_list,
		SearchData,
	},
    computed: {
        routerParams() {
            return this.$route.query;
        },
    },
    data() {
    	let self_ = this;
        return {
			visible: false,
            loading:false,
			// 步骤
			step:1,
			//
            sourceData:{},
            formConfig: {
                visible: false,
                loading: true,
                disabled: false,
				collapseKey: ["基本信息","参数配置","来源配置"],
				collapse: [
					{label:"基本信息", data: ["name","alias","treeId"]},
					{label:"参数配置", data: ["isXh","isPage"]},
					{label:"来源配置", data: ["url", "urlMethod"]},
				],
                data: [
                    {
                        label: "名称",
                        type: "input",
                        vModel: "name",
                        maxLength: 20,
                        rule: [
                            {required: true, message: '该输入项不能为空', trigger: 'change'},
                        ],
                    },
                    {
                        label: "别名",
                        type: "input",
                        vModel: "alias",
                        maxLength: 20,
                        rule: [
                            {required: true, message: '该输入项不能为空', trigger: 'change'},
                        ],
                    },
					{
						label: "分类",
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
						label: "是否显示序号",
						type: "radio",
						vModel: "isXh",
						options:[
							{label:'是',value:1},
							{label:'否',value:0},
						],
						maxLength: 20,
						rule: [
							{required: true, message: '该输入项不能为空', trigger: 'change'},
						],
					},
					{
						label: "是否分页",
						type: "radio",
						vModel: "isPage",
						options:[
							{label:'是',value:1},
							{label:'否',value:0},
						],
						maxLength: 20,
						rule: [
							{required: true, message: '该输入项不能为空', trigger: 'change'},
						],
					},
					{
						label: "数据来源",
						type: "input",
						vModel: "url",
						maxLength: 60,
						rule: [
							{required: true, message: '该输入项不能为空', trigger: 'change'},
						],
					},
					{
						label: "请求方式",
						type: "radio",
						vModel: "urlMethod",
						options:[
							{label:'postForm',value:'postForm'},
							// {label:'postJson',value:'postJson'},
						],
						rule: [
							{required: true, message: '该输入项不能为空', trigger: 'change'},
						],
					},
				]
			},
			//
			formFields: {
				visible: false,
				loading: true,
				disabled: false,
				data: [
					{
						label: "主键",
						type: "input",
						vModel: "idField",
						maxLength: 20,
						rule: [
							{required: true, message: '该输入项不能为空', trigger: 'change'},
						],
					},
				]
			},
			fieldsTimer:null,
			searchTimer:null,
			fieldsColumns:[
				{title:"字段名称",dataIndex:"label",align: "center",default:'',
					scopedSlots: { customRender: 'label' },
					editCell:true,type:'input'},
				{title:"字段Key",dataIndex:"dataIndex",align: "center",default:'',
					scopedSlots: { customRender: 'dataIndex' },
					editCell:true,type:'input'},
				{title:"是否显示",dataIndex:"show",width:"120px",align: "center",default:'',
					scopedSlots: { customRender: 'show' },
					editCell:true,type:'check'},
				{title:"宽度",dataIndex:"width",width:"120px",align: "center",default:'',
					scopedSlots: { customRender: 'width' },
					editCell:true,type:'number'},
				{title:"文本位置",dataIndex:"align",width:"120px",align: "center",default:'left',
					scopedSlots: { customRender: 'align' },
					editCell:true,type:'select',selectList:[
						{label:"居中",value:"center"},
						{label:"居左",value:"left"},
						{label:"居右",value:"right"},
					]},
				{title:"渲染方式",dataIndex:"slots",width:"120px",align: "center",default:'',
					scopedSlots: { customRender: 'slots' },
					editCell:true,type:'select',selectList:[
						{label:"无",value:""},
						{label:"图片",value:"img"},
						{label:"日期",value:"date"},
					]},
			],
			searchColumns:[
				{title:"字段名称",dataIndex:"label",align: "center",default:'',
					scopedSlots: { customRender: 'label' },
					editCell:true,type:'input'},
				{title:"字段Key",dataIndex:"key",align: "center",default:'',
					scopedSlots: { customRender: 'key' },
					editCell:true,type:'input'},
				{title:"组件类型",dataIndex:"type",width:"150px",align: "center",default:'input',
					scopedSlots: { customRender: 'type' },
					editCell:true,type:'select',selectList:[
						{label:"输入框",value:"input"},
						{label:"选择框",value:"select"},
						{label:"树状选择",value:"selectTree"},
						{label:"多选框",value:"checkbox"},
						{label:"单选框",value:"radio"},
						{label:"级联选择",value:"cascader"},
						{label:"标签选择",value:"label"},
						{label:"日期选择",value:"datetime"},
						{label:"时间区间",value:"datetimes"},
						{label:"数字区间",value:"numbers"},
						{label:"其它",value:"other"},
					]},
				{title:"是否显示",dataIndex:"show",width:"100px",align: "center",default:1,
					scopedSlots: { customRender: 'show' },
					editCell:true,type:'check'},
				{title:"span",dataIndex:"span",width:"120px",align: "center",default:12,
					scopedSlots: { customRender: 'span' },
					editCell:true,type:'number'},
				{title:"labelCol",dataIndex:"labelCol",width:"120px",align: "center",default:6,
					scopedSlots: { customRender: 'labelCol' },
					editCell:true,type:'number'},
				{title:"说明文本",dataIndex:"placeholder",align: "center",default:'',
					scopedSlots: { customRender: 'placeholder' },
					editCell:true,type:'input'},
				// {title:"单位",dataIndex:"suffix",align: "center",default:'',
				// 	scopedSlots: { customRender: 'suffix' },
				// 	editCell:true,type:'input'},
			],
			//
			modalTimer: null,
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
        loadData(id){
            if(id){
                let api = "/form/bo/list/info";
                let params = Object.assign({id:id});
                rxAjax.get(api, params).then(({success,data})=>{
					this.sourceData = Object.assign(data, {
						fieldsJson: data.fieldsJson?JSON.parse(data.fieldsJson) : [],
						searchJson: data.searchJson?JSON.parse(data.searchJson) : [],
					});
					this.fieldsTimer = new Date().getTime();
					this.searchTimer = new Date().getTime();
					this.formConfig.loading = false
					console.log(this.sourceData)
                })
            } else{
				this.sourceData = Object.assign({
					fieldsJson: [],
					searchJson: [],
				});
				this.fieldsTimer = new Date().getTime();
				this.searchTimer = new Date().getTime();
				this.formConfig.loading = false
            }
        },
        // 提交
        onSubmit1(validate){
            let self_ = this;
            if(self_.loading) return;
            self_.loading = true;
            let data = this.$refs['formModel'].formMethods().getData(validate);
            if(!(data.validate)){
                return self_.loading = false;
            }
            let formData = data.formData;
			delete formData.idField;
            delete formData.fieldsJson;
			delete formData.searchJson;
            // 调用保存表单
            let api = "/form/bo/list/save";
            rxAjax.postJson(api, formData).then(({success,data})=>{
                self_.loading = false;
                if(success && data){
                    self_.$message.success("保存成功");
                    self_.sourceData.id = data;
					self_.step = 2;
                }
            }).catch(err=>{
				self_.loading = false;
				self_.$message.error("网络错误");
			});
        },
		// 提交
		onSubmit2(validate){
			let self_ = this;
			if(self_.loading) return;
			self_.loading = true;
			let {sourceData} = this;
			if(!sourceData.id){
				self_.$util.message().error("操作提示", "数据主键丢失");
				return self_.closeModal(true)
			}
			// 组装数据
			let formData = {
				id: sourceData.id,
				idField: sourceData.idField,
			}
			if(this.$refs['fieldsEdit']){
				let fieldsEdit = this.$refs['fieldsEdit'].getParam();
				fieldsEdit.map(map=>{return Object.assign(map, {title:map.label})})
				Object.assign(formData, {fieldsJson:JSON.stringify(fieldsEdit)})
			}
			if(this.$refs['searchEdit']){
				let searchEdit = this.$refs['searchEdit'].getParam();
				searchEdit.filter(p=>p.show == 1).map(map=>{
					// 选择项
					if(dataKey.includes(map.key)){
						if(!map.data){
							map.data = [];
						}
					}
					// 初始值
					{
						if(['input','radio','cascader','datetime','datetimes','numbers'].includes(map.key)){
							if(!map.value){
								map.value = null;
							}
						} else if(['select','label'].includes(map.key)){
							if(!map.value){
								map.value = '';
							}
						} else if(['checkbox','selectTree'].includes(map.key)){
							if(!map.value){
								map.value = [];
							}
						}
					}
					return map;
				})
				Object.assign(formData, {searchJson:JSON.stringify(searchEdit)})
			}
			// 调用保存表单
			let api = "/form/bo/list/save";
			rxAjax.postJson(api, formData).then(({success,data})=>{
				self_.loading = false;
				if(success && data){
					self_.$message.success("保存成功");
					self_.sourceData.id = data;
					// if(validate) self_.closeModal(true);
					self_.step = 2;
				}
			}).catch(err=>{
				self_.loading = false;
				self_.$message.error("网络错误");
			});
		},
		// 获取表头
		getFields(){
			let self_ = this;
			let alias = this.sourceData.url;
			let api = "/form/custom/query/list";
			rxAjax.postJson(api, {alias}).then(({success, data})=>{
				if(!success || data.length == 0){
					self_.$message.error("网络错误");
					return;
				}
				let sourceData = data[0];
				let resultField = JSON.parse(sourceData.resultField??[]);
				let fieldsJson = [];
				let idField = "";
				resultField.forEach((map,i)=>{
					if(i==0){
						idField = map.fieldName
					}
					fieldsJson.push({
						id: (i+1),
						label:map.comment,
						dataIndex:map.fieldName,
						show:1,
						align:'left',
					})
				})
				if(!self_.sourceData.idField)
					self_.sourceData.idField = idField;
				self_.sourceData.fieldsJson = fieldsJson;
				self_.fieldsTimer = new Date().getTime();
			})
		},
		// 设置查询数据
		setSearchData(){
			let self_ = this;
			let dataIndex = 0;
			let $data = {};
			let method = {};
			method.open = function(v){
				if(v.row.length == 0){
					self_.$util.message().warning('操作提示', '请选择渲染项');
					return;
				} else if(v.row.length > 1){
					self_.$util.message().warning('操作提示', '不能同时选择多项进行渲染');
					return;
				}
				dataIndex = v.row[0];
				$data = v.data.filter(p=>p.id == dataIndex)[0];
				if(!dataKey.includes($data.type)){
					self_.$util.message().warning('操作提示', '该数据类型无须配置');
					return;
				}
				if(!$data.datasource){
					$data.datasource = 'config';
				}
				if(!$data.data){
					$data.data = [];
				}
				self_.modalTimer = new Date().getTime();
				self_.$nextTick(() => {
					self_.$refs.SearchData.openModal($data);
				})
			}
			method.callback = function(v){
				if(v.validate){// 赋值
					self_.$refs.searchEdit.setListData(v.data);
				}
			}
			return method;
		},
    }
}
</script>

<style scoped>

</style>
