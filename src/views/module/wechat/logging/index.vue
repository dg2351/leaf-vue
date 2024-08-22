<template>
    <div class="p10">
        <div class="boxa">
            日志
            <a-input placeholder="" style="width: 220px" v-model="cron">
                <input-cron slot="addonAfter" :cron-value="cron" placeholder="请输入cron执行表达式"
                            @change="v=>{this.cron=v}"/>
            </a-input>


			<form_model ref="formModel" alias="test" :params="{id:1}" :sourceData="sourceData" :formConfig="formConfig"/>
        </div>
    </div>
</template>

<script>
import InputCron from '@/component/easy-cron/input-cron'
import form_model from "@/component/form/form_model";
export default {
    name: "logging",
    components: {
        InputCron,
		form_model
    },
    data(){
        return{
            cron:"",

			sourceData:{},
			formConfig:{
				visible: false,
				loading: true,
				disabled: false,
				data: [
					{
						span:8, labelCol:5,
						label: "名称",
						tag: "a-input",
						type: "input",
						vModel: "xse",
						maxLength: 20,
						rule: [
							{required: true, message: '该输入项不能为空', trigger: 'change'},
						],
					},
				]
			},
        }
    },
}
</script>

<style scoped>

</style>
