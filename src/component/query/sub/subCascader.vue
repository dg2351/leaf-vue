<template>
	<a-cascader :style="item.style?item.style:'width: 250px;'" :allowClear="true"
				v-model="queryParam[item.key]"
				:placeholder="item.placeholder?item.placeholder:('请选择'+item.label)"
				:options="item.data"
				:change-on-select="item.changeOnSelect"
				:field-names="{ label: 'label', value: 'label', children: 'children' }"
				:getPopupContainer="triggerNode => {return triggerNode.parentNode || document.body;}"/>
</template>

<script>
export default {
	name: "subCascader",
	props:['item','queryParam'],
}
</script>