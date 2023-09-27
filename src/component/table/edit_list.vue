<template>
    <div>
		<a-button-group>
			<slot name="buttonBefore"></slot>
			<a-button type="primary" icon="plus" @click="paramsEvent().add()">添加</a-button>
			<a-button type="danger" icon="delete" @click="paramsEvent().removes()">删除</a-button>
			<a-button type="" icon="up" @click="paramsEvent().up()">向上</a-button>
			<a-button type="" icon="down" @click="paramsEvent().down()">向下</a-button>
			<slot name="buttonAfter"></slot>
		</a-button-group>
		<a-table class="table_a mT15" rowKey="id"
				 :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
				 :columns="columns" :data-source="sourceData"
				 :pagination="false" :locale="{emptyText: '暂无数据'}">
			<template v-for="item in columns.filter(p=>p.editCell==true)"
					  :slot="item.dataIndex" slot-scope="text, record">
				<editable-cell :record="record" :type="item.type" :itemKey="item.dataIndex" :select-list="item?.selectList"/>
			</template>
		</a-table>
	</div>
</template>

<script>
import EditableCell from "@/component/table/EditableCell";

export default {
	name: "editList",
	components:{
		EditableCell
	},
	props:{
		data:{
			type:Array,
			default: ()=>{
				return [];
			}
		},
		columns:{
			type:Array,
			default: ()=>{
				return [];
			}
		},
	},
	data(){
		return{
			selectedRowKeys:[],// 选择项
			sourceData:[],
		}
	},
	mounted() {
		this.sourceData = this.data;
	},
	methods:{
		setParam(data){
			this.sourceData = data;
		},
		getParam(){
			return this.sourceData;
		},
		// 参数定义事件
		paramsEvent(){
			let self_ = this;
			let method = {};
			method.add = ()=>{
				let max = 0;
				self_.sourceData.forEach(item=>{if(item.id > max) max = item.id});
				let params = {id:max+1};
				self_.columns.filter(p=>p.dataIndex != 'id').forEach(item=>{params[item.dataIndex] = item.default ?? "";})
				self_.sourceData.push(params)
			}
			method.removes = (pk)=>{
				let keys = pk ? [pk] : (self_.selectedRowKeys ?? []);
				self_.sourceData = self_.sourceData.filter(m=>!keys.includes(m.id));
			}
			// 上移
			method.up = ()=>{
				let keys = self_.selectedRowKeys ?? [];
				let list = JSON.parse(JSON.stringify(self_.sourceData));
				for(let i=0;i<=list.length;i++){
					let temp = list[i];
					if(!temp) continue;
					if(keys.includes(temp.id) && i > 0){
						list[i] = list.splice(i - 1, 1, list[i])[0];
					}
				}
				self_.sourceData = list;
			}
			// 下移
			method.down = ()=>{
				let keys = self_.selectedRowKeys ?? [];
				let list = JSON.parse(JSON.stringify(self_.sourceData));
				for(let i=list.length-1;i>=0;i--){
					let temp = list[i];
					if(!temp) continue;
					if(keys.includes(temp.id) && i != list.length-1){
						list[i] = list.splice(i + 1, 1, list[i])[0];
					}
				}
				self_.sourceData = list;
			}
			return method;
		},
		// 行选择
		onSelectChange(selectedRowKeys){
			this.selectedRowKeys = selectedRowKeys;
		},
	}
}
</script>

<style scoped>

</style>
