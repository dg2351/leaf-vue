import { trigger } from './config'

let confGlobal
let someSpanIsNot24

export function dialogWrapper(str) {
	return `<el-dialog v-bind="$attrs" v-on="$listeners" @open="onOpen" @close="onClose" title="Dialog Title">
    ${str}
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </div>
  </el-dialog>`
}

export function vueTemplate(str) {
	return `<template>
    <div>
      ${str}
    </div>
  </template>`
}

export function vueScript(str) {
	return `<script>
    ${str}
  </script>`
}

export function cssStyle(cssStr) {
	return `<style>
    ${cssStr}
  </style>`
}

function buildFormTemplate(conf, child, type) {
	let labelPosition = ''
	if (conf.labelPosition !== 'right') {
		labelPosition = `label-position="${conf.labelPosition}"`
	}
	const disabled = conf.disabled ? `:disabled="${conf.disabled}"` : ''
	let str = `<el-form ref="${conf.formRef}" :model="${conf.formModel}" :rules="${conf.formRules}" size="${conf.size}" ${disabled} label-width="${conf.labelWidth}px" ${labelPosition}>
      ${child}
      ${buildFromBtns(conf, type)}
    </el-form>`
	if (someSpanIsNot24) {
		str = `<el-row :gutter="${conf.gutter}">
        ${str}
      </el-row>`
	}
	return str
}

function buildFromBtns(conf, type) {
	let str = ''
	if (conf.formBtns && type === 'file') {
		str = `<el-form-item size="large">
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>`
		if (someSpanIsNot24) {
			str = `<el-col :span="24">
          ${str}
        </el-col>`
		}
	}
	return str
}

// span不为24的用el-col包裹
function colWrapper(element, str) {
	if (someSpanIsNot24 || element.span !== 24) {
		return `<el-col :span="${element.span}">
      ${str}
    </el-col>`
	}
	return str
}

const layouts = {
	colFormItem(element) {
		let labelWidth = ''
		if (element.labelWidth && element.labelWidth !== confGlobal.labelWidth) {
			labelWidth = `label-width="${element.labelWidth}px"`
		}
		const required = !trigger[element.tag] && element.required ? 'required' : ''
		const tagDom = tags[element.tag] ? tags[element.tag](element) : null
		let str = `<a-form-item ${labelWidth} label="${element.label}" prop="${element.vModel}" ${required}>
					${tagDom}
				  </a-form-item>`
		str = colWrapper(element, str)
		return str
	},
	rowFormItem(element) {
		const type = element.type === 'default' ? '' : `type="${element.type}"`
		const justify = element.type === 'default' ? '' : `justify="${element.justify}"`
		const align = element.type === 'default' ? '' : `align="${element.align}"`
		const gutter = element.gutter ? `gutter="${element.gutter}"` : ''
		const children = element.children.map(el => layouts[el.layout](el))
		let str = `<el-row ${type} ${justify} ${align} ${gutter}>
      ${children.join('\n')}
    </el-row>`
		str = colWrapper(element, str)
		return str
	}
}

const tags = {
	'a-button': el => {
		const {
			tag, disabled
		} = attrBuilder(el)
		const type = el.type ? `type="${el.type}"` : ''
		const icon = el.icon ? `icon="${el.icon}"` : ''
		const size = el.size ? `size="${el.size}"` : ''
		let child = buildElButtonChild(el)

		if (child) child = `\n${child}\n` // 换行
		return `<${el.tag} ${type} ${icon} ${size} ${disabled}>${child}</${el.tag}>`
	},
	'a-input': el => {
		const {
			disabled, vModel, allowClear, placeholder, width
		} = attrBuilder(el)
		const maxlength = el.maxlength ? `:maxlength="${el.maxlength}"` : ''
		const showWordLimit = el['show-word-limit'] ? 'show-word-limit' : ''
		const readonly = el.readonly ? 'readonly' : ''
		const prefixIcon = el['prefix'] ? `prefix='${el['prefix']}'` : ''
		const suffixIcon = el['suffix'] ? `suffix='${el['suffix']}'` : ''
		const type = el.type ? `type="${el.type}"` : ''
		const autoSize = el.autoSize && el.autoSize.minRows
			? `:autosize="{minRows: ${el.autoSize.minRows}, maxRows: ${el.autoSize.maxRows}}"`
			: ''
		let child = buildElInputChild(el)

		if (child) child = `\n${child}\n` // 换行
		return `<${el.tag} ${vModel} ${type} ${placeholder} ${maxlength} ${showWordLimit} ${readonly} ${disabled} ${allowClear} ${prefixIcon} ${suffixIcon} ${autoSize} ${width}>${child}</${el.tag}>`
	},
	'a-input-number': el => {
		const { disabled, vModel, placeholder } = attrBuilder(el)
		const controlsPosition = el['controls-position'] ? `controls-position=${el['controls-position']}` : ''
		const min = el.min ? `:min='${el.min}'` : ''
		const max = el.max ? `:max='${el.max}'` : ''
		const step = el.step ? `:step='${el.step}'` : ''
		const precision = el.precision ? `:precision='${el.precision}'` : ''

		return `<${el.tag} ${vModel} ${placeholder} ${step} ${precision} ${controlsPosition} ${min} ${max} ${disabled}></${el.tag}>`
	},
	'a-select': el => {
		const {
			disabled, vModel, allowClear, placeholder, width
		} = attrBuilder(el)
		const showSearch = el.showSearch ? 'showSearch' : ''
		const multiple = el.multiple ? 'multiple' : ''
		let child = buildElSelectChild(el)

		if (child) child = `\n${child}\n` // 换行
		return `<${el.tag} ${vModel} ${placeholder} ${disabled} ${multiple} ${showSearch} ${allowClear} ${width}>${child}</${el.tag}>`
	},
	'a-radio-group': el => {
		const { disabled, vModel } = attrBuilder(el)
		const size = `size="${el.size}"`
		let child = buildElRadioGroupChild(el)

		if (child) child = `\n${child}\n` // 换行
		return `<${el.tag} ${vModel} ${size} ${disabled}>${child}</${el.tag}>`
	},
	'a-checkbox-group': el => {
		const { disabled, vModel } = attrBuilder(el)
		const size = `size="${el.size}"`
		const min = el.min ? `:min="${el.min}"` : ''
		const max = el.max ? `:max="${el.max}"` : ''
		let child = buildElCheckboxGroupChild(el)

		if (child) child = `\n${child}\n` // 换行
		return `<${el.tag} ${vModel} ${min} ${max} ${size} ${disabled}>${child}</${el.tag}>`
	},
	'a-switch': el => {
		const { disabled, vModel } = attrBuilder(el)
		const checkedChildren = el['checkedChildren'] ? `checkedChildren="${el['checkedChildren']}"` : ''
		const unCheckedChildren = el['unCheckedChildren'] ? `unCheckedChildren="${el['unCheckedChildren']}"` : ''

		return `<${el.tag} ${vModel} ${checkedChildren} ${unCheckedChildren} ${disabled}></${el.tag}>`
	},
	'a-cascader': el => {
		const {
			disabled, vModel, allowClear, placeholder, width
		} = attrBuilder(el)
		const options = el.options ? `:options="${el.vModel}Options"` : ''
		const props = el.props ? `:props="${el.vModel}Props"` : ''
		const showAllLevels = el['show-all-levels'] ? '' : ':show-all-levels="false"'
		const showSearch = el.showSearch ? 'showSearch' : ''
		const separator = el.separator === '/' ? '' : `separator="${el.separator}"`

		return `<${el.tag} ${vModel} ${options} ${props} ${width} ${showAllLevels} ${placeholder} ${separator} ${showSearch} ${allowClear} ${disabled}></${el.tag}>`
	},
	'a-slider': el => {
		const { disabled, vModel } = attrBuilder(el)
		const min = el.min ? `:min='${el.min}'` : ''
		const max = el.max ? `:max='${el.max}'` : ''
		const step = el.step ? `:step='${el.step}'` : ''
		const range = el.range ? 'range' : ''

		return `<${el.tag} ${min} ${max} ${step} ${vModel} ${range} ${disabled}></${el.tag}>`
	},
	'a-time-picker': el => {
		const {
			disabled, vModel, allowClear, placeholder, width
		} = attrBuilder(el)
		const startPlaceholder = el['start-placeholder'] ? `start-placeholder="${el['start-placeholder']}"` : ''
		const endPlaceholder = el['end-placeholder'] ? `end-placeholder="${el['end-placeholder']}"` : ''
		const rangeSeparator = el['range-separator'] ? `range-separator="${el['range-separator']}"` : ''
		const isRange = el['is-range'] ? 'is-range' : ''
		const format = el.format ? `format="${el.format}"` : ''
		const valueFormat = el['value-format'] ? `value-format="${el['value-format']}"` : ''
		const pickerOptions = el['picker-options'] ? `:picker-options='${JSON.stringify(el['picker-options'])}'` : ''

		return `<${el.tag} ${vModel} ${isRange} ${format} ${valueFormat} ${pickerOptions} ${width} ${placeholder} ${startPlaceholder} ${endPlaceholder} ${rangeSeparator} ${allowClear} ${disabled}></${el.tag}>`
	},
	'a-date-picker': el => {
		const {
			disabled, vModel, allowClear, placeholder, width
		} = attrBuilder(el)
		const startPlaceholder = el['start-placeholder'] ? `start-placeholder="${el['start-placeholder']}"` : ''
		const endPlaceholder = el['end-placeholder'] ? `end-placeholder="${el['end-placeholder']}"` : ''
		const rangeSeparator = el['range-separator'] ? `range-separator="${el['range-separator']}"` : ''
		const format = el.format ? `format="${el.format}"` : ''
		const valueFormat = el['value-format'] ? `value-format="${el['value-format']}"` : ''
		const type = el.type === 'date' ? '' : `type="${el.type}"`
		const readonly = el.readonly ? 'readonly' : ''

		return `<${el.tag} ${type} ${vModel} ${format} ${valueFormat} ${width} ${placeholder} ${startPlaceholder} ${endPlaceholder} ${rangeSeparator} ${allowClear} ${readonly} ${disabled}></${el.tag}>`
	},
	'a-rate': el => {
		const { disabled, vModel } = attrBuilder(el)
		const max = el.max ? `:max='${el.max}'` : ''
		const allowHalf = el['allow-half'] ? 'allow-half' : ''
		const showText = el['show-text'] ? 'show-text' : ''
		const showScore = el['show-score'] ? 'show-score' : ''

		return `<${el.tag} ${vModel} ${allowHalf} ${showText} ${showScore} ${disabled}></${el.tag}>`
	},
	'a-color-picker': el => {
		const { disabled, vModel } = attrBuilder(el)
		const size = `size="${el.size}"`
		const showAlpha = el['show-alpha'] ? 'show-alpha' : ''
		const colorFormat = el['color-format'] ? `color-format="${el['color-format']}"` : ''

		return `<${el.tag} ${vModel} ${size} ${showAlpha} ${colorFormat} ${disabled}></${el.tag}>`
	},
	'a-upload': el => {
		const disabled = el.disabled ? ':disabled=\'true\'' : ''
		const action = el.action ? `:action="${el.vModel}Action"` : ''
		const multiple = el.multiple ? 'multiple' : ''
		const listType = el['list-type'] !== 'text' ? `list-type="${el['list-type']}"` : ''
		const accept = el.accept ? `accept="${el.accept}"` : ''
		const name = el.name !== 'file' ? `name="${el.name}"` : ''
		const autoUpload = el['auto-upload'] === false ? ':auto-upload="false"' : ''
		const beforeUpload = `:before-upload="${el.vModel}BeforeUpload"`
		const fileList = `:file-list="${el.vModel}fileList"`
		const ref = `ref="${el.vModel}"`
		let child = buildElUploadChild(el)

		if (child) child = `\n${child}\n` // 换行
		return `<${el.tag} ${ref} ${fileList} ${action} ${autoUpload} ${multiple} ${beforeUpload} ${listType} ${accept} ${name} ${disabled}>${child}</${el.tag}>`
	}
}

function attrBuilder(el) {
	return {
		vModel: `v-model="${confGlobal.formModel}.${el.vModel}"`,
		allowClear: el.allowClear ? 'allowClear' : '',
		placeholder: el.placeholder ? `placeholder="${el.placeholder}"` : '',
		width: el.style && el.style.width ? ':style="{width: \'100%\'}"' : '',
		disabled: el.disabled ? ':disabled=\'true\'' : ''
	}
}

// el-buttin 子级
function buildElButtonChild(conf) {
	const children = []
	if (conf.default) {
		children.push(conf.default)
	}
	return children.join('\n')
}

// el-input innerHTML
function buildElInputChild(conf) {
	const children = []
	if (conf.addonBefore) {
		children.push(`<template slot="addonBefore">${conf.addonBefore}</template>`)
	}
	if (conf.addonAfter) {
		children.push(`<template slot="addonAfter">${conf.addonAfter}</template>`)
	}
	return children.join('\n')
}

function buildElSelectChild(conf) {
	const children = []
	if (conf.options && conf.options.length) {
		children.push(`<a-option v-for="(item, index) in ${conf.vModel}Options" :key="index" :label="item.label" :value="item.value" :disabled="item.disabled"></a-option>`)
	}
	return children.join('\n')
}

function buildElRadioGroupChild(conf) {
	const children = []
	if (conf.options && conf.options.length) {
		const tag = conf.optionType === 'button' ? 'a-radio-button' : 'a-radio'
		const border = conf.border ? 'border' : ''
		children.push(`<${tag} v-for="(item, index) in ${conf.vModel}Options" :key="index" :label="item.value" :disabled="item.disabled" ${border}>{{item.label}}</${tag}>`)
	}
	return children.join('\n')
}

function buildElCheckboxGroupChild(conf) {
	const children = []
	if (conf.options && conf.options.length) {
		const tag = conf.optionType === 'button' ? 'a-checkbox-button' : 'a-checkbox'
		const border = conf.border ? 'border' : ''
		children.push(`<${tag} v-for="(item, index) in ${conf.vModel}Options" :key="index" :label="item.value" :disabled="item.disabled" ${border}>{{item.label}}</${tag}>`)
	}
	return children.join('\n')
}

function buildElUploadChild(conf) {
	const list = []
	if (conf['list-type'] === 'picture-card') list.push('<i class="el-icon-plus"></i>')
	else list.push(`<a-button size="small" type="primary" icon="el-icon-upload">${conf.buttonText}</a-button>`)
	if (conf.showTip) list.push(`<div slot="tip" class="el-upload__tip">只能上传不超过 ${conf.fileSize}${conf.sizeUnit} 的${conf.accept}文件</div>`)
	return list.join('\n')
}

export function makeUpHtml(conf, type) {
	const htmlList = []
	confGlobal = conf
	someSpanIsNot24 = conf.fields.some(item => item.span !== 24)
	conf.fields.forEach(el => {
		htmlList.push(layouts[el.layout](el))
	})
	const htmlStr = htmlList.join('\n')

	let temp = buildFormTemplate(conf, htmlStr, type)
	if (type === 'dialog') {
		temp = dialogWrapper(temp)
	}
	confGlobal = null
	return temp
}
