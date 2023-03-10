<template>
	<a-input :style="item.style?item.style:'width: 250px;'" :allowClear="true"
			 v-model="queryParam[item.key]"
			 :placeholder="item.placeholder?item.placeholder:('请输入'+item.label)"/>
</template>

<script>
export default {
	name: "subInput",
	props:['item','queryParam'],
}
</script>