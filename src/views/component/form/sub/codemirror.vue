<template>
    <div class="common-editor">
        <textarea ref="textarea"/>
    </div>
</template>

<script>
// npm i codemirror@5.46.0 -save
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/base16-dark.css';
import 'codemirror/theme/blackboard.css'
import 'codemirror/addon/scroll/simplescrollbars.css'
import 'codemirror/addon/scroll/simplescrollbars'
import 'codemirror/addon/selection/active-line'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/javascript-hint'
import 'codemirror/addon/hint/sql-hint'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/sql/sql'
import 'codemirror/mode/php/php'
import 'codemirror/mode/python/python'
import 'codemirror/mode/shell/shell'
import 'codemirror/mode/powershell/powershell'
const CodeMirror = require( 'codemirror/lib/codemirror')

export default {
    name: "subCodemirror",
    props:{
        'value':{
            type:String,
            default:"",
        },
        'language':{
            type:String,
            default:null,
        }
    },
    computed:{
        coderOptions(){
            return {
                line: true,
                mode: 'application/json',       // json数据高亮
                theme: 'blackboard',            // 设置主题
                tabSize: 1,
                lineNumbers: true,              // 显示行号
                lineWrapping: false,            // 是否自动换行，是换行(wrap)还是滚动(scroll),默认是滚动
                cursorHeight: 1,                // 光标高度
                autoCloseBrackets: true,
                matchBrackets: true,            // 括号匹配
                showCursorWhenSelecting: true,  // 文本选中时显示光标
                smartIndent: true,              // 智能缩进
                scrollbarStyle: 'overlay',      // 滚动条 native,simple,overlay
                styleActiveLine: true,
                hintOptions: { // 自定义提示选项
                    completeSingle: false,      // 当匹配只有一项的时候是否自动补全
                    tables: {
                        users: ['name', 'score', 'birthDate'],
                        countries: ['name', 'population', 'size'],
                        score: ['zooao']
                    }
                }
            }
        }
    },
    data(){
        return {
            code: '',
            coder: null,
            mode: 'java',
            theme: 'default',
            modes:[
                { value: 'javascript', label: 'Javascript' },
                { value: 'x-java', label: 'Java'},
                { value: 'x-python', label: 'Python'},
                { value: 'x-sql', label: 'SQL' },
                { value: 'x-shell', label: 'Shell' },
                { value: 'x-powershell', label: 'PowerShell'},
                { value: 'x-php', label: 'PHP' },
            ]
        }
    },
    watch: {
        //监控富文本内的变化
        value: function (val) {
            console.log(val)
        },
        language: {
            handler(language) {
                this.getCoder().then(() => {
                    // 尝试从父容器获取语法类型
                    if (language) {
                        // 获取具体的语法类型对象
                        const modeObj = this.getLanguage(language)
                        // 判断父容器传入的语法是否被支持
                        if (modeObj) {
                            this.mode = modeObj.label
                            this.coder.setOption('mode',`text/${modeObj.value}`);
                        }
                    }
                });
            },
            immediate: true,
        }
    },
    mounted() {
        this.initialize();
    },
    methods:{
        initialize(){
            this.coder = CodeMirror.fromTextArea(this.$refs.textarea, this.coderOptions)
            this.coder.on('inputRead', ()=>{
                this.coder.showHint();
            })
            // 编辑器赋值
            if (this.value || this.code) {
                this.setCodeContent(this.value || this.code)
            }else{
                this.coder.setValue('');
            }
            // 支持双向绑定
            this.coder.on('change', (coder) => {
                this.code = coder.getValue();
                if (this.$emit) {
                    this.$emit('editorChange', this.code)
                }
            });
        },
        setCodeContent(val){
            setTimeout(()=>{
                if(!val){
                    this.coder.setValue("");
                }else{
                    this.coder.setValue(val);
                }
            })
        },
        getCoder(){
            const self_ = this;
            return new Promise((resolve) => {
                ;(function get() {
                    if (self_.coder) {
                        resolve(self_.coder)
                    }else {
                        setTimeout(get,1)
                    }
                })()
            })
        },
        getLanguage(language){
            // 在支持的语法类型列表中寻找传入的语法类型
            return this.modes.find( (mode) => {
                const currentLanguage = language.toLowerCase()
                const currentLabel = mode.label.toLowerCase()
                const currentValue = mode.value.toLowerCase()
                return(
                    currentLabel === currentLanguage || currentValue === currentLanguage
                )
            });
        },
        // 富文本事件
        changeMode(val){// 修改编辑器的语法配置
            this.coder.setOption('mode',`text/${val}`); // 获取修改后的语法
            const label = this.getLanguage(val).label.toLowerCase()// 允许父容器通过以下函数监听当前的语法值
            this.$emit('language-change', label)
        },
    }
}
</script>

<style lang="less">
.common-editor{
    width: 100%;
    height: 200px;
    .CodeMirror{
        direction: ltr;
        line-height: 20px;
        width: 100%;
        height: 100%;
    }
}
</style>