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
import rxAjax from '@/assets/js/ajax.js';

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
                    // 获取库表
                    let api = "/form/db/findTableList";
                    let params = {dsAlias:this.params.dsAlias}
                    rxAjax.postForm(api, params).then(({success,data})=>{
                        console.log(data)
                        if(success){
                        }else{
                        }
                    })
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