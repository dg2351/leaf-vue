<template>
    <a-modal title="库表选择" dialogClass="modal_a" width="700px"
             :visible="visible" @cancel="closeModal" :footer="null">
		<div class="pL10 pR10 mB10">
			<a-form layout="inline">
				<a-form-item label="关键字">
					<a-row>
						<a-col :span="18">
							<a-input v-model="params.keyword"/>
						</a-col>
						<a-col :span="6">
							<a-button type="primary" class="mL5" @click="loadData">查询</a-button>
							<a-button type="primary" class="mL5" @click="resetParams">重置</a-button>
						</a-col>
					</a-row>
				</a-form-item>
			</a-form>
		</div>
		<div style="height: 400px;width:100%;overflow:auto;">
			<a-table class="table_a mB20" bordered
					 :customRow="rowClick"
					 :row-selection="{ selectedRowKeys: selectedRowKeys, type:'radio', onChange: onSelectChange }"
					 :rowKey="record=>record.tableName"
					 :columns="columns" :dataSource="sourceData"
					 :pagination="pagination" :locale="{emptyText: '暂无数据'}"/>
		</div>
		<div class="textCenter">
			<a-button type="primary" class="mR15" @click="submitModal">确定</a-button>
			<a-button class="mR15" @click="closeModal">返回</a-button>
		</div>
    </a-modal>
</template>

<script>
import rxAjax from '@/assets/js/ajax.js';

export default {
    name: "tableModal",
    data() {
        return {
            loading: false,
            visible: false,
			params: {
				keyword:'',
				dsAlias:'',
			},
			columns:[
				{dataIndex: 'tableName',key: 'tableName',width: '45%',title:'表名'},
				{dataIndex: 'comment',key: 'comment',width: '45%',title:'注释'},
			],
            sourceData:[],
			pagination: {
				total: 0, // 总数，必须先有
				current:1,
				pageSize:5,
				defaultCurrent: 1, // 默认当前页数
				defaultPageSize: 5, // 默认当前页显示数据的大小
				showSizeChanger: true,
				showQuickJumper: true,
				pageSizeOptions: ["5", "10", "20", "50", "100"],
				showTotal: (total) => {
					let val = self.paginationTotal ? self.paginationTotal : total;
					return `共 ${val} 条`; // 显示总数
				},
				onShowSizeChange: (current, pageSize) => {
					this.pagination.defaultCurrent = this.pagination.current = current;
					this.pagination.defaultPageSize = this.pagination.pageSize = pageSize;
					this.loadData(current); //显示列表的接口名称
				},
				// 改变每页数量时更新显示
				onChange: (current, size) => {
					this.pagination.defaultCurrent = this.pagination.current = current;
					this.pagination.defaultPageSize = this.pagination.pageSize = size;
					this.loadData(current);
				},
			},
			//
			selectedRowKeys: [],
			rowClick: (record) => ({
				on: {
					click: () => {
						this.selectedRowKeys = [record.tableName];
					}
				}
			})
        }
    },
    methods:{
        openModal(val){
        	this.selectedRowKeys = [];
        	this.params.dsAlias = val
            this.visible = true;
        },
        closeModal(){
            this.visible = false;
        },
        submitModal(){
            this.visible = false;
            let value = this.selectedRowKeys?.[0] ?? '';
            this.$emit("callBack", value);
        },
		onSelectChange(selectedRowKeys) {
			this.selectedRowKeys = selectedRowKeys;
		},
		resetParams(){
			this.params.keyword = ''
			this.loadData();
		},
        loadData(pageIndex=1){
            // 获取库表
            let api = "/form/db/findTableList";
            let params = {dsAlias:this.params.dsAlias, keyword:this.params.keyword};
            rxAjax.postForm(api, params).then((data)=>{
                this.sourceData = data.filter(p=>p.tableName.includes(params.keyword) || p.comment.includes(params.keyword))
            })
        }
    },
    watch: {
        visible:{
            async handler(){
                if(this.visible){
					this.pagination.defaultCurrent = this.pagination.current = 1;
					this.pagination.defaultPageSize = this.pagination.pageSize = 5;
                    this.loadData();
                }
            },deep: true
        },
    },
}
</script>

<style scoped>

</style>
