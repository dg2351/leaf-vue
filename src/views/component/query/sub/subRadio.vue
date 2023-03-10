<template>
	<a-radio-group button-style="solid"
				   v-model="queryParam[item.key]"
				   :options="item.data"
				   :disabled="item.disabled"/>
</template>

<script>
export default {
	name: "subRadio",
	props:['item','queryParam'],
}
</script>