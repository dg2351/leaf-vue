<template>
	<a-modal title="自定义查询预览" dialogClass="modal_a" width="800px"
			 :visible="visible" @cancel="closeModal" :footer="null">
		<a-spin :spinning="loading">
			<div class="p10 bor_a" v-if="!formConfig.loading">
				<!---->
				<form_model ref="formModel" :sourceData="sourceData" :formConfig="formConfig"/>
				<div class="textCenter mB10">
					<a-button type="primary" icon="search" class="mR15" @click="onSubmit(true)">查询</a-button>
					<a-button class="mR15" @click="resetParams">重置</a-button>
				</div>
				<p>返回json数据：</p>
				<a-textarea v-model="outputData" :readOnly="true" :auto-size="{minRows: 12,maxRows:12}"/>
			</div>
		</a-spin>
	</a-modal>
</template>

<script>
import form_model from "@/component/form/form_model";
import rxAjax from "@/assets/js/ajax";

export default {
    name: "edit",
    props: {
        params: Object,
    },
    components: {form_model},
    computed: {
        routerParams() {
            return this.$route.query;
        },
    },
    data() {
        return {
			visible: false,
            loading:false,
			alias:"",
            sourceData:{pageIndex:null},
            formConfig: {
                visible: false,
                loading: true,
                disabled: false,
                data: [],
            },
			outputData:"",
        };
    },
    methods:{
		openModal(params){
			this.visible = true;
			this.loadData(params.id);
		},
		closeModal(){
			this.visible = false;
		},
        loadData(id){
            let self_ = this;
			self_.formConfig.data = [];
			self_.sourceData = {pageIndex:null};
			self_.outputData = "";
            if(id){
                let api = "/form/custom/query/info";
                let params = Object.assign({id:id});
                rxAjax.get(api, params).then(({success,data})=>{
					self_.alias = data.alias;
					let whereField = data.whereField?JSON.parse(data.whereField) : [];
					if(whereField.length > 0){
						whereField.forEach(item=>{
							self_.formConfig.data.push({type: "input",label: item.comment,model: item.fieldName})
						})
					}
					if(data.isPage==1){
						self_.formConfig.data.push({type: "input",label: '页码',model: "pageIndex"});
						self_.sourceData.pageIndex= 1;
					}
					self_.formConfig.loading = false
                })
            } else{
				self_.formConfig.loading = false
            }
        },
		resetParams(){
			this.sourceData = {pageIndex:null};
			this.onSubmit(true);
		},
        // 提交
        onSubmit(validate){
            let self_ = this;
            if(self_.loading) return;
            self_.loading = true;
            let data = this.$refs['formModel'].formMethods().getData(validate);
            if(!(data.validate)){
                return self_.loading = false;
            }
            // 自定义查询
			let sqlKey = this.alias;
			let params = {...data.formData};
            rxAjax.postForm("/form/custom/query/queryForJson_"+sqlKey, {
            	params: JSON.stringify(params)
			}).then(({success,data})=>{
                self_.loading = false;
				self_.outputData = JSON.stringify(data)??"";
            }).catch(err=>{
				self_.loading = false;
			});
        },
    }
}
</script>

<style scoped lang="less">
</style>
