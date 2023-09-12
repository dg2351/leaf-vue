<template>
    <div class="p10">
        <div class="boxa">
			<!---->
			<div class="inner_head mB10">
				<h1>文本识别</h1>
			</div>
			<div class="p10">
				<a-textarea v-model="result" :auto-size="{ minRows: 4,maxRows: 4 }" readOnly/>
			</div>
			<a-form-model class="from_model" :label-col="{ span: 2 }" :wrapper-col="{ span: 12 }">
				<a-form-model-item label="请求地址">
					<b>{{apiUrl}}</b>
				</a-form-model-item>
				<a-form-model-item label="图片">
					<a-upload :showUploadList="false" :multiple="true"
							  :remove="removeFile" :before-upload="uploadFile">
						<a-button><a-icon type="upload"/>上传</a-button>
					</a-upload>
					<a-button type="primary" class="mL15" @click="onSubmit">提交</a-button>
				</a-form-model-item>
				<a-form-model-item label="base64">
					<a-textarea v-model="sourceData.base64" style="width: 80%"
								:auto-size="{ minRows: 6,maxRows: 8 }"/>
				</a-form-model-item>
				<a-form-model-item v-if="sourceData.base64" label="预览">
					<img :src="sourceData.base64" width="100" height="40"/>
				</a-form-model-item>
			</a-form-model>
        </div>
    </div>
</template>

<script>
import rxAjax from "@/assets/js/ajax";

let apiUrl = "/ocr/tess4j/doPost";
export default {
    name: "index",
    components:{},
    data() {
        return {
			apiUrl,
			sourceData:{
				base64:''
			},
			result:"",
        };
    },
    methods:{
		onSubmit(){
			if(!this.sourceData.base64){
				this.$util.message().warning('操作提示','请上传图片')
			}
			let params = {...this.sourceData};
			rxAjax.postJson(apiUrl, params).then(({success,data})=>{
				console.log(data);
				this.result = '识别结果：' + data ?? '';
			})
		},

		/**
		 * 上传单个附件
		 * @param file
		 * @param key
		 * @param config
		 */
		uploadFile(file) {
			let self_ = this;
			// 获取配置
			let suffixs = ['png','img','jpg'];
			// 校验后缀
			let name = file.name;
			//校验文件名长度
			if (name.length > 100) {
				this.$message.error(`文件名过长，上传失败`)
				return
			}
			let suffix = name.substr(name.lastIndexOf(".")+1).toLowerCase();
			if (suffixs.length > 0 && !suffixs.includes(suffix)) {
				this.$message.warning("只能上传"+suffixs.join(",")+"格式的文件");
				return;
			}

			this.$nextTick(() => {
				let fileReader = new FileReader();
				fileReader.onloadend = function (e) {
					let base64 = e.target.result;    // 这里的base64就是我们所要的
					console.log(base64)
					self_.sourceData.base64 = base64;
				};
				fileReader.readAsDataURL(file);     // blob 即我们之前获取到的blob对象
			});
		},
		/**
		 * 删除单个附件
		 */
		removeFile() {
			this.sourceData.base64 = '';
		}
    }
}
</script>

<style scoped>

</style>
