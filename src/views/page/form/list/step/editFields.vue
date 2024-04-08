<template>
    <div>
		<form_model ref="formModel" :sourceData="sourceData" :form-config="formFields"/>
		<edit_list :key="fieldsTimer" ref="fieldsEdit" :columns="fieldsColumns" :data="sourceData.fieldsJson">
			<template slot="buttonBefore">
				<a-button type="primary" @click="getFields">重新加载表头</a-button>
			</template>
			<template v-slot:buttonAfter="v">
				<a-button type="primary" @click="setFieldsData().open(v)">字段渲染</a-button>
			</template>
		</edit_list>
		<!--弹窗-->
		<FieldsData :key="modalTimer+'FieldsData'" ref="FieldsData" @callback="v=>setFieldsData().callback(v)"/>
	</div>
</template>

<script>
import form_model from "@/component/form/form_model";
import FieldsData from "@/views/page/form/list/component/FieldsData";
import edit_list from "@/component/table/edit_list";
import rxAjax from "@/assets/js/ajax";

export default {
	name: "editFields",
	props:{
		sourceData:Object,
	},
	components:{
		form_model,
		FieldsData,
		edit_list,
	},
	data(){
		return{
			modalTimer: null,
			//
			fieldsTimer:null,
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
						{label:"操作列",value:"action"},
					]},
			],
		}
	},
	mounted() {
		this.fieldsTimer = new Date().getTime();
	},
	methods:{
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
		// 设置列表渲染
		setFieldsData(){
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
				if(!['action'].includes($data.slots)){
					self_.$util.message().warning('操作提示', '该渲染方式无须配置');
					return;
				}
				if(!$data.data){
					$data.data = [];
				}
				self_.modalTimer = new Date().getTime();
				self_.$nextTick(() => {
					self_.$refs.FieldsData.openModal($data);
				})
			}
			method.callback = function(v){
				if(v.validate){// 赋值
					self_.$refs.fieldsEdit.setListData(v.data);
				}
			}
			return method;
		},
		// 获取返回数据
		getData(){
			if(this.$refs['fieldsEdit']){
				let fieldsEdit = this.$refs['fieldsEdit'].getParam();
				fieldsEdit.map(map=>{return Object.assign(map, {title:map.label})})
				return fieldsEdit
			} else{
				return null
			}
		}
	}
}
</script>

<style scoped>

</style>
