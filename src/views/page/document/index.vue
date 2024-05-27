<template>
	<div class="p10">
		<div class="xqPlace" id="htmlDom">
			<h1 class="plTit imageClass">文档导出 </h1>
			<!---->
			<a-tabs class="nav_big1">
				<a-tab-pane tab="预览" key="0">
					<vue-office-docx :src="wordUrl" style="height: 80vh;"/>
				</a-tab-pane>
				<a-tab-pane tab="模版" key="1">
					<vue-office-docx :src="templateUrl" style="height: 80vh;"/>
				</a-tab-pane>
				<template slot="tabBarExtraContent">
					<a-button :loading="loading" type="primary" icon="caret-right" class="mL15" @click="downloadFile('word', 'file.docx')">word导出</a-button>
					<a-button :loading="loading" type="primary" icon="caret-right" class="mL15" @click="downloadFile('pdf', 'file.pdf')">pdf导出</a-button>
				</template>
			</a-tabs>
		</div>
	</div>
</template>

<script>
import VueOfficeDocx from '@vue-office/docx'
import '@vue-office/docx/lib/index.css'
import {BASE_URL, PATH} from "@/plugins/mutation-types";
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
			// 模版路径
			templateUrl: `${PATH}/docx/word.docx`,
			// 模版数据
			templateData:{
				cover:"这是封面标题",
				titleList: [
					{title: `标题1`},
					{title: `标题2`},
					{title: `标题3`},
				]
			},
			// 生成预览文件链接
			wordUrl: null,
			// 文件(blob)
			blob: null,
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
			let dataSource = this.templateData;
			// 页面转画布
			let obj = document.getElementById('htmlDom');
			let waitMethod = [];
			if(obj){
				let canvases = obj.querySelectorAll(".imageClass");
				let imgTemp = 1;
				canvases.forEach((canvas, i) => {
					let style = getComputedStyle(canvas);
					let width = style.getPropertyValue("width");
					let height = style.getPropertyValue("height");
					waitMethod.push({api:html2Canvas(canvas), function:(c)=>{
						Object.assign(dataSource, {
							[`img${imgTemp}`]: c.toDataURL("image/jpeg", 1.0),
							[`img${imgTemp}_size`]: {w:width,h:height},
						})
						imgTemp++;
					}})
				})
			}
			Promise.all(waitMethod.map(m=>{return m.api})).then(res=>{
				waitMethod.forEach((m,i)=>{
					// 处理异步返回数据
					m.function((res[i]))
				})
				let fileName = moment(new Date()).format("YYYY-MM-DD");
				Html2Word.getWordDoc(self_, fileName, dataSource, function (data, h, w) {
					self_.loading = false;
					self_.blob = data
					let fileReader = new FileReader()
					fileReader.readAsArrayBuffer(data)
					fileReader.onload = () => {
						self_.wordUrl = fileReader.result;
					}
				});
			})

		},
		downloadFile(alias = "word", fileName = "word.docx"){
			if(this.loading) return;
			this.loading = true;
			let {blob} = this;
			const formData = new FormData();
			formData.append("file", blob)
			rxAjax.upload(`/file/aspose/uploadFile/${alias}/${fileName}`, formData).then(res=>{
				this.loading = false;
				window.open(`${BASE_URL}/file/aspose/downloadFile/${alias}/${fileName}`);
			})
		},
	}
}
</script>

<style scoped>

</style>
