<template>
    <a-modal title="数据源选择" dialogClass="modal_a" width="600px"
             :visible="visible" @cancel="closeModal" :footer="null">
        <a-table class="table_a mB20" :customRow="rowClick"
                 :row-selection="{ selectedRowKeys: selectedRowKeys, type:'radio', onChange: onSelectChange }"
                 :loading="loading"
                 :rowKey="record=>record.id"
                 :columns="statusMap['i1'].columns"
                 :data-source="statusMap['i1'].data"
                 :pagination="pagination"
                 :locale="{emptyText: '暂无数据'}">
            <span slot="xh" slot-scope="text, record, index">
                <i class="xh">{{index+1}}</i>
            </span>
        </a-table>
        <div class="textCenter">
            <a-button type="primary" class="mR15" @click="submitModal">确定</a-button>
            <a-button class="mR15" @click="closeModal">返回</a-button>
        </div>
    </a-modal>
</template>

<script>
import FuncList from "@/mixin/FuncList";
import rxAjax from '@/assets/js/ajax.js';

export default {
    name: "dbModal",
    mixins: [FuncList],
    data() {
        return {
            visible: false,
            params: {},
            loading: false,
            tabTypes: [],
            queryParam: {},		// 查询条件
            showColumns: ['xh','name','alias'],
            showColumnsTitle:['序号','数据源名称','别名'],
            widthColumns:{xh:'60px'},
            alignColumns: {xh:'center'},
            slotColumn: ['xh'],
            //不同状态的不同点
            statusMap: {
                'i1': {title:'有效数据'},
            },
            sourceData:[],
            //
            selectedRowKeys: [],
            rowClick: (record) => ({
                on: {
                    click: () => {
                        this.selectedRowKeys = [record.id];
                    }
                }
            })
        }
    },
    created() {
        this.initStatusMap();
        this.setColumnsByTab();
    },
    methods:{
        paginationLoadData(pageIndex){
            this.loadData(pageIndex);
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
        async loadData(pageIndex){
            let api = "/form/datasource/def/list";
            let params = Object.assign(this.queryParam, {});
            let {success,data} = await rxAjax.postJson(api, params)
            this.sourceData = data;
        },
        onSelectChange(selectedRowKeys) {
            this.selectedRowKeys = selectedRowKeys;
        },
        openModal(val){
            this.params.dsAlias = val;
            this.visible = true;
        },
        closeModal(){
            this.visible = false;
        },
        submitModal(){
            let {selectedRowKeys, sourceData} = this;
            let data = sourceData.filter(p => selectedRowKeys.includes(p.id));
            let params = {};
            if(data.length > 0){
                params['name']=data[0].name;
                params['alias']=data[0].alias;
            }
            this.visible = false;
            this.$emit("callBack", params);
        },
    },
    watch: {
        visible:{
            async handler(){
                if(this.visible){
                    this.selectedRowKeys = [];
                    await this.loadData(1);
                    if(this.params.dsAlias){
                        this.sourceData.filter(p=>p.alias == this.params.dsAlias).forEach(m=>{this.selectedRowKeys.push(m.id)});
                    }
                }else{
                    this.params = {};
                }
            },deep: true
        },
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