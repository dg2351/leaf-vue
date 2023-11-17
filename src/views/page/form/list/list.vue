<template>
    <div class="textLeft">
		<edit_model v-if="editTimer" :key="editTimer" ref="edit_model" @callback="callback"/>
		<a-row>
			<a-col :span="4">
				<tree_model ref="tree_model" alias="/system/tree/list" @callback="treeCallback"/>
			</a-col>
			<a-col :span="20">
				<table_model ref="table_model" alias="/form/bo/list/list" rowKey="id"
							 :query-config="queryConfig" :params="queryParam"
							 :columns="columns" @eventView="v=>event().edit(v)">
					<template v-slot:headSlot>
						<a-button type="primary" class="floatR mT10" @click="event().edit()">新增</a-button>
					</template>
					<template v-slot:action="v">
						<a-button type="danger" size="small" @click="event().del(v.data)">删除</a-button>
					</template>
				</table_model>
			</a-col>
		</a-row>
    </div>
</template>

<script>
import table_model from "@/component/table/table_model";
import edit_model from "@/views/page/form/list/edit"
import rxAjax from '@/assets/js/ajax.js';
import moment from "moment";
import tree_model from "@/component/tree/tree_model";

export default {
    name: "list",
    components: {
    	table_model,
		edit_model,
		tree_model,
	},
    data() {
        return {
            loading: false,
			// 查询条件
            queryParam: {},
			// 查询配置
			queryConfig:[
				{span:12,labelCol:6,label:"名称",value:null,key:"name",type:"input",placeholder:"请输入您要查找的内容"},
				{span:12,labelCol:6,label:"别名",value:null,key:"alias",type:"input"},
			],
			columns:[
				{title:"名称",dataIndex:"name"},
				{title:"别名",dataIndex:"alias"},
				{title:"创建时间",dataIndex:"createTime",customRender:(text)=>{return moment(text).format("YYYY-MM-DD hh:mm")}},
				{title:"操作列",dataIndex:"action",width:"220px",align:"center",scopedSlots: { customRender: 'action' }}
			],
			//
			editTimer: null,
        }
    },
    methods:{
        /**
         * 修改
         * @param record
         */
        event(){
            let self_ = this;
            let method = {};
            method.edit = (record)=>{
                let params = {id:record?.id};
                self_.editTimer = new Date().getTime();
				self_.$nextTick(() => {
					self_.$refs.edit_model.openModal(params);
				})
            }
            method.del = (record)=>{
                self_.$util.modal(self_).confirm(null, '彻底删除后，数据不可恢复！请谨慎操作', function () {
                    let api = "/form/bo/list/delete";
                    let params = {id:record.id}
                    rxAjax.postForm(api, params).then(({success,data})=>{
                        if(success){
                            self_.$message.success('成功删除记录');
                            self_.$refs.table_model.refreshData();
                        }else{
                            self_.$message.error('删除失败');
                        }
                    })
                })
            }
            return method;
        },
		// 弹窗回调
		callback(v){
			let self_ = this;
			if(v.refresh){
				self_.$refs.table_model.refreshData();
			}
		},
		//
		treeCallback(e){
			this.queryParam.treeId = e;
			this.$refs.table_model.loadData(1);
		},
    },
}
</script>

<style scoped>

</style>
