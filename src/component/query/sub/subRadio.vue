<template>
	<a-radio-group button-style="solid"
				   :style="item.style?item.style:''"
				   v-model="queryParam[item.key]"
				   :options="item.data"
				   :disabled="item.disabled"
				   @change="v=>item.changeFunction(v, item, queryParam)"/>
</template>

<script>
export default {
	name: "subRadio",
	props:['item','queryParam'],
}
</script>
