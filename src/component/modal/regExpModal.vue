<template>
	<a-modal title="校验" dialogClass="modal_a" width="800px"
			 :visible="visible" @cancel="closeModal" :footer="null">
		<a-form-model :label-col="{span:4}" :wrapper-col="{ span: 8 }">
			<a-form-model-item label="正则表达式">
				<span>{{content}}</span>
			</a-form-model-item>
			<a-form-model-item label="待校验字符">
				<a-textarea v-model="input" :auto-size="{minRows: 3,maxRows:6}"/>
			</a-form-model-item>
			<a-form-model-item label="结果">
				<span>{{temp}}</span>
			</a-form-model-item>
		</a-form-model>
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
			this.temp = eval(content).test(input)
		}
	}
}
</script>

<style scoped>
</style>
