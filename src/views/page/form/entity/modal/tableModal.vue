<template>
    <a-modal title="库表选择" dialogClass="modal_a" width="600px"
             :visible="visible" @cancel="closeModal" :footer="null">

        <div class="textCenter">
            <a-button type="primary" class="mR15" @click="submitModal">确定</a-button>
            <a-button class="mR15" @click="closeModal">返回</a-button>
        </div>
    </a-modal>
</template>

<script>
export default {
    name: "tableModal",
    data() {
        return {
            loading: false,
            visible: false,
            params: {},
        }
    },
    methods:{
        openModal(val){
            this.params.dsAlias = val;
            // this.params.tableName = val;
            this.visible = true;
        },
        closeModal(){
            this.visible = false;
        },
        submitModal(){
            this.visible = false;
            this.$emit("callBack", {});
        },
        loadData(pageIndex){

        }
    },
    watch: {
        visible:{
            async handler(){
                if(this.visible){
                    console.log(this.params.dsAlias);
                    // 获取库表
                }else{
                    this.params = {};
                }
            },deep: true
        },
    },
}
</script>

<style scoped>

</style>