import Vue from "vue";
Vue.prototype.$confirmDialog = async function(obj = null) {
	if (!obj) return
	const idName = 'confirmDialog_new_custom_' + new Date().getTime() + '_' + parseInt(Math.random() * 1000)
	const confirmDialog = (await import('@/component/modal/dialog/confirmDialog.vue')).default
	const ConfirmDialogCom = Vue.component('confirmDialog', confirmDialog)// 创建组件
	// 给当前组件挂载父级页面的参数(即 main.js里面new Vue() 挂载的额外参数)，这样内部的组件可以直接使用this.$router和this.$store，否则需要单独引入
	const componentsArray = ['store', 'router']
	const componentsObject = {
		root: this.$root,
		parent: this
	}
	componentsArray.forEach((item, index) => {
		if (Object.keys(this.$root.$options).indexOf(item) != -1) {
			componentsObject[item] = this[`$${item}`] || null
		} else {
			componentsArray[index] = null
		}
	})
	// 这里主要是给confirmDialog.vue组件挂载'store', 'router','root','parent',这几个参数，并加载到组件上去，parent就是当前页面的实例
	const confirmDialogComNew = new ConfirmDialogCom(componentsObject)// 创建组件实例（可以传递参数 { propsData: props }）

	// 将需要重新挂载的参数传到组件（这里传入components时，为了让confirmDialog.vue组件内部再动态添加组件时需要和上面一样挂载的）
	confirmDialogComNew.componentsArray = [...['root', 'parent'], ...componentsArray].filter(n => n != null)
	const DOM = document.createElement('div')
	DOM.setAttribute('class', 'confirmDialog_new_custom')
	DOM.setAttribute('id', idName)
	document.body.appendChild(DOM)

	const comp = confirmDialogComNew.$mount(DOM.appendChild(document.createElement('template')))// 将虚拟dom节点改变成真实dom,获取组件的dom节点,并实现挂载
	comp.$watch('centerDialogVisible', (value) => { // 监听组件是否不显示，并删除组件、销毁组件
		if (!value) {
			document.body.removeChild(document.getElementById(idName))
			comp.$destroy()
		}
	}, { deep: true })
	return comp.showDialog(obj)
}
