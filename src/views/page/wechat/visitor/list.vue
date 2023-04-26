<template>
    <div class="textLeft">
        <div class="pL10 pR10">
            <queryParam ref="queryParam" :queryConfig="queryConfig" @queryBack="queryBack"/>
        </div>
        <a-button @click="event().edit()">新增</a-button>
        <a-tabs v-model="activeTab" class="nav_big1" @change="callback">
            <a-tab-pane v-for="item in tabTypes" :key="item.key" :tab="item.tab" style="text-align: center">
                <a-table class="table_a mB20"
                         :loading="loading"
                         :rowKey="record=>record.ID_"
                         :columns="statusMap[item.key].columns"
                         :data-source="statusMap[item.key].data"
                         :pagination="pagination"
                         :locale="{emptyText: '暂无数据'}">
                    <span slot="xh" slot-scope="text, record, index">
                        <i class="xh">{{index+1}}</i>
                    </span>
                </a-table>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script>
import FuncList from "@/plugins/mixin/FuncList";
import queryParam from "@/component/query/queryParam";

let activeTab = null;
export default {
    name: "list",
    mixins: [FuncList],
    components: {queryParam},
    data() {
        return {
            loading: false,
            activeTab: "",
            tabTypes: [],
            queryParam: {},		// 查询条件
            showColumns: ['xh','QYMC','LXR','LXFS','TJSJ','HFSJ','HFZTSTR','PZ','action'],
            showColumnsTitle:['序号','企业名称','联系人','联系方式','提交时间','回复时间','回复状态','评价状态','操作'],
            widthColumns:{xh:'60px',action:'250px'},
            alignColumns: {xh:'center'},
            slotColumn: ['xh','action'],
            //不同状态的不同点
            statusMap: {
                'i1': {title:'正在关注'},
            },
            sourceData:[],
            // 查询条件
            queryConfig:[
                {label:"用户名称",value:null,key:"qymc",type:"input",placeholder:"请输入您要查找的内容",show:true,
                    style:"width: 400px;"},
            ],
        }
    },
    created() {
        this.initStatusMap();
        this.setColumnsByTab();
        if(activeTab) this.activeTab = activeTab;
    },
    mounted() {
        this.$refs['queryParam'].initQueryParamConfig();
        this.loadData(1);
    },
    methods:{
        paginationLoadData(pageIndex){
            this.loadData(pageIndex);
        },
        //
        callback(e){
            activeTab = this.activeTab;
            this.loadData(1);
        },
        /**
         * 查询
         */
        queryBack(e){
            this.queryParam = e.params;//回填
            this.loadData();
        },
        /**
         * 加载数据
         */
        loadData(pageIndex){
            let api = "fwpt_sqfw_qysqs";
            let params = Object.assign(this.queryParam, {});
        },
        /**
         * 修改
         * @param record
         */
        event(){
            let self_ = this;
            let method = {};
            method.edit = (record)=>{
                let params = {type:activeTab, id:record?record.ID_:null}
                self_.$util.component(self_).event('edit', params);
            }
            return method;
        }
    },
    watch: {
        sourceData:{
            handler(){
                Object.keys(this.statusMap).forEach(key=>{
                    this.$set(this.statusMap[key], 'data', this.sourceData)
                    this.$set(this.statusMap[key], 'count', this.statusMap[key].data.length)
                });
                this.loading = false
            },deep: true
        }
    },
}
</script>

<style scoped>

</style>