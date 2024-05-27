import docxtemplater from 'docxtemplater'
import JSZipUtils from 'jszip-utils'
import JSZip from 'jszip'
import {PATH} from "@/plugins/mutation-types";
import { saveAs } from 'file-saver'

const Html2Word = {};

/**
 * 获取模版word
 * @param self_
 * @param title
 * @param dataSource
 * @param callback
 */
Html2Word.getWordDoc = (self_, title, dataSource, callback)=>{
	var ImageModule = require('docxtemplater-image-module-free');
	// 读取并获得模板文件的二进制内容
	JSZipUtils.getBinaryContent(`${PATH}/docx/word.docx`, function(error, content) {
		if (error) throw error // 抛出异常
		let zip = new JSZip(content) // 创建一个JSZip实例，内容为模板的内容
		// 创建并加载docxtemplater实例对象
		let doc = new docxtemplater().loadZip(zip).setOptions({ nullGetter: function() {return ''}})// 设置角度解析器

		// 图片处理
		const opts = {};
		opts.centered = true; // 图片居中，在word模板中定义方式为{%%image}
		opts.fileType = "docx";
		opts.getImage = (chartId) => {
			return base64DataURLToArrayBuffer(chartId);
		};
		opts.getSize = (img, tagValue, tagName) => {
			let imgSize = dataSource[`${tagName}_size`];
			let w = parseFloat((imgSize?.w??'200').replace('px', ''))
			let h = parseFloat((imgSize?.h??'200').replace('px', ''))
			return [w, h];
		};
		const imageModule = new ImageModule(opts);
		doc.attachModule(imageModule);
		// 设置模板变量的值
		doc.setData(dataSource)
		try {
			doc.render() // 用模板变量的值替换所有模板变量
		} catch (error) {
			let e = {
				message: error.message,
				name: error.name,
				stack: error.stack,
				properties: error.properties
			}
			console.log(JSON.stringify({ error: e }))
			throw error // 抛出异常
		}
		// 生成一个代表docxtemplater对象的zip文件（不是一个真实的文件，而是在内存中的表示）
		let out = doc.getZip().generate({
			type: 'blob',
			mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
		})
		// 将目标文件对象保存为目标类型的文件，并命名
		// saveAs(out, title)
		// 回调
		if(callback){
			callback(out);
		}
	})
}

export default Html2Word

function base64DataURLToArrayBuffer(dataURL) {
	const base64Regex = /^data:image\/(png|jpg|jpeg|svg|svg\+xml);base64,/;
	if (!base64Regex.test(dataURL)) {
		return false;
	}
	const stringBase64 = dataURL.replace(base64Regex, "");
	let binaryString;
	if (typeof window !== "undefined") {
		binaryString = window.atob(stringBase64);
	} else {
		binaryString = Buffer.from(stringBase64, "base64").toString("binary");
	}
	const len = binaryString.length;
	const bytes = new Uint8Array(len);
	for (let i = 0; i < len; i++) {
		const ascii = binaryString.charCodeAt(i);
		bytes[i] = ascii;
	}
	return bytes.buffer;
}
