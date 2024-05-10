<template>
    <div class="xqPlace">
		<h1 class="plTit">系统分类树 </h1>
		<table_model ref="table_model" alias="/system/tree/list" rowKey="id" rowPid="parentId"
					 :expandIconColumnIndex="1"
					 :query-config="[]" :params="queryParam" :xh="false" :isPage="false" :showTotal="false"
					 :columns="columns" @eventView="v=>event().edit(v)">
			<template v-slot:headSlot>
				<a-button type="primary" class="floatR mT10" @click="event().edit()">新增</a-button>
			</template>
			<template v-slot:action="v">
				<a-button type="primary" size="small" @click="event().edit(null, v.data.id)">添加子级</a-button>
				<a-button type="danger" size="small" @click="event().del(v.data)">删除</a-button>
			</template>
		</table_model>
		<!--弹窗-->
		<edit_model ref="edit_model" @callback="callback"/>
	</div>
</template>

<script>
import table_model from "@/component/table/table_model";
import edit_model from "@/views/module/system/tree/edit";
import rxAjax from '@/assets/js/ajax.js';
import moment from "moment";

export default {
    name: "list",
    components: {
    	table_model,
		edit_model,
	},
    data() {
        return {
			// 查询条件
			queryParam: {},
			// 查询配置
			columns:[
				{title:"名称",dataIndex:"name",align:"left"},
				{title:"节点别名",dataIndex:"code",align:"left",width:"30%"},
				{title:"创建时间",dataIndex:"createTime",align:"left",width:"18%",customRender:(text,record)=>{return moment(text).format("YYYY-MM-DD hh:mm")}},
				{title:"操作列",dataIndex:"action",align:"left",width:"220px",scopedSlots: { customRender: 'action' }}
			],
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
            method.edit = (record, parentId)=>{
                let params = {id:record?.id??null, parentId:parentId}
                self_.$refs.edit_model.openModal(params);
            }
            method.del = (record)=>{
                self_.$util.modal(self_).confirm(null, '彻底删除后，数据不可恢复！请谨慎操作', function () {
                    let api = "/system/tree/delete";
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
		}
    },
}
</script>

<style scoped>

</style>
