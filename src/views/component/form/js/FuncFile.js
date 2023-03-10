import FormApi from "@/views/modules/form/core/js-comps/api/FormApi";

const FuncFile = {
	methods: {
		/**
		 * 删除单个附件
		 * @param file
		 * @param key
		 * @param config
		 */
		removeFile(file, key, config){
			let max = 1;
			if(config){
				max = config.max?config.max:1;
			}
			let value = [];
			if(max > 1){
				let obj = JSON.parse(this.formConfig.form[key]);
				const index = obj.indexOf(file);
				const newFileList = obj.slice();
				newFileList.splice(index, 1);
				value = newFileList;
			}
			if(value.length == 0){
				this.formConfig.form[key] = ""; // 赋值为空，用于校验input值是否上传了文件
			} else{
				this.formConfig.form[key] = JSON.stringify(value)
			}
		},
		/**
		 * 上传单个附件
		 * @param file
		 * @param key
		 * @param config
		 */
		uploadFile(file, key, config) {
			let that = this;
			let obj = that.formConfig.form[key]?JSON.parse(that.formConfig.form[key]):[];
			// 获取配置
			let max = 1;
			let suffixs = [];
			if(config){
				max = config.max?config.max:1;
				suffixs = config.suffixs ? config.suffixs: [];
			}
			// 校验后缀
			let name = file.name;
			//校验文件名长度
			if (name.length > 100) {
				this.$message.error(`文件名过长，上传失败`)
				return
			}
			let suffix = name.substr(name.lastIndexOf(".")+1).toLowerCase();
			if (suffixs.length > 0 && !suffixs.includes(suffix)) {
				that.$message.warning("只能上传"+suffixs.join(",")+"格式的文件");
				return;
			}

			this.$nextTick(() => {
				const formData = new FormData();
				formData.append("file", file)
				FormApi.upload(formData).then(res=>{
					if(res.success && res.code===200 && res.data.length !== 0) {
						const fid = res.data[0].pkId;
						const file = buildFilePram(fid, name);
						let value;
						if(max > 1){
							value = [...obj, file];
						} else {
							value = [file];
						}
						that.formConfig.form[key] = JSON.stringify(value);
					}
				})
			});
			function buildFilePram(fid, name){
				return {
					uid: fid,
					url: '/api/api-system/system/core/sysFile/previewFile?fileId='+fid,
					name: name,
				}
			}
		},
	}
};

export default FuncFile
