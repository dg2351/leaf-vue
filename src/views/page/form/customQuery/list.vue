<template>
    <div class="textLeft">
		<table_model ref="table_model" alias="/form/custom/query/list" rowKey="id"
					 :query-config="queryConfig" :params="queryParam"
					 :columns="columns" @eventView="v=>event().edit(v)">
			<template v-slot:headSlot>
				<a-button type="primary" class="floatR mT10" @click="event().edit()">新增</a-button>
			</template>
			<template v-slot:action="v">
				<a-button type="danger" size="small" @click="event().del(v.data)">删除</a-button>
				<a-button type="normal" size="small" @click="event().test(v.data)">预览</a-button>
			</template>
		</table_model>
    </div>
</template>

<script>
import table_model from "@/component/table/table_model";
import rxAjax from '@/assets/js/ajax.js';
import moment from "moment"

export default {
    name: "list",
    components: {table_model},
    data() {
        return {
			// 查询条件
			queryParam: {},
			// 查询配置
			queryConfig:[
				{span:12,labelCol:6,label:"名称",value:null,key:"name",type:"input"},
				{span:12,labelCol:6,label:"别名",value:null,key:"alias",type:"input"},
			],
			columns:[
				{title:"名称",dataIndex:"name"},
				{title:"标识名",dataIndex:"alias"},
				{title:"更新时间",dataIndex:"updateTime",customRender:(text,record)=>{return moment(text).format("YYYY-MM-DD hh:mm")}},
				{title:"操作列",dataIndex:"action",width:"220px",align:"center",scopedSlots: { customRender: 'action' }}
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
            method.edit = (record)=>{
                let params = {id:record?record.id:null}
                self_.$util.component(self_).event('edit', params);
            }
            method.del = (record)=>{
                self_.$util.modal(self_).confirm(null, '彻底删除后，数据不可恢复！请谨慎操作', function () {
                    let api = "/form/custom/query/delete";
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
            method.test = (record)=>{
				let params = {id:record?record.id:null}
				self_.$util.component(self_).event('test', params);
			}
            return method;
        }
    },
}
</script>

<style scoped>

</style>
