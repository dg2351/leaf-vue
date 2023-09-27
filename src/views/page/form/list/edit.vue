<template>
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
							<edit_list :key="fieldsTimer" ref="fieldsEdit" :columns="fieldsColumns" :data="sourceData.fieldsJson">
								<template slot="buttonBefore">
									<a-button type="primary" @click="getFields">重新加载表头</a-button>
								</template>
							</edit_list>
						</a-tab-pane>
						<a-tab-pane key="search" tab="条件配置">
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
</template>

<script>
import rxAjax from "@/assets/js/ajax";
import form_model from "@/component/form/form_model";
import edit_list from "@/component/table/edit_list";

export default {
    name: "edit",
    props: {
        params: Object,
    },
    components: {
    	form_model,
		edit_list,
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
						label: "分类",
						type: "selectTree",
						model: "treeId",
						data:[],
						initFunction: async function (item) {
							let {data} = await rxAjax.postJson("/system/tree/list", {});
							let sourceData = data.map(m=>{return {id:m.id, pid:m.parentId, label:m.name, value:m.id }})
							let list = self_.$util.buildTree(sourceData, "id", "pid");
							item.data = list
						},
					},
					{
						label: "是否显示序号",
						type: "radio",
						model: "isXh",
						data:[
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
						model: "isPage",
						data:[
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
						model: "url",
						maxLength: 60,
						rule: [
							{required: true, message: '该输入项不能为空', trigger: 'change'},
						],
					},
					{
						label: "请求方式",
						type: "radio",
						model: "urlMethod",
						data:[
							{label:'postjson',value:'postjson'},
							{label:'postform',value:'postform'},
						],
						rule: [
							{required: true, message: '该输入项不能为空', trigger: 'change'},
						],
					},
				]
			},
			//
			fieldsTimer:null,
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
			],
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
					this.formConfig.loading = false
                })
            } else{
				this.sourceData = Object.assign({
					fieldsJson: [],
					searchJson: [],
				});
				this.fieldsTimer = new Date().getTime();
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

			let fieldsEdit = this.$refs['fieldsEdit'].getParam();
			let formData = {
				id: sourceData.id,
				fieldsJson: JSON.stringify(fieldsEdit),
				searchJson: JSON.stringify(sourceData.searchJson),
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
				resultField.forEach((map,i)=>{
					fieldsJson.push({
						id: (i+1),
						label:map.comment,
						dataIndex:map.fieldName,
						show:1,
						align:'left',
					})
				})
				self_.sourceData.fieldsJson = fieldsJson;
				self_.fieldsTimer = new Date().getTime();
			})
		}
    }
}
</script>

<style scoped>

</style>
