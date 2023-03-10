<template>
    <div class="p10">
        <div class="boxa">
            <component v-bind:is="currentTabComponent" :params="params"
                       @formBack="formBack"></component>
        </div>
    </div>
</template>

<script>
import list from "./list"
import edit from "./edit"

export default {
    name: "index",
    components:{list,edit},
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