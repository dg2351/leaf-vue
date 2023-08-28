<template>
	<div class="cho_span_box" :class="item.key_more?'more_box':''">
		<span v-if="item.more" class="more" @click="item.key_more = !item.key_more">
			更多 <a-icon :type="item.key_more?'caret-up':'caret-down'"/>
		</span>
		<div class="cho_span">
			<span :class="val.value==queryParam[item.key]&&val.value==''
						||queryParam[item.key].includes(val.value)&&val.value!='' ? 'on' : ''"
				  v-for="(val, index) in item.data"
				  @click="checkKey(item.key, val.value, item.max)">{{ val.label }}</span>
		</div>
	</div>
</template>

<script>
export default {
	name: "subLabel",
	props:['item','queryParam'],
	methods:{
		//// label选择
		checkKey(key, code, max=1){
			if(code==''){
				this.queryParam[key] = "";
			} else{
				let value = this.queryParam[key]?this.queryParam[key].split(","):[];
				if(value.includes(code)){
					value = value.filter(function (ele) {return ele!=code;});
				} else {
					// 超出最大限制
					if(value.length >= max){
						value.shift();
					}
					value.push(code);
				}
				this.queryParam[key] = value.join(',')
			}
		},
	}
}
</script>

<style scoped lang="less">
.cho_span_box{
	padding-right: 70px;
	position: relative;
	height: 32px;
	overflow: hidden;
	.more{
		position: absolute;
		right: 20px;
		color: #5991f7;
		cursor: pointer;
	}
}
.cho_span_box.more_box{
	height: auto;
}
.cho_span{
	>span{
		display: inline-block;
		margin-right: 10px;
		line-height: 20px;
		padding: 0px 10px;
		cursor: pointer;
	}
	span.on{
		background: #5991f7;
		color: #fff;
	}
}
</style>
