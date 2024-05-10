<template>
	<div :class="[className]">
		<a-modal class="tishiDialog" :title="title" :width="width"
				 :visible="centerDialogVisible"
				 :show-close="showClose"
				 @cancel="centerDialogVisible=false"
				 :modal-append-to-body="false"
				 :close-on-click-modal="closeOnClickModal"
				 :close-on-press-escape="closeOnPressEscape"
				 center>
			<template v-if="componentName">
				<template v-if="propsData">
					<div ref="componentCustom" />
				</template>
				<template v-else>
					<component :is="componentName" ref="componentCustom" @close="close($event)"/>
				</template>
			</template>
			<template v-else>
				<div :style="contentStyle" :class="[checkHtml(content)?'':'dialogContent']" v-html="content" />

			</template>
			<span slot="footer" class="dialog-footer">
				<a-button v-if="cancelText!=''" class="close_btn" @click="closeFn(1)">{{ cancelText }}</a-button>
				<a-button v-if="confirmText!=''" class="saves_btn" type="primary" @click="closeFn(2)">{{ confirmText }}</a-button>
			</span>
		</a-modal>
	</div>
</template>
<script>
import Vue from 'vue'

export default {
	data() {
		return {
			dialogFn: null, // 回调方法
			content: '', // 内容，可以是html
			title: '', // 标题
			width: '500px', // 宽度
			centerDialogVisible: false,
			cancelText: '', // 取消按钮文字，不传不显示取消按钮
			confirmText: '', // 确定按钮文字，不传不显示确定按钮
			contentStyle: { 'text-align': 'center' }, // 内容的基础样式
			showClose: false, // 是否显示关闭按钮
			btnClickType: 0,//点击按钮的判断，1：取消，2：确定，0：其他
			closeOnClickModal: false, // 是否可以通过点击 modal 关闭 Dialog
			closeOnPressEscape: false, // 是否可以通过按下 ESC 关闭 Dialog
			twiceTitle: '', // 确定关闭时的二次确定文字，不传不会二次提示
			className: '',//弹窗的close,
			componentName: null,
			propsData: null,//组件的参数
			componentCustomDom: null
		}
	},
	watch: {
		centerDialogVisible(value) {
			if (!value) {
				if (this.componentCustomDom) {
					this.componentCustomDom.$destroy()
				}
				if (this.btnClickType == 0) {
					this.dialogFn({ close: true })
				}
			}
		}
	},
	methods: {
		// 判断是否存在html
		checkHtml(htmlStr){
			var reg = /<[^>]+>/g
			return reg.test(htmlStr)
		},
		// 关闭按钮的操作，主要是二次确定需要的
		hideFn(cancel, type) {
			if (cancel) {
				this.closed = true
				this.centerDialogVisible = false
				this.btnClickType = type
				if (type == 1) {
					this.dialogFn({ cancel: true })
				} else if (type == 2) {
					this.dialogFn({ confirm: true })
				} else {
					console.log('close')
				}
			}
		},
		// 关闭弹窗
		closeFn(type) {
			if (this.twiceTitle != '' && type == 2) {
				this.$confirm(this.twiceTitle)
					.then(_ => {
						this.hideFn(true, type)
					})
					.catch(_ => {})
			} else {
				this.centerDialogVisible = false
				this.btnClickType = type
				if (type == 1) {
					this.dialogFn({ cancel: true })
				} else {
					this.dialogFn({ confirm: true })
				}
			}
		},
		close(type = 'confirm') {
			if (type == 'confirm') {
				this.closeFn(2)
			} else {
				this.closeFn(1)
			}
		},
		showDialog(obj) {
			Object.assign(this.$data, this.$options.data.call(this))
			if (obj.class) this.className = obj.class
			if (obj.title) this.title = obj.title
			if (obj.content) this.content = this.formatHtml(obj.content)
			if (obj.width) this.width = obj.width
			if (obj.cancelText) this.cancelText = obj.cancelText
			if (obj.confirmText) this.confirmText = obj.confirmText
			if (obj.style) this.contentStyle = obj.style
			if (obj.showClose) this.showClose = obj.showClose
			if (obj.twiceTitle) this.twiceTitle = obj.twiceTitle
			if (obj.closeOnClickModal) this.closeOnClickModal = obj.closeOnClickModal
			if (obj.closeOnPressEscape) this.closeOnPressEscape = obj.closeOnPressEscape
			if (obj.propsData) this.propsData = obj.propsData
			if (this.cancelText == '' && this.confirmText == '' && !obj.components) this.showClose = true
			this.centerDialogVisible = true
			this.dialogFn = obj.success || (() => {})
			// 挂载组件
			if (obj.components) {
				if (obj.propsData) {
					const ConfirmDialogCom = Vue.component('ConfirmSolt', obj.components)// 创建组件

					const componentsObject = {}
					// 这样内部的组件可以直接使用this.$router、this.$store、this.$parent及this.$root，否则需要单独引入（获取传入的componentsArray，然后再次挂载到ConfirmSolt组件上）
					// ConfirmSolt组件的parent就是当前组件的this,其他的就直接区当前组件实例上的
					this.componentsArray.forEach(item => {
						componentsObject[item] = item == 'parent' ? this : this[`$${item}`]
					})

					// propsData 是组件传参
					const confirmDialogComNew = new ConfirmDialogCom(Object.assign(componentsObject, { propsData: obj.propsData ? obj.propsData : {}}))// 创建组件实例（可以传递参数 { propsData: props }）
					confirmDialogComNew.$on('close', res => {
						this.close(res)
					})
					this.componentName = 'ConfirmSolt'
					this.$nextTick(() => {
						const comp = confirmDialogComNew.$mount(this.$refs.componentCustom)
						this.componentCustomDom = comp
					})
				} else {
					Vue.component('ConfirmSolt', obj.components)
					this.componentName = 'ConfirmSolt'
					this.$nextTick(() => {
						this.componentCustomDom = this.$refs.componentCustom
					})
				}
			}
		},
		// 实现可以显示html标签
		// this.content='`<div>测试显示div</div>`正常的文字'
		formatHtml(val) {
			const sing = '`'
			const regxd = RegExp(`${sing}<[^${sing}]+>${sing}`, 'g')
			val = val.replace(regxd, function(word) {
				if (/<[^<]+>/g.test(val)) { // 判断是否存在html标签
					const getHtml = (word) => {
						let wordString = word.replace(/^(\s|`)+|(\s|`)+$/g, '')// 清除前后`符号
						const htmlArray = []
						wordString.replace(/<\/[^<]+>/g, function(word1) { // 获取每个标签类型的结束标签，即存在/的标签，比如：</div>
							htmlArray.push(word1.replace(/^(\s|<\/)+|(\s|>)+$/g, ''))// 获取html里面存在的标签，并清除前<,后>
						})
						// 获取html标签以及中间的值
						const htmlText = []
						htmlArray.forEach(item => {
							const regX = RegExp(`<${item}[^<]+<\/${item}>`, 'g')
							console.log(regX)
							wordString.replace(regX, function(word2) {
								htmlText.push(word2)
							})
						})
						console.log(htmlText)
						htmlText.forEach(item => {
							var ele = document.createElement('span')
							ele.appendChild(document.createTextNode(item))
							wordString = wordString.replace(RegExp(item, 'g'), `<span class='codeHtml' style='display: inline-block;padding: 4px 2px;background-color: #fff5f5;color: #ff502c;border-radius: 2px;'>${ele.innerHTML}</span>`)
						})
						return wordString
					}
					return getHtml(word)
				} else {
					return word
				}
			})
			return val
		}
	}
}
</script>
<style lang="less" scoped>
.dialogContent{
	line-height: 2;
}
::v-deep .el-dialog{
	margin-top:0 !important ;
	top: 50%;
	transform: translateY(-50%);
	.el-dialog__header {
		width: 100%;
		height: 50px;
		line-height: 50px;
		position: relative;
		background-color: #d90e19;
		padding: 0;
		.el-dialog__headerbtn{
			top: 50%;
			margin-top: -10px;
		}
		.el-dialog__title {
			color: #fff;
			font-size: 16px;
			font-family: "PingFang";
			font-weight: 500;
		}
		.el-dialog__close {
			color: #fff;
		}
	}
	.el-dialog__body {
		padding-bottom: 10px;
	}
	.el-button{
		margin-left: 0 !important;
		margin-top: 10px;
	}
	.dialog-footer{
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}
	.close_btn {
		width: 170px;
		color: #d90e19;
		border: 1px solid #d90e19;
		background-color: #fff;
		&:hover{
			background-color: rgba(217, 14, 25,0.1);
			border-color:rgba(217, 14, 25,0.1) ;
			color: #d90e19;
		}
	}
	.saves_btn {
		width: 170px;
		color: #fff;
		background-color: #d90e19;
		border-color:#d90e19 ;
		margin-left: 20px;
		&:hover{
			background-color: #c0121b;
		}
	}
}
</style>
