<template>
    <div class="p10">
		<div class="xqPlace">
			<h1 class="plTit">通用场景OCR </h1>
			<!---->
			<a-row>
				<a-col :span="6">
					<h2 style="font-weight: bold">通用文字识别
						<a-button type="primary" icon="caret-right" class="mL15" @click="onSubmit">调试</a-button>
					</h2>
					<h1 style="font-weight: bold">Header</h1>
					<div class="p10">
						<h1>Content-Type：</h1>
						<a-input class="mB10" disabled readOnly v-model="headData['Content-Type']"/>
						<h1>Accept：</h1>
						<a-input class="mB10" disabled readOnly v-model="headData['Accept']"/>
					</div>

					<h1 style="font-weight: bold">Query</h1>
					<div class="p10">
						<h1>base64：</h1>
						<a-textarea class="mB10" v-model="sourceData.base64" :auto-size="{ minRows: 4,maxRows: 5 }"/>
						<a-upload :showUploadList="false" :multiple="true"
								  :remove="removeFile" :before-upload="uploadFile">
							<a-button type="primary" size="small" class="mB10"><a-icon type="upload"/>上传</a-button>
						</a-upload>

						<template v-if="sourceData.base64">
							<h1>预览：</h1>
							<img :src="sourceData.base64" width="100" height="40"/>
						</template>
					</div>
				</a-col>
				<a-col :span="18">
					<a-tabs class="nav_big1">
						<a-tab-pane tab="调试结果">
							<div class="p10">
								<h1 style="font-weight: bold">请求地址：{{apiUrl}}</h1>
								<a-textarea v-model="result" :auto-size="{ minRows: 4,maxRows: 4 }" readOnly/>
							</div>
						</a-tab-pane>
					</a-tabs>
				</a-col>
			</a-row>
        </div>
    </div>
</template>

<script>
import rxAjax from "@/assets/js/ajax";

let apiUrl = "/ocr/tess4j/doPost";
export default {
    name: "index",
    data() {
        return {
        	// 调试参数
			apiUrl,
			headData: {
				"Content-Type":"application/json",
				"Accept":"application/json, text/plain, */*"
			},
			sourceData:{
				base64:''
			},
			result:"",
        };
    },
    methods:{
    	/**
		 * 调试
		 **/
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
