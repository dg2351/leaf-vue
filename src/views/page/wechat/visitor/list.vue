<template>
    <div class="textLeft">
		<table_model ref="table_model" method="postForm"
					 alias="/form/custom/query/queryForJson_wechat_user" rowKey="id"
					 :query-config="queryConfig" :params="queryParam"
					 :columns="columns" @eventView="v=>event().edit(v)" :action="false"/>
    </div>
</template>

<script>
import table_model from "@/component/table/table_model";
import moment from "moment";

export default {
    name: "list",
    components: {table_model},
    data() {
        return {
			// 查询条件
			queryParam: {},
			// 查询配置
			queryConfig:[
				{span:12,labelCol:6,label:"用户名称",value:null,key:"nickname",type:"input"},
			],
			columns:[
				{title:"头像",dataIndex:"headimgurl",scopedSlots: { customRender: 'img' }},
				{title:"appid",dataIndex:"appid"},
				{title:"openid",dataIndex:"openid"},
				{title:"昵称",dataIndex:"nickname"},
				// {title:"性别",dataIndex:"sex",customRender:(text)=>{return text==0?'男':(text==1?'女':'其它')}},
				{title:"时间",dataIndex:"create_time",customRender:(text)=>{return moment(text).format("YYYY-MM-DD hh:mm")}},
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
                let params = {id:record?record.ID_:null}
                self_.$util.component(self_).event('edit', params);
            }
            return method;
        }
    },
}
</script>

<style scoped>

</style>
