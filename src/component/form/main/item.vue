<script>
import render from '@/component/form/js/render'

export default {
	name: "item",
	components:{render},
	props: [
		'element',
		'sourceData',
	],
	render(h) {
		const layout = layouts[this.element.layout]
		if (layout) {
			return layout.call(this, h, this.element, this.index, this.sourceData)
		}
		return layoutIsNotFound()
	},
}

const layouts = {
	colFormItem(h, element, index, sourceData) {
		return (
			<a-col span={element.span}>
				<a-form-item label-col={{span:element.labelCol??4}} label={element.label} required={element.required}>
					<render key={element.renderKey} conf={element} sourceData={sourceData}/>
				</a-form-item>
			</a-col>
		)
	},
}
</script>

<style scoped>

</style>
