<template>
	<div>
		<a-input style="width: 150px!important;" :allowClear="true"
				 :placeholder="item.placeholder&&item.placeholder.length>0?item.placeholder[0]:'请输入'"
				 v-model="queryParam[item.key+'S']"
				 :suffix="item.suffix"
				 onkeyup="this.value=this.value.replace(/[^\d]/g,'');"/>
		<span class="p10">-</span>
		<a-input style="width: 150px!important;" :allowClear="true"
				 :placeholder="item.placeholder&&item.placeholder.length>0?item.placeholder[1]:'请输入'"
				 v-model="queryParam[item.key+'E']"
				 :suffix="item.suffix"
				 onkeyup="this.value=this.value.replace(/[^\d]/g,'');"/>
	</div>
</template>

<script>
export default {
	name: "subNumber",
	props:['item','queryParam'],
}
</script>