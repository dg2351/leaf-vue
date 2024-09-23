import FormMethods from '@/plugins/js-comps/FormMethods.js';
import {CODE} from "@/plugins/mutation-types";

let addrCode = (CODE+'_addr').toLocaleUpperCase();
let address = [];

export const AddressApi = {};

AddressApi.getData= async function() {
	const str = JSON.parse(sessionStorage.getItem(addrCode));
	if(str){
		address = str;
		return str
	}

	let py = await FormMethods.invokeCustomQueryPromise("qyhxWebProvince", {})
	var provinceList = py.data;

	let cy = await FormMethods.invokeCustomQueryPromise("qyhxWebCity", {})
	var cityList = cy.data;

	let ct = await FormMethods.invokeCustomQueryPromise("qyhxWebCounty", {})
	var countryList = ct.data;

	address = AddressApi.buildData(provinceList,cityList,countryList);
	sessionStorage.setItem(addrCode, JSON.stringify(address));
	return address;
}
AddressApi.getDataR= async function(rank=3, isAll=false) {
	let source = await AddressApi.getData()
	let list = JSON.parse(JSON.stringify(source)); // 克隆数据
	function build(source, temp, parent=''){
		let target = [];temp ++;
		if(isAll){
			if(temp==1) target.push({label:'全国', value: parent, type:''})
			if(temp==2) target.push({label:'全省', value: parent, type:'province'})
			if(temp==3) target.push({label:'全市', value: parent, type:'city'})
		}
		source.forEach(item=>{
			if(temp<rank && item.children && item.children.length > 0){
				let children = build(item.children, temp, item.code);
				target.push({label:item.label, value: item.code, type: item.type,children:children});
			} else{
				target.push({label:item.label, value: item.code, type: item.type});
			}
		})
		return target;
	}
	let data = build(list, 0);
	data.filter(p=>['110000','120000','310000','500000'].includes(p.value)).forEach(pr=>{
		pr.children = pr.children.filter(p=>p.label=='市辖区').map(cy=>{
			return Object.assign(cy, {label: pr.label});
		})
	})
	return data
}
AddressApi.buildData= function(pi,cy,ct) {
	var pil = [];
	pi.forEach((element) => {
		var pic = element.code;
		var cyl = [];
		cy.forEach((element) => {
			if(pic !== element.province_code) return;
			var cyc = element.code;
			var ctl = [];
			ct.forEach((element) => {
				if(cyc !== element.city_code) return;
				ctl.push({
					type: 'districts',
					id: element.id,
					value: element.code,
					label: element.name,
					code: element.code,
				})
			});
			cyl.push({
				type: 'city',
				id: element.id,
				value: element.code,
				label: element.name,
				code: element.code,
				children: ctl
			})
		});
		pil.push({
			type: 'province',
			id: element.id,
			value: element.code,
			label: element.name,
			code: element.code,
			children: cyl
		})
	});
	return pil;
}

AddressApi.getDataHasAll= async function (rank=3, source) {
	if(!source) source = await AddressApi.getData()
	// 给树结构数据增加子集全选
	let treeList = [{label:'全国', value: '', type:''}];
	let list = JSON.parse(JSON.stringify(source)); // 克隆数据
	list.forEach(map=>{
		if(rank<=1){
			treeList.push({label:map.label, value: map.code, type: map.type});
		} else{
			let cys = [{label:'全省', value: map.code, type:'province'}];
			map.children.forEach(map=>{
				if(rank<=2){
					cys.push(Object.assign({label:map.label, value: map.code, type: map.type}));
				} else {
					if(map.label === '全省') return;
					let cts = [{label:'全市', value: map.code, type:'city'}];
					map.children.forEach(map=>{
						if(map.label === '全市') return;
						cts.push({label:map.label, value: map.code, type: map.type});
					})
					cys.push({label:map.label, value: map.code, type: map.type, children: cts});
				}
			})
			treeList.push({label:map.label, value: map.code, type: map.type, children: cys});
		}
	})
	return treeList
}
AddressApi.findDataByAll= function (source, value, code='label', resOne=false) {
	let result = {pr:null,cy:null,ct:null};
	let typeCode = {'province':'cy','city':'ct','districts':'none'}
	function check(result){
		return result.pr != null || result.cy != null || result.ct != null;
	}

	function selectList(list, type){
		for(let i=0; i<list.length; i++){
			if(check(result))
				return true;
			if(list[i].children && list[i].children.length > 0){
				let temp = selectList(list[i].children, typeCode[list[i].type]);
				if(temp){
					Object.assign(result, {[type] : list[i]});
					return true;
				}
			}
			if(list[i][code] === value){
				Object.assign(result, {[type] : list[i]})
				return true;
			}
		}
		return false;
	}
	selectList(source?source:address, 'pr');
	if(resOne){
		return result.ct ? result.ct : (result.cy ? result.cy : (result.pr ? result.pr : null));
	} else{
		return result;
	}
}

export default AddressApi;
