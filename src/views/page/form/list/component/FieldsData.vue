<template>
	<a-modal title="字段渲染" dialogClass="modal_a" width="600px"
			 :visible="visible" @cancel="closeModal" :footer="null">
		<div style="height: 350px;overflow-y: auto">
			<template v-if="current == 'action'">
				<edit_list ref="dataEdit" :columns="dataColumns" :data="sourceData.data"/>
			</template>
		</div>
		<div class="textCenter mB20">
			<a-button type="primary" class="mR15" @click="onSubmit(true)">提交</a-button>
			<a-button class="mR15"  @click="closeModal()">返回</a-button>
		</div>
	</a-modal>
</template>

<script>
import edit_list from "@/component/table/edit_list";

export default {
	name: "ColumnList",
	components: {
		edit_list,
	},
	data() {
		let self_ = this;
		return {
			visible: false,
			sourceData:{data:[]},
			// 页签
			current:"",
			// config
			dataColumns:[
				{title:"名称",dataIndex:"label",align: "center",default:'',
					scopedSlots: { customRender: 'label' },
					editCell:true,type:'input'},
				{title:"别名",dataIndex:"value",align: "center",default:'',
					scopedSlots: { customRender: 'value' },
					editCell:true,type:'input'},
				{title:"函数",dataIndex:"function",align: "center",default:'',
					scopedSlots: { customRender: 'function' },
					editCell:true,type:'input'},
			],
		}
	},
	methods:{
		openModal(params){
			console.log(params)
			this.sourceData = {...params};
			this.current = params.slots;
			this.visible = true;
		},
		closeModal(){
			this.visible = false;
		},
		onSubmit(validate){
			let {sourceData} = this;
			if(['config'].includes(sourceData.datasource)) {
				delete sourceData.url;
				delete sourceData.dataLabel;
				delete sourceData.dataValue;
				sourceData.data = this.$refs['dataEdit'].getParam()
			} else if(['customQuery'].includes(sourceData.datasource)){
				Object.assign(sourceData, {data: []})
			}
			this.closeModal();
			this.$emit("callback", {validate,data:sourceData})
		},
	}
}
</script>

<style scoped>

</style>
