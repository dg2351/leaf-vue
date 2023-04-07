<template>
    <div>
        <codemirror v-if="!(item.readonly || formConfig.readonly)"
                    :value="sourceData[item.model]" :language="item.language"
                    @editorChange="value=>editorChange(item.model,value)"/>
        <p v-else class="content_wrap">{{sourceData[item.model]}}</p>
    </div>
</template>

<script>
import codemirror from "./codemirror.vue"
export default {
    name: "subCodemirror",
    props:['sourceData','formConfig', 'item'],
    components:{
        codemirror,
    },
    methods:{
        // 富文本事件
        editorChange(key, v){
            if(v != this.sourceData[key])
                this.sourceData[key] = v;
        },
    }
}
</script>

<style scoped>

</style>