<template>
	<div>
		<a-modal title="编辑-自定义列表" dialogClass="modal_a" width="90%"
				 :visible="visible" @cancel="closeModal" :footer="null">
			<a-spin :spinning="loading">
				<template v-if="step == 1">
					<edit-form :source-data="sourceData" @nextEvent="step=2" @closeEvent="closeModal"/>
				</template>
				<template v-if="step == 2">
					<div class="p10 bor_a" style="height: 650px;overflow-y: auto">
						<a-tabs class="nav_big1">
							<a-tab-pane key="fields" tab="列头配置">
								<editFields ref="fieldsJson" :source-data="sourceData"/>
							</a-tab-pane>
							<a-tab-pane key="search" tab="条件配置">
								<editSearch ref="searchJson" :source-data="sourceData"/>
							</a-tab-pane>
							<a-tab-pane key="script" tab="脚本函数">
								<editScript ref="bodyScript" :source-data="sourceData"/>
							</a-tab-pane>
						</a-tabs>
					</div>
					<div class="textCenter mB20">
						<a-button type="primary" class="mR15" @click="step = 1">上一步</a-button>
						<a-button type="primary" class="mR15" @click="onSubmit(true)">保存</a-button>
						<a-button class="mR15"  @click="closeModal()">返回</a-button>
					</div>
				</template>
			</a-spin>
		</a-modal>
	</div>
</template>

<script>
import rxAjax from "@/assets/js/ajax";
import editForm from "@/views/page/form/list/step/editForm";
import editFields from "@/views/page/form/list/step/editFields";
import editSearch from "@/views/page/form/list/step/editSearch";
import editScript from "@/views/page/form/list/step/editScript";

export default {
    name: "edit",
    props: {
        params: Object,
    },
    components: {
		editForm,
		editFields,
		editSearch,
		editScript,
	},
    computed: {
        routerParams() {
            return this.$route.query;
        },
    },
    data() {
        return {
			visible: false,
            loading:false,
			// 步骤
			step:1,
			//
            sourceData:{},
		};
    },
    methods:{
		openModal(params){
			this.visible = true;
			this.loadData(params.id, params.parentId);
		},
		closeModal(refresh = false){
			this.visible = false;
			if(refresh){
				this.$emit("callback", {refresh})
			}
		},
        loadData(id){
            if(id){
                let api = "/form/bo/list/info";
                let params = Object.assign({id:id});
                rxAjax.get(api, params).then(({success,data})=>{
					this.sourceData = Object.assign(data, {
						formAlias: data.formAlias,
						fieldsJson: data.fieldsJson?JSON.parse(data.fieldsJson) : [],
						searchJson: data.searchJson?JSON.parse(data.searchJson) : [],
					});
                })
            } else{
				this.sourceData = Object.assign({
					url:"",
					formAlias:"",
					fieldsJson: [],
					searchJson: [],
				});
            }
        },
		// 提交
		onSubmit(validate){
			let self_ = this;
			if(self_.loading) return;
			self_.loading = true;
			let {sourceData} = this;
			if(!sourceData.id){
				self_.$util.message().error("操作提示", "数据主键丢失");
				return self_.closeModal(true)
			}
			// 组装数据
			let formData = {
				id: sourceData.id,
				idField: sourceData.idField,
			}
			let keyList = ['fieldsJson','searchJson','bodyScript'];
			keyList.forEach(key=>{
				if(!this.$refs[key])
					return;
				let data = this.$refs[key].getData();
				if(['fieldsJson','searchJson'].includes(key))
					Object.assign(formData, {[key]:JSON.stringify(data)})
				else
					Object.assign(formData, {[key]:data})
			})
			// 调用保存表单
			let api = "/form/bo/list/save";
			rxAjax.postJson(api, formData).then(({success,data})=>{
				self_.loading = false;
				if(success && data){
					self_.$message.success("保存成功");
					self_.sourceData.id = data;
					self_.closeModal(true);
				}
			}).catch(err=>{
				self_.loading = false;
				self_.$message.error("网络错误");
			});
		},
    }
}
</script>

<style scoped>

</style>
