<template>
    <div>
        <codemirror v-if="!(item.readonly || formConfig.readonly)"
                    :value="formConfig.form[item.model]" :language="item.language"
                    @editorChange="value=>editorChange(item.model,value)"/>
        <p v-else class="content_wrap">{{formConfig.form[item.model]}}</p>
    </div>
</template>

<script>
import codemirror from "./codemirror.vue"
export default {
    name: "subCodemirror",
    props:['formConfig', 'item'],
    components:{
        codemirror,
    },
    methods:{
        // 富文本事件
        editorChange(key, v){
            if(v != this.formConfig.form[key])
                this.formConfig.form[key] = v;
        },
    }
}
</script>

<style scoped>

</style>