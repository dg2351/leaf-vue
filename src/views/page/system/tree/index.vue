<template>
    <div class="p10">
		<component v-bind:is="currentTabComponent" :params="params"
				   @formBack="formBack"></component>
    </div>
</template>

<script>
import list from "./list"

export default {
    name: "index",
    components:{list},
    data() {
        return {
            currentTabComponent: "list",
            params:{},
        };
    },
    methods:{
        formBack(e){
            this.$util.component(this).back(e);
        }
    }
}
</script>

<style scoped>

</style>
