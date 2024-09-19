<template>
	<div>
		<a-month-picker style="width: 150px!important;"
						:placeholder="item.placeholder&&item.placeholder.length>0?item.placeholder[0]:'请选择年月'"
						:getCalendarContainer="triggerNode => {return triggerNode.parentNode || document.body;}"
						v-model="queryParam[item.key]"
						@change="item.changeFunction"/>
	</div>
</template>

<script>
export default {
	name: "subMonth",
	props:['item','queryParam'],
}
</script>
