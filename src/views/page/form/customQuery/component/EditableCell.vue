<template>
	<div class="editable-cell">
		<div class="editable-cell-input-wrapper">
			<a-input ref="ipt" v-if="type=='input'" style="width: calc(100% - 0px)"
					 v-model="record[itemKey]" :disabled="disabled_"/>
			<a-select ref="slt" v-if="type=='select'" v-model="record[itemKey]" style="width: 100%;"
					  :options="selectList" :disabled="disabled_"
					  option-filter-prop="children"/>
			<a-checkbox ref="slt" v-if="type=='check'" :checked="record[itemKey]==1" style="width: 100%;"
						:disabled="disabled_" @change="checkEvent"/>
		</div>
	</div>
</template>

<script>
export default {
	name: "EditableCell",
	props: {
		record: Object,
		itemKey:String,
		type: String,
		disabled_: {
			type: Boolean,
			default: false
		},
		selectList:{
			type: Array,
			default: ()=>{
				return [];
			}
		},
	},
	data() {
		return {
			editable: false,
		};
	},
	methods:{
		checkEvent(v){
			this.record[this.itemKey] = v.target.checked ? 1 : 0;
		}
	}
}
</script>

<style scoped>

</style>
