<template>
	<div>
		<a-date-picker style="width: 150px!important;"
					   :placeholder="item.placeholder&&item.placeholder.length>0?item.placeholder[0]:'请输入开始时间'"
					   :getCalendarContainer="triggerNode => {return triggerNode.parentNode || document.body;}"
					   v-model="queryParam[item.key+'S']"
					   @change="item.changeFunction"/>
		<span class="p10">-</span>
		<a-date-picker style="width: 150px!important;"
					   :placeholder="item.placeholder&&item.placeholder.length>0?item.placeholder[1]:'请输入结束时间'"
					   :getCalendarContainer="triggerNode => {return triggerNode.parentNode || document.body;}"
					   v-model="queryParam[item.key+'E']"
					   @change="item.changeFunction"/>
	</div>
</template>

<script>
export default {
	name: "subDatetime",
	props:['item','queryParam'],
}
</script>