<template>
    <div>
		<edit_list ref="searchEdit" :columns="searchColumns" :data="sourceData.searchJson">
			<template v-slot:buttonAfter="v">
				<a-button type="primary" @click="setSearchData().open(v)">配置</a-button>
			</template>
		</edit_list>
		<!--弹窗-->
		<SearchData :key="modalTimer+'SearchData'" ref="SearchData" @callback="v=>setSearchData().callback(v)"/>
	</div>
</template>

<script>
import form_model from "@/component/form/form_model";
import edit_list from "@/component/table/edit_list";
import SearchData from "@/views/module/form/list/component/SearchData";

const dataKey = ['select','selectTree','checkbox','radio','cascader'];
export default {
	name: "editSearch",
	props: {
		sourceData: Object,
	},
	components: {
		form_model,
		edit_list,
		SearchData,
	},
	data(){
		return{
			//
			modalTimer: null,
			//
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
		}
	},
	methods:{
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
		// 获取返回数据
		getData(){
			console.log(123)
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
				return searchEdit
			} else{
				return null
			}
		}
	}
}
</script>

<style scoped>

</style>
