<template>
	<div>
		<a-form-model :label-col="{span:4}" :wrapper-col="{ span: 8 }">
			<a-form-model-item label="正则表达式">
				<span>{{pattern}}</span>
			</a-form-model-item>
			<a-form-model-item label="待校验字符">
				<a-textarea v-model="input" :auto-size="{minRows: 3,maxRows:6}"/>
			</a-form-model-item>
			<a-form-model-item label="结果">
				<span>{{temp}}</span>
			</a-form-model-item>
		</a-form-model>
		<div class="textCenter mB20">
			<a-button type="primary" class="mR15"  @click="test">测试</a-button>
		</div>
	</div>
</template>

<script>
export default {
	name: "regExpModal",
	props: {
		record:Object,
	},
	data(){
		return{
			pattern: "",
			input: "",
			temp: "",
		}
	},
	mounted() {
		let {pattern} = this.record;
		this.pattern = pattern;
	},
	methods: {
		test(){
			let {pattern, input} = this;
			this.temp = eval(pattern).test(input)
		}
	}
}
</script>

<style scoped>
</style>
