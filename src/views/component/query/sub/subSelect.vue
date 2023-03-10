<template>
	<a-select :style="item.style?item.style:'width: 250px;'"
			  v-model="queryParam[item.key]"
			  :placeholder="item.placeholder?item.placeholder:('请选择'+item.label)"
			  :options="item.data"
			  :disabled="item.disabled"
			  :getPopupContainer="triggerNode => {return triggerNode.parentNode || document.body;}"
			  @change="item.changeFunction"/>
</template>

<script>
export default {
	name: "subSelect",
	props:['item','queryParam'],
}
</script>