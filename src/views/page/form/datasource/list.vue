<template>
    <div class="textLeft">
        <div class="pL10 pR10">
            <queryParam ref="queryParam" :queryConfig="queryConfig" @queryBack="queryBack">
                <a-button class="mL10" @click="event().edit()">新增</a-button>
            </queryParam>
        </div>
        <a-tabs v-model="activeTab" class="nav_big1" @change="callback">
            <a-tab-pane v-for="item in tabTypes" :key="item.key" :tab="item.tab" style="text-align: center">
                <a-table class="table_a mB20" style="min-height: 500px"
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
import FuncList from "@/mixin/FuncList";
import queryParam from "@/views/component/query/queryParam";
import rxAjax from '@/assets/js/ajax.js';

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
            showColumns: ['xh','dbType','name','alias','host','port','action'],
            showColumnsTitle:['序号','数据库类型','数据源名称','别名','地址','端口','操作'],
            widthColumns:{xh:'60px'},
            alignColumns: {xh:'center'},
            slotColumn: ['xh','action'],
            //不同状态的不同点
            statusMap: {
                'i1': {title:'有效数据'},
            },
            sourceData:[],
            // 查询条件
            queryConfig:[
                {label:"数据源名称",value:null,key:"qymc",type:"input",placeholder:"请输入您要查找的内容",show:true,
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
            let api = "/form/datasource/def/list";
            let params = Object.assign(this.queryParam, {});
            rxAjax.postJson(api, params).then(({success,data})=>{
                this.sourceData = data;
            })
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