<template>
	<div>
		<a-dialog
			v-bind="$attrs"
			width="500px"
			:close-on-click-modal="false"
			:modal-append-to-body="false"
			v-on="$listeners"
			@open="onOpen"
			@close="onClose"
		>
			<el-row :gutter="15">
				<el-form
					ref="elForm"
					:model="formData"
					:rules="rules"
					size="medium"
					label-width="100px"
				>
					<a-col :span="24">
						<a-form-item label="生成类型" prop="type">
							<a-radio-group v-model="formData.type">
								<a-radio-button v-for="(item, index) in typeOptions" :key="index"
												:label="item.value" :disabled="item.disabled">
									{{ item.label }}
								</a-radio-button>
							</a-radio-group>
						</a-form-item>
						<a-form-item v-if="showFileName" label="文件名" prop="fileName">
							<a-input v-model="formData.fileName" placeholder="请输入文件名" clearable />
						</a-form-item>
					</a-col>
				</el-form>
			</el-row>

			<div slot="footer">
				<a-button @click="close">取消</a-button>
				<a-button type="primary" @click="handleConfirm">确定</a-button>
			</div>
		</a-dialog>
	</div>
</template>
<script>
export default {
	inheritAttrs: false,
	props: ['showFileName'],
	data() {
		return {
			formData: {
				fileName: undefined,
				type: 'file'
			},
			rules: {
				fileName: [{
					required: true,
					message: '请输入文件名',
					trigger: 'blur'
				}],
				type: [{
					required: true,
					message: '生成类型不能为空',
					trigger: 'change'
				}]
			},
			typeOptions: [{
				label: '页面',
				value: 'file'
			}, {
				label: '弹窗',
				value: 'dialog'
			}]
		}
	},
	computed: {
	},
	watch: {},
	mounted() {},
	methods: {
		onOpen() {
			if (this.showFileName) {
				this.formData.fileName = `${+new Date()}.vue`
			}
		},
		onClose() {
		},
		close(e) {
			this.$emit('update:visible', false)
		},
		handleConfirm() {
			this.$refs.elForm.validate(valid => {
				if (!valid) return
				this.$emit('confirm', { ...this.formData })
				this.close()
			})
		}
	}
}
</script>
