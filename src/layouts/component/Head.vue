<template>
    <div style="display: block">
        <div style="width: calc(100% - 300px);">
        </div>
        <div style="width: 300px">
            <slot></slot>
            <span class="mL20">服务平台</span>
        </div>
    </div>
</template>

<script>
export default {
    name: "Head",
    methods:{
    }
}
</script>

<style scoped>

</style>