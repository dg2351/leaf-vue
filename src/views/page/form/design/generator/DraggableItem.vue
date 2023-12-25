<script>
import draggable from 'vuedraggable'
import render from './render'

const components = {
	itemBtns(h, element, index, parent) {
		const { copyItem, deleteItem } = this.$listeners
		return [
			<span class="drawing-item-copy" title="复制" onClick={event => {copyItem(element, parent); event.stopPropagation()}}>
				<a-icon type="copy" />复制
			</span>,
			<span class="drawing-item-delete" title="删除" onClick={event => {deleteItem(index, parent); event.stopPropagation()}}>
				<a-icon type="delete" />删除
			</span>
		]
	}
}
const layouts = {
	colFormItem(h, element, index, parent) {
		const { activeItem } = this.$listeners
		let className = this.activeId === element.formId ? 'drawing-item active-from-item' : 'drawing-item'
		if (this.formConf.unFocusedComponentBorder) className += ' unfocus-bordered'
		/*onInput={ event => {this.$set(element, 'defaultValue', event.data)}}*/
		return (
			<a-col span={element.span} class={className} nativeOnClick={event => { activeItem(element); event.stopPropagation() }}>
				<a-tooltip placement="bottomRight">
					<a-form-item label-col={{span:element.labelWidth??4}} label={element.label} required={element.required}>
						<render key={element.renderKey} conf={element}/>
					</a-form-item>
					<template slot="title">{components.itemBtns.apply(this, arguments)}</template>
				</a-tooltip>
			</a-col>
		)
	},
	rowFormItem(h, element, index, parent) {
		const { activeItem } = this.$listeners
		const className = this.activeId === element.formId ? 'drawing-row-item active-from-item' : 'drawing-row-item'
		let child = renderChildren.apply(this, arguments)
		if (element.type === 'flex') {
			child = <a-row type={element.type} justify={element.justify} align={element.align}>{child}</a-row>
		}
		return (
			<a-col span={element.span}>
				<a-row gutter={element.gutter} class={className} nativeOnClick={event => { activeItem(element); event.stopPropagation() }}>
					<span class="component-name">{element.componentName}</span>
					<draggable list={element.children} animation={340} group="componentsGroup" class="drag-wrapper">
						{child}
					</draggable>
					{components.itemBtns.apply(this, arguments)}
				</a-row>
			</a-col>
		)
	}
}

function renderChildren(h, element, index, parent) {
	if (!Array.isArray(element.children)) return null
	return element.children.map((el, i) => {
		const layout = layouts[el.layout]
		if (layout) {
			return layout.call(this, h, el, i, element.children)
		}
		return layoutIsNotFound()
	})
}

function layoutIsNotFound() {
	throw new Error(`没有与${this.element.layout}匹配的layout`)
}

export default {
	components: {
		render,
		draggable
	},
	props: [
		'element',
		'index',
		'drawingList',
		'activeId',
		'formConf'
	],
	render(h) {
		const layout = layouts[this.element.layout]
		if (layout) {
			return layout.call(this, h, this.element, this.index, this.drawingList)
		}
		return layoutIsNotFound()
	},
}
</script>
