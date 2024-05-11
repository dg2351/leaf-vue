<template>
    <div class="xqPlace">
		<h1 class="plTit">系统菜单 </h1>
		<table_model ref="table_model" alias="/system/menu/list" rowKey="id" rowPid="pid"
					 :query-config="[]" :params="queryParam" :columns="columns"
					 :xh="false" :isPage="false" :showTotal="false" :isView="false">
			<template v-slot:headSlot>
				<a-button type="primary" class="floatR mT10" @click="event().edit()">新增</a-button>
			</template>
			<template v-slot:action="v">
				<a-button type="primary" size="small" @click="event().edit(v.data, v.data.id)">编辑</a-button>
				<a-button type="primary" size="small" @click="event().edit(null, v.data.id)">新增子菜单</a-button>
				<a-button type="danger" size="small" @click="event().del(v.data)">删除</a-button>
			</template>
		</table_model>
		<!--弹窗-->
		<edit_model v-if="timer" :key="timer" ref="edit_model" @callback="callback"/>
	</div>
</template>

<script>
import table_model from "@/component/table/table_model";
import edit_model from "./edit";
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
			timer:null,
			// 查询条件
			queryParam: {},
			// 查询配置
			columns:[
				{title:"菜单名称",dataIndex:"name",align:"left"},
				{title:"标识键",dataIndex:"key",align:"left",width:"20%"},
				{title:"菜单状态",dataIndex:"status",align:"left",width:"9%",customRender:(text,record)=>{
						let label = text=='1' ? '启用': '禁用';
						let className = text=='1' ? 'green': 'red';
						return (<span class={className}>{label}</span>)
					}},
				{title:"显示顺序",dataIndex:"sort",align:"left",width:"9%"},
				{title:"创建时间",dataIndex:"createTime",align:"left",width:"14%",customRender:(text,record)=>{return moment(text).format("YYYY-MM-DD hh:mm")}},
				{title:"系统值",dataIndex:"sys",align:"left",width:"8%",customRender:(text,record)=>{
						let label = text=='1' ? 'Y': 'N';
						let className = text=='1' ? 'green': 'red';
						return (<span class={className}>{label}</span>)
					}},
				{title:"操作列",dataIndex:"action",align:"left",width:"240px",scopedSlots: { customRender: 'action' }}
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
            method.edit = (record, pid)=>{
				self_.timer = new Date().getTime();
				self_.$nextTick(() => {
					let params = {id:record?.id??null, pid:pid}
					self_.$refs.edit_model.openModal(params);
				})
            }
            method.del = (record)=>{
            	if(record.sys == 1){
            		self_.$message.warning("系统菜单无法删除")
            		return;
				}
                self_.$util.modal(self_).confirm(null, '彻底删除后，数据不可恢复！请谨慎操作', function () {
                    let api = "/system/menu/delete";
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
