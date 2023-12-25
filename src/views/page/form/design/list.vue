<template>
    <div class="textLeft">
		<a-row>
			<a-col :span="4">
				<tree_model ref="tree_model" alias="/system/tree/list" @callback="callback"/>
			</a-col>
			<a-col :span="20">
				<table_model ref="table_model" alias="/form/design/list" rowKey="id"
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
		<!---->
		<editModal ref="editModal" v-if="visible" :key="visible"/>
    </div>
</template>

<script>
import table_model from "@/component/table/table_model";
import tree_model from "@/component/tree/tree_model";
import rxAjax from '@/assets/js/ajax.js';
import editModal from "./editModal";

export default {
    name: "list",
    components: {
    	table_model,
		tree_model,
		editModal,
	},
    data() {
        return {
			// 查询条件
			queryParam: {},
			// 查询配置
			queryConfig:[
				{span:12,labelCol:6,label:"表单名称",value:null,key:"name",type:"input"},
			],
			columns:[
				{title:"名称",dataIndex:"name"},
				{title:"标识",dataIndex:"alias"},
				{title:"操作列",dataIndex:"action",width:"220px",align:"center",scopedSlots: { customRender: 'action' }}
			],
			//
			visible: null,
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
                let params = {id:record?record.id:null}
				self_.visible = new Date().getTime();
				self_.$nextTick(()=> {
					self_.$refs.editModal.openModal(params);
				});
            }
            method.del = (record)=>{
                self_.$util.modal(self_).confirm(null, '彻底删除后，数据不可恢复！请谨慎操作', function () {
                    let api = "/form/design/delete";
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
		//
		callback(e){
			this.queryParam.treeId = e;
			this.$refs.table_model.loadData(1);
		},
    },
}
</script>

<style scoped>

</style>
