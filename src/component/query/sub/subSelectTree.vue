<template>
	<a-tree-select :style="item.style?item.style:'width: 250px;'"
				   v-model="queryParam[item.key]"
				   tree-checkable
				   :tree-data="item.data" :maxTagCount="item.maxTagCount??1"
				   search-placeholder="item.placeholder?item.placeholder:('请选择'+item.label)"
				   :getPopupContainer="triggerNode => {return triggerNode.parentNode || document.body;}"
				   @change="v=>item.changeFunction(v, item, queryParam)"/>
</template>

<script>
export default {
	name: "subSelect",
	props:['item','queryParam'],
}
</script>
