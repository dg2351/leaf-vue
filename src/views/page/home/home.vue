<template>
    <div class="p10">
        <div class="boxa">
            首页
			<a-button @click="test">数据处理</a-button>
        </div>
    </div>
</template>

<script>
import {test} from "@/views/method";

export default {
    name: "home",
    created() {
    },
	methods:{
		test(){test()}
	}
}
</script>

<style scoped>

</style>
