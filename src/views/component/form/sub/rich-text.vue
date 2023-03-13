<template>
	<div>
		<quill-editor ref="quillEditor" style=" margin-bottom: 4px"
					  :content="editorContent" :options="editorOption"
					  @change="editorChange"/>
		<input id="upload" type="file" style="display: none" accept="image/*" @change="handleInputChange">
	</div>
</template>

<script>
//富文本
//npm i vue-quill-editor
//npm i quill-image-super-solution-module
import { quillEditor, Quill } from 'vue-quill-editor'
import { ImageExtend } from 'quill-image-super-solution-module'
// import FormApi from "@/views/modules/form/core/js-comps/api/FormApi";
Quill.register('modules/ImageExtend', ImageExtend)
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'

export default {
	name: 'CourseRichText',
	props: {
		/* 正文内容 */
		text:String,
		/* 编辑器id */
		editorId:String,
		/* 编辑器高度 */
		height:String,
		/* 图片大小 */
		size: {
			type: Number,
			default: 5
		}
	},
	components: { quillEditor },
	data () {
		return {
			editorContent: '',
			uniqueId: '',
			imgPercent: 0,
			imageLoading: false,
			editorOption: {
				placeholder: '请填写简介',
				history: {
					delay: 100,
					maxStack: 100,
					userOnly: false
				},
				modules: {
					ImageExtend: {
						loading: true,
						name: 'file',
					},
					toolbar: {
						container: [
							['bold', 'italic', 'underline', 'strike'],// 加粗 斜体 下划线 删除线
							['blockquote', 'code-block'],// 引用  代码块
							[{ 'header': 1 }, { 'header': 2 }], // 标题 —— 独立平铺
							[{ 'list': 'ordered' }, { 'list': 'bullet' }],// 有序、无序列表
							[{ 'script': 'sub' }, { 'script': 'super' }],// 下标/上标
							[{ 'indent': '-1' }, { 'indent': '+1' }],// 缩进
							[{ 'direction': 'rtl' }],// 文本方向
							[{ 'size': ['small', false, 'large', 'huge'] }],// 字体大小
							[{ 'header': [1, 2, 3, 4, 5, 6, false] }],// 标题 —— 下拉选择
							[{ 'font': [] }],//字体
							[{ 'color': [] }, { 'background': [] }], // 字体颜色、字体背景颜色
							[{ 'align': [] }], // 对齐方式// text direction
							['clean'],// 清除文本格式
							['link', 'image'],// 链接、图片、视频
						],
						handlers: {
							image: function(value) {
								if (value) {
									document.querySelector('#upload').click() // 劫持原来的图片点击按钮事件
								} else {
									this.quill.format('image', false)
								}
							}
						}
					},
				}
			}
		}
	},
	methods: {
		editorChange ({ editor, html, text }) {
			this.$emit('editorChange', {html:html,text:text })
		},
		/**
		 * 上传图片压缩
		 * @param e
		 */
		handleInputChange(e) {
			let that = this;
			const file = e.target.files[0]
			if (!/image\/\w+/.test(file.type)) {
				this.$message.error('图片格式不正确')
				return
			}
			const isLtSize = file.size / 1024 / 1024 < this.size
			if (!isLtSize) {
				this.$message.error(`图片大小不能超过 ${this.size}MB!`)
				return
			}
			const reader = new FileReader()
			const image = new Image()
			image.onload = () => {
				// 将文件流转换为formData对象
				const formData = new FormData()
				formData.append('file', file)
				FormApi.upload(formData).then(res=>{
					if(res.success && res.code===200 && res.data.length !== 0) {
						const fid = res.data[0].pkId;
						const url = '/api/api-system/system/core/sysFile/previewFile?fileId='+fid

						const quill = that.$refs.quillEditor.quill
						// 光标位置
						const length = quill.getSelection().index
						// 插入图片  图片地址
						quill.insertEmbed(length, 'image', url)
						// 调整光标后移一位
						quill.setSelection(length + 1)
					}
				})
			}
			reader.onload = (e) => {
				image.src = e.target.result
			}
			reader.readAsDataURL(file)
		},
		dataURItoBlob(dataURI, type) {
			// atob用于解码使用 base-64 编码的字符串
			var binary = atob(dataURI.split(',')[1])
			var array = []
			for (var i = 0; i < binary.length; i++) {
				array.push(binary.charCodeAt(i))
			}
			return new Blob([new Uint8Array(array)], { type: type })
		},
	},
	watch: {
		//监控富文本内的变化
		text: function (val) {
			this.editorContent = val
		}
	},
}
</script>

<style scoped lang="less">
/deep/ .ql-snow .ql-picker-label::before{
	vertical-align: top;
}
/deep/ .ql-snow .ql-color-picker .ql-picker-label svg, /deep/ .ql-snow .ql-icon-picker .ql-picker-label svg{
	vertical-align: top;
}
p {
  margin: 10px;
}
/deep/ .ql-editor{
	height: 400px;
}
/deep/ div{
	.edit_container,
	.quill-editor {
		height: 300px;
	}

	.ql-snow .ql-picker.ql-size .ql-picker-label::before,
	.ql-snow .ql-picker.ql-size .ql-picker-item::before {
	  content: "14px";
	}

	.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
	.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
	  content: "10px";
	}
	.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
	.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
	  content: "18px";
	}
	.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
	.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
	  content: "32px";
	}

	.ql-snow .ql-picker.ql-header .ql-picker-label::before,
	.ql-snow .ql-picker.ql-header .ql-picker-item::before {
	  content: "文本";
	}
	.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
	.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
	  content: "标题1";
	}
	.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
	.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
	  content: "标题2";
	}
	.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
	.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
	  content: "标题3";
	}
	.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
	.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
	  content: "标题4";
	}
	.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
	.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
	  content: "标题5";
	}
	.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
	.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
	  content: "标题6";
	}

	.ql-snow .ql-picker.ql-font .ql-picker-label::before,
	.ql-snow .ql-picker.ql-font .ql-picker-item::before {
	  content: "标准字体";
	}
	.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
	.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
	  content: "衬线字体";
	}
	.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
	.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
	  content: "等宽字体";
	}
}

</style>
