<template>
    <div>
        <codemirror v-if="!(item.readonly || formConfig.readonly)"
                    :value="sourceData[item.vModel]" :language="item.language"
                    @editorChange="value=>editorChange(item.vModel,value)"/>
        <p v-else class="content_wrap">{{sourceData[item.vModel]}}</p>
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
