<template>
    <div class="p10">
        <div class="boxa">
            日志
            <a-input placeholder="" style="width: 220px" v-model="cron">
                <input-cron slot="addonAfter" :cron-value="cron" placeholder="请输入cron执行表达式"
                            @change="v=>{this.cron=v}"/>
            </a-input>
        </div>
    </div>
</template>

<script>
import InputCron from '@/component/easy-cron/input-cron'
export default {
    name: "logging",
    components: {
        InputCron,
    },
    data(){
        return{
            cron:"",
        }
    },
}
</script>

<style scoped>

</style>
