
export function isNotEmptyStr(s) {
	if (typeof s == 'string' && s.length > 0) {
		return true
	}
	return false
}

// base64加密开始 
var keyStr = "ABCDEFGHIJKLMNOP" + "QRSTUVWXYZabcdef" + "ghijklmnopqrstuv" + "wxyz0123456789+/" + "=";

export function encode64(input) {
	if(!isNotEmptyStr(input)){
		return '';
	}
	input = encodeURIComponent(input);
	var output = "";
	var chr1, chr2, chr3 = "";
	var enc1, enc2, enc3, enc4 = "";
	var i = 0;
	do {
		chr1 = input.charCodeAt(i++);
		chr2 = input.charCodeAt(i++);
		chr3 = input.charCodeAt(i++);
		enc1 = chr1 >> 2;
		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		enc4 = chr3 & 63;
		if (isNaN(chr2)) {
			enc3 = enc4 = 64;
		} else if (isNaN(chr3)) {
			enc4 = 64;
		}
		output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
		chr1 = chr2 = chr3 = "";
		enc1 = enc2 = enc3 = enc4 = "";
	}
	while (i < input.length);
	return output;
}

export function scrollToTop(){
	window.scroll({ top: 0, left: 0, behavior: "smooth" });
}

String.prototype.toCamelCase = function(){
	var re=/_(\w)/g;
	let str = this??"";
	str = str.replace(re,function($0,$1){
		return $1.toUpperCase();
	});
	return str.replace('_','')
}

/**
 * 排序
 */
Array.prototype.quickSort = function () {
	const rec = (arr) => {
		console.log(arr)
		if(arr.length === 1 || arr.length === 0) { return arr; }
		const left = [];
		const right = [];
		const temp = arr[0];
		for(let i = 1; i < arr.length; ++i) {
			if(arr[i] < temp) {
				left.push(arr[i]);
			} else {
				right.push(arr[i]);
			}
		}
		return [...rec(left),temp,...rec(right)];
	};
	const res = rec(this);
	res.forEach((n,i) => { this[i] = n; })
}

/**
 * 构建树
 * @param idKey
 * @param pidKey
 * @returns {[]|*[]}
 */
Array.prototype.$buildTree = function (idKey = 'id', pidKey = 'pid'){
	let list = [];
	let pkList = [];
	if(!this) return [];
	this.forEach(map=>{
		let pid = map[pidKey];
		let list = this.filter(p=>p[idKey] == pid);
		if(list.length == 0 && !pkList.includes(pid))
			pkList.push(pid);
	})
	pkList.forEach(pid=>{
		treeFunction(list, this, pid);
	})
	return list;
	function treeFunction(arr, list, parentId){
		list.filter(p=>p[pidKey] == parentId).forEach(item => {
			let child = JSON.parse(JSON.stringify(item));
			let children = [];
			treeFunction(children, list, item[idKey])
			if(children.length > 0)
				child.children = children;
			arr.push(child)
		})
	}
}

Number.prototype.formatUnit = function(unit, fixed=2){
	let v = parseFloat(this ?? 0);
	let key = [
		{unit:'亿'+unit,x:100000000},
		{unit:'万'+unit,x:10000},
		{unit:unit,x:null},
	]
	for (let map of key){
		if(map.x && v>map.x || !map.x)
			return parseFloat((v/(map.x?map.x:1)).toFixed(fixed)) + map.unit;
	}
}

Number.prototype.toFixedNum = function(fixed=2){
	let v = parseFloat(this ?? 0);
	return parseFloat(v.toFixed(fixed))
}

Number.prototype.toPercent = function(fixed=2){
	let percent = parseFloat(((this ?? 0)*100).toFixed(fixed))
	if(isNaN(percent)) percent = 0;
	return (percent>100?100:percent) + '%'
}
