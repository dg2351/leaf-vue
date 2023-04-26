<template>
	<a-checkbox-group button-style="solid" :style="item.style"
					  v-model="queryParam[item.key]"
					  :options="item.data"
					  :disabled="item.disabled"/>
</template>

<script>
export default {
	name: "subCheckbox",
	props:['item','queryParam'],
}
</script>