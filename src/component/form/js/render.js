import FormMethods from "@/plugins/js-comps/FormMethods";

export default {
	props:{
		conf: {
			type: Object,
		},
		// 表单参数
		sourceData: {
			type: Object,
			default:function() {
				return {}
			}
		},
	},
	render(h) {
		const dataObject = {
			attrs: {},
			props: {},
			on: {},
			style: {}
		}
		const confClone = JSON.parse(JSON.stringify(this.conf))
		const children = []

		const childObjs = componentChild[confClone.tag]
		if (childObjs) {
			Object.keys(childObjs).forEach(key => {
				const childFunc = childObjs[key]
				if (confClone[key]) {
					children.push(childFunc(h, confClone, key))
				}
			})
		}
		Object.keys(confClone).forEach(key => {
			const val = confClone[key]
			if (key === 'vModel') {
				vModel(this, dataObject, this.sourceData, confClone.vModel, confClone.defaultValue)
			} else if (key === 'options') {
				if(confClone.dataType == 'customQuery' && confClone.dataUrl){// 自定义查询
					let res = FormMethods.invokeCustomQueryJquery(confClone.dataUrl, {});
					let options = [];
					if(confClone.data.label && confClone.data.value && res && res.length > 0){
						options = res.map(m=>{
							let data = { label: m[confClone.data.label],value: m[confClone.data.value] }
							if(confClone.data.parent){
								Object.assign(data, {parent:m[confClone.data.parent]})
							}
							return data
						})
					}
					// 级联构造树级
					if(confClone.tag == "a-cascader"){
						if(confClone.data.label && confClone.data.value && confClone.data.parent && options.length > 0) {
							options = this.$util.buildTree(options, "parent", "value");
						}
					}
					dataObject.props[key] = options
				} else{
					dataObject.props[key] = val
				}
			} else if (dataObject[key]) {
				dataObject[key] = val
			} else if (!isAttr(key)) {
				dataObject.props[key] = val;
			} else {
				if(['maxLength'].includes(key)){
					dataObject.attrs[key] = val != null && val != '' ? parseInt(val) : null;
				} else{
					dataObject.attrs[key] = val
				}
			}
		})
		if(this.conf.tag == 'a-slider'){
			delete dataObject.props['value'];
		}
		return h(this.conf.tag, dataObject, children)
	}
}

function makeMap(str, expectsLowerCase) {
	const map = Object.create(null)
	const list = str.split(',')
	for (let i = 0; i < list.length; i++) {
		map[list[i]] = true
	}
	return expectsLowerCase ? val => map[val.toLowerCase()] : val => map[val]
}

const isAttr = makeMap(
	'accept,accept-charset,accesskey,action,align,alt,async,autocomplete,'
	+ 'autofocus,autoplay,autosave,bgcolor,border,buffered,challenge,charset,'
	+ 'checked,cite,class,code,codebase,color,cols,colspan,content,http-equiv,'
	+ 'name,contenteditable,contextmenu,controls,coords,data,datetime,default,'
	+ 'defer,dir,dirname,disabled,download,draggable,dropzone,enctype,method,for,'
	+ 'form,formaction,headers,height,hidden,high,href,hreflang,http-equiv,'
	+ 'icon,id,ismap,itemprop,keytype,kind,label,lang,language,list,loop,low,'
	+ 'manifest,max,maxLength,media,method,GET,POST,min,multiple,email,file,'
	+ 'muted,name,novalidate,open,optimum,pattern,ping,placeholder,poster,'
	+ 'preload,radiogroup,readOnly,inputReadOnly,rel,required,reversed,rows,rowspan,sandbox,'
	+ 'scope,scoped,seamless,selected,shape,size,mode,text,password,sizes,span,'
	+ 'spellcheck,src,srcdoc,srclang,srcset,start,step,style,summary,tabindex,'
	+ 'target,title,type,usemap,value,width,wrap,'
	+ 'autoSize'
)

function vModel(self, dataObject, sourceData, vModel) {
	dataObject.props.value = sourceData[vModel];// 赋值
	dataObject.on.input = function(event){
		sourceData[vModel] = event.target.value;
	}
	dataObject.on.change = function(event){
		if(!event.inputType)
			sourceData[vModel] = event;
	}
}

const componentChild = {
	'a-button': {
		default(h, conf, key) {
			return conf[key]
		},
	},
	'a-input': {
		addonBefore(h, conf, key) {
			return `<template slot="addonBefore">{conf[key]}</template>`
		},
		addonAfter(h, conf, key) {
			return `<template slot="addonAfter">{conf[key]}</template>`
		},
		prefix(h, conf, key) {
			return `<a-icon slot="prefix" type={conf[key]}></a-icon>`
		},
		suffix(h, conf, key) {
			return `<a-icon slot="suffix" type={conf[key]}></a-icon>`
		},
	},
	'a-select': {
		options(h, conf, key) {
			const list = []
			conf.options.forEach(item => {
				list.push(`<a-option label={item.label} value={item.value} disabled={item.disabled}></a-option>`)
			})
			return list
		}
	},
	'a-radio-group': {
		options(h, conf, key) {
			const list = []
			conf.options.forEach(item => {
				if (conf.optionType === 'button') list.push(`<a-radio-button label={item.value}>{item.label}</a-radio-button>`)
				else list.push(`<a-radio label={item.value} border={conf.border}>{item.label}</a-radio>`)
			})
			return list
		}
	},
	'a-checkbox-group': {
		options(h, conf, key) {
			const list = []
			conf.options.forEach(item => {
				if (conf.optionType === 'button') {
					list.push(`<a-checkbox-button label={item.value}>{item.label}</a-checkbox-button>`)
				} else {
					list.push(`<a-checkbox label={item.value} border={conf.border}>{item.label}</a-checkbox>`)
				}
			})
			return list
		}
	},
	'a-upload': {
		'list-type': (h, conf, key) => {
			const list = []
			if (conf['list-type'] === 'picture-card') {
				list.push(<i class="a-icon-plus"></i>)
			} else {
				list.push(<a-button size="small" type="primary" icon="cloud-upload">{conf.buttonText}</a-button>)
			}
			if (conf.showTip) {
				list.push(<div class="el-upload_tip">只能上传不超过 {conf.fileSize}{conf.sizeUnit} 的{conf.accept}文件</div>)
			}
			return list
		}
	}
}
