<template>
	<a-modal title="编辑" dialogClass="modal_a" width="800px"
			 :visible="visible" @cancel="closeModal" :footer="null">
    	<div>
			<span>{{content}}</span>
			<a-input v-model="input"/>
			<span>{{temp}}</span>
		</div>
		<div class="textCenter mB20">
			<a-button class="mR15"  @click="closeModal">返回</a-button>
			<a-button type="primary" class="mR15"  @click="test">测试</a-button>
		</div>
	</a-modal>
</template>

<script>
export default {
	name: "regExpModal",
	data(){
		return{
			visible: false,
			content: "",
			input: "",
			temp: "",
		}
	},
	methods: {
		openModal(record){
			this.content = record.content;
			this.visible = true;
		},
		closeModal(refresh = false){
			this.visible = false;
			if(refresh){
				this.$emit("callback", {refresh})
			}
		},
		test(){
			let {content, input} = this;
			// let str = '/^(?:(?:\+|00)86)?1[3-9]\d{9}$/';
			this.temp = (new RegExp(content)).test(input)
			// var str = '/^(?:(?:+|00)86)?1[3-9]d{9}$/';
			// // str = str.replace(/\/\//g,"\/");
			// var re = eval(str);//转成正
			// console.log(re)
		}
	}
}
</script>

<style scoped>

</style>
