import {saveAs} from 'file-saver'
import exceljs from 'exceljs';

const excelApi = {}

/**
 * 生成工作表
 * @param name 文件名
 * @param datas [{name:'sheet名称', value:[{v:['行内容'],s:{行样式}}], style}]
 */
excelApi.initSheet = function(name, datas){
	// 参考
	/*let template = {
		name: '政策报告',
		value: [
			{
				v:['标题0','标题1','标题2','标题3'],
				s:{height:80,alignment:{vertical:'top',horizontal:'left',wrapText:true}} // 行样式
			},
			{
				v:['0','1','2','3'],
			},
		],
		style: {
			column:{width:[null,60,60,60]}, // 列宽
			merge:[ [1,1,0,1] ], // 合并
			cell:{
				A1:{fill:{type:'pattern',pattern:'solid',fgColor:{argb:'FF9999ff'}}} // 单元格样式
			}
		}
	}*/
	const bookType = '.xlsx';
	const filename = name+bookType;
	// 创建工作表
	const workbook = new exceljs.Workbook();
	// 遍历数据
	datas.forEach((data, tmp)=>{
		let sheetName = data.name?data.name:'sheet'+tmp;
		const sheet = workbook.addWorksheet(sheetName);
		const value = data.value?data.value:[]
		const style = data.style;
		// 生成表格
		value.forEach(item=>{
			let row = sheet.addRow(item.v);
			Object.assign(row, item.s);
		})
		// 设置样式
		if(style){
			// 列样式
			const column = style.column;
			const width = column.width;
			if(width){
				width.forEach((m,i)=>{
					if(m) sheet.getColumn(i+1).width = m;
				})
			}
			// 合并单元格
			const merge = style.merge;
			if(merge){
				merge.forEach((m,i)=>{
					if(m.length === 4) sheet.mergeCells(m[0],m[1],m[2],m[3]);
				})
			}
			// 单元格样式
			const cell = style.cell;
			if(cell){
				Object.keys(cell).forEach(key=>{Object.assign(sheet.getCell(key), cell[key])})
			}
		}
	})
	// 工作表转换 ArrayBuffer
	workbook.xlsx.writeBuffer().then(buffer => {
		saveAs(new Blob([buffer], {
			type: 'application/octet-stream'
		}), filename)
	});
}

export default excelApi