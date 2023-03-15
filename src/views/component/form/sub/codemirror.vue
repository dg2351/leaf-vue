<template>
    <div class="common-editor">
        <textarea ref="textarea"/>
    </div>
</template>

<script>
// npm i codemirror@5.46.0 -save
import 'codemirror/lib/codemirror.css';
// 主题样式
import 'codemirror/theme/monokai.css'
import 'codemirror/theme/idea.css'
import 'codemirror/theme/base16-dark.css';
import 'codemirror/theme/blackboard.css'
// 支持数据类型
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/sql/sql'
import 'codemirror/mode/php/php'
import 'codemirror/mode/python/python'
import 'codemirror/mode/shell/shell'
import 'codemirror/mode/powershell/powershell'
// 搜索功能
import 'codemirror/addon/search/search.js'
import 'codemirror/addon/search/searchcursor.js'
import 'codemirror/addon/search/jump-to-line.js'
import 'codemirror/addon/scroll/annotatescrollbar.js'
import 'codemirror/addon/search/matchesonscrollbar.js'
// 高亮
import 'codemirror/addon/search/match-highlighter.js'

import 'codemirror/addon/dialog/dialog.js'
import 'codemirror/addon/dialog/dialog.css'
// 滚动条
import 'codemirror/addon/scroll/simplescrollbars.css'
import 'codemirror/addon/scroll/simplescrollbars'
// 代码高亮
import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/javascript-hint.js'
import 'codemirror/addon/hint/xml-hint.js'
import 'codemirror/addon/hint/anyword-hint.js'
import 'codemirror/addon/hint/html-hint.js'
import 'codemirror/addon/hint/css-hint.js'
import 'codemirror/addon/hint/sql-hint.js'
import 'codemirror/addon/selection/active-line.js'
// 自动补全括号
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/edit/closebrackets'
// 全屏
import 'codemirror/addon/display/fullscreen.js'
import 'codemirror/addon/display/fullscreen.css'
// 折叠
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/brace-fold'
import 'codemirror/addon/fold/comment-fold'
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
                tabSize: 2,
                lint: true,                     // 开启语法检查
                lineNumbers: true,              // 显示行号
                lineWrapping: false,            // 是否自动换行，是换行(wrap)还是滚动(scroll),默认是滚动
                foldGutter: true,               // 折叠配置
                gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
                indentUnit: 2,                  // 缩进单位为2
                smartIndent: true,              // 自动缩进
                cursorHeight: 1,                // 光标高度
                showCursorWhenSelecting: true,  // 文本选中时显示光标
                scrollbarStyle: 'overlay',      // 滚动条 native,simple,overlay
                styleActiveLine: true,          // 设置光标所在行高亮
                autoCloseBrackets: true,        // 自动闭合符号
                matchBrackets: true,            // 括号匹配 在光标点击紧挨{、]括号左、右侧时，自动突出显示匹配的括号 }、]
                highlightSelectionMatches: {
                    minChars: 2,
                    trim: true,
                    style: "matchhighlight",
                    showToken: false
                },
                hintOptions: { // 自定义提示选项
                    completeSingle: false,      // 当匹配只有一项的时候是否自动补全
                    tables: {
                        users: ['name', 'score', 'birthDate'],
                        countries: ['name', 'population', 'size'],
                        score: ['zooao']
                    }
                },
                extraKeys: {
                    "F11": function (cm) {
                        cm.setOption("fullScreen", !cm.getOption("fullScreen"));
                    },
                    "Esc": function (cm) {
                        if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
                    },
                    // "Ctrl-J": "toMatchingTag",
                    // "Ctrl-Q": "toggleComment",
                    "Ctrl-Q": function(cm){// 快捷键折叠代码
                        cm.foldCode(cm.getCursor());
                    },
                    // 'Ctrl-/': function (cm) {// 快速键注释
                    //     if (cm.somethingSelected()) {
                    //     }
                    // },
                    Tab: (cm) => {// 光标处插入 indentUnit 个空格
                        if (cm.somethingSelected()) {// 存在文本选择
                            cm.indentSelection('add');
                        } else {// 无文本选择
                            cm.replaceSelection(Array(cm.getOption("indentUnit") + 1).join(" "), "end", "+input");
                        }
                    },
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
            this.coder.setSize("100%","200px");
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
    .CodeMirror{
        direction: ltr;
        line-height: 20px;
    }
}
.cm-matchhighlight {
    background: #848484 !important
}
</style>