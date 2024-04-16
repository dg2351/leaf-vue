<template>
    <a-modal title="实体选择" dialogClass="modal_a" width="600px"
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
import FuncList from "@/component/table/js/FuncList";
import rxAjax from '@/assets/js/ajax.js';

export default {
    name: "boModal",
	props:['pkId'],
    mixins: [FuncList],
    data() {
        return {
            visible: false,
            params: {},
            loading: false,
            tabTypes: [],
            queryParam: {},		// 查询条件
            showColumns: ['xh','name','alias'],
            showColumnsTitle:['序号','实体名称','别名'],
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
	async mounted() {
    	if(this.pkId){
			await this.loadData(1);
			let data = this.sourceData.filter(p=>p.id == this.pkId);
			this.$emit("init", data?.[0] ?? {});
		}
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
            let api = "/form/bo/entity/list";
            let params = Object.assign(this.queryParam, {});
            let {success,data} = await rxAjax.postJson(api, params)
            this.sourceData = data;
        },
        onSelectChange(selectedRowKeys) {
            this.selectedRowKeys = selectedRowKeys;
        },
        openModal(val){
            this.params.pkId = val;
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
                params['id']=data[0].id;
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
                    if(this.params.pkId){
                        this.sourceData.filter(p=>p.id == this.params.pkId).forEach(m=>{this.selectedRowKeys.push(m.id)});
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
