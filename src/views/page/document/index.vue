<template>
	<div class="p10">
		<div class="xqPlace">
			<h1 class="plTit">文档导出 </h1>
			<form_model :form-config="formConfig" :source-data="data"/>
			<a-row>
				<a-col :span="4">
					<h2 style="font-weight: bold">word导出
						<a-button type="primary" icon="caret-right" class="mL15" @click="outWord">导出</a-button>
						<a id="outWord"/>
					</h2>
				</a-col>
			</a-row>
			<div id="htmlDom">
				<div class="imageClass" style="width: 200px;height: 200px">
					div转画布贴图
				</div>
			</div>
			<!---->
			<a-row>
				<a-col :span="24">
					<h2 style="font-weight: bold">模版：</h2>
					<vue-office-docx :src="url" style="height: 80vh;"/>
				</a-col>
			</a-row>
			<a-row>
				<a-col :span="24" v-if="src">
					<h2 style="font-weight: bold">预览：</h2>
					<vue-office-docx :src="src" style="height: 80vh;"/>
				</a-col>
			</a-row>
		</div>
	</div>
</template>

<script>
import VueOfficeDocx from '@vue-office/docx'
import '@vue-office/docx/lib/index.css'
import {PATH} from "@/plugins/mutation-types";
import Html2Word from "@/views/page/document/utils/public";
import moment from 'moment'
import rxAjax from "@/assets/js/ajax";
import form_model from "@/component/form/form_model";
import html2Canvas from "html2canvas";

export default {
	name: "index",
	components:{
		VueOfficeDocx,
		form_model,
	},
	data(){
		return{
			loading:false,
			url: `${PATH}/docx/word.docx`,
			src: null,
			blob: null,
			sourceData:{
				cover:"这是封面标题",
				titleList: [
					{title: `标题1`},
					{title: `标题2`},
					{title: `标题3`},
				]
			},


			formConfig: {
				visible: false,
				loading: true,
				disabled: false,
				data: [
					{
						label: "文件",
						tag: "a-file",
						type: "file",
						vModel: "name",
						disabled: false,
						max:2,
						rule: [
							{required: false, message: '请上传相关附件', trigger: 'change'},
						],
						file:{
							max:1,
							text:'上传附件',
						}
					},
				]
			},
			data:{name:""},
		}
	},
	mounted() {
		this.buildWord();
	},
	methods:{
		buildWord(){
			let self_ = this;
			if(self_.loading) return;
			self_.loading = true;
			let dataSource = this.sourceData;
			// 页面转画布
			let obj = document.getElementById('htmlDom');
			if(obj){
				let canvases = obj.querySelectorAll(".imageClass");
				let imgTemp = 1;
				canvases.forEach((canvas, i) => {
					let style = getComputedStyle(canvas);
					let width = style.getPropertyValue("width");
					html2Canvas(canvas).then(function (c) {
						let url = c.toDataURL("image/jpeg", 1.0);
						Object.assign(dataSource, {
							["img"+imgTemp]:url
						})
						imgTemp++;
					});
				})
			}

			setTimeout(() => {
				let fileName = moment(new Date()).format("YYYY-MM-DD");
				console.log(dataSource.img1)
				Html2Word.getWordDoc(self_, fileName, dataSource, function (data, h, w) {
					self_.loading = false;
					console.log(data)
					self_.blob = data
					let fileReader = new FileReader()
					fileReader.readAsArrayBuffer(data)
					fileReader.onload = () => {
						self_.src = fileReader.result;
					}
				});
			}, 3000)
		},
		outWord(){
			let {blob} = this;
			// let url = window.URL.createObjectURL(blob);
			// let link = document.getElementById("outWord");
			// link.style.display = "none";
			// link.href = url;
			// link.setAttribute("download", "file.docx");
			// document.body.appendChild(link);
			// link.click();
			// document.body.removeChild(link); //下载完成移除元素
			// window.URL.revokeObjectURL(url); //释放掉blob对象

			const formData = new FormData();
			formData.append("file", blob)
			rxAjax.upload("/file/upload", formData).then(res=>{

			})
		},
	}
}
</script>

<style scoped>

</style>
