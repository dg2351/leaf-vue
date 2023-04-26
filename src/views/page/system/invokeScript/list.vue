<template>
    <div class="textLeft">
        <div class="pL10 pR10">
            <queryParam ref="queryParam" :queryConfig="queryConfig" @queryBack="queryBack">
                <a-button class="mL10" @click="event().edit()">新增</a-button>
            </queryParam>
        </div>
        <a-tabs v-model="activeTab" class="nav_big1" @change="callback">
            <a-tab-pane v-for="item in tabTypes" :key="item.key" :tab="item.tab" style="text-align: center">
                <a-table class="table_a mB20" rowKey="id"
                         :loading="loading"
                         :columns="statusMap[item.key].columns"
                         :data-source="statusMap[item.key].data"
                         :pagination="pagination"
                         :locale="{emptyText: '暂无数据'}">
                    <span slot="xh" slot-scope="text, record, index">
                        <i class="xh">{{index+1}}</i>
                    </span>
                    <template slot="action" slot-scope="text, record, index">
                        <a class="link_a_line" @click="event().edit(record)">编辑</a>
                        <a class="link_a_line" @click="event().del(record)">删除</a>
                    </template>
                </a-table>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script>
import FuncList from "@/plugins/mixin/FuncList";
import queryParam from "@/component/query/queryParam";
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
            showColumns: ['xh','name','alias','action'],
            showColumnsTitle:['序号','数据源名称','别名','操作'],
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
                {label:"脚本名称",value:null,key:"name",type:"input",placeholder:"请输入您要查找的内容",show:true,style:"width: 400px;"},
                {label:"脚本别名",value:null,key:"alias",type:"input",placeholder:"请输入您要查找的内容",show:true,style:"width: 400px;"},
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
            let api = "/system/invokeScript/list";
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
                let params = {type:activeTab, id:record?record.id:null}
                self_.$util.component(self_).event('edit', params);
            }
            method.del = (record)=>{
                self_.$util.modal(self_).confirm(null, '彻底删除后，数据不可恢复！请谨慎操作', function () {
                    let api = "/system/invokeScript/delete";
                    let params = {type:activeTab, id:record.id}
                    rxAjax.postForm(api, params).then(({success,data})=>{
                        if(success){
                            self_.$message.success('成功删除记录');
                            self_.loadData(1);
                        }else{
                            self_.$message.error('删除失败');
                        }
                    })
                })
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