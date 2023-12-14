<template>
	<a-modal title="图标选择" dialogClass="modal_a" width="88%"
			 :visible="visible" @cancel="closeModal(false)" :footer="null">
		<a-spin :spinning="loading">
			<div class="p10 bor_a" style="height:550px;max-height: 600px">
				<a-tabs class="nav_big1" v-model="curtab">
					<a-tab-pane v-for="val in typeList" :tab="val.label" :key="val.label">
						<ul>
							<li :style="selectId == item.icon ? 'background-color: darkcyan' : ''"
								style="display: inline-block;padding: 12px;margin: 3px 0;border-radius: 4px;"
								v-for="item in val.children" @click="selectId = item.icon">
								<a-icon style="fontSize:24px" :type="item.icon"/>
							</li>
						</ul>
					</a-tab-pane>
				</a-tabs>
			</div>
			<div class="textCenter mB20">
				<a-button type="primary" class="mR15" @click="onSubmit(true)">确认</a-button>
				<a-button class="mR15"  @click="closeModal(false)">返回</a-button>
			</div>
		</a-spin>
	</a-modal>
</template>

<script>

import FormMethods from "@/plugins/js-comps/FormMethods";

export default {
    name: "iconModal",
    components: {},
    data() {
        return {
			visible: false,
            loading:false,
			//
			selectKey: null,
			selectId: null,
			//
			curtab:"",
			typeList:[],
        };
    },
    methods:{
		openModal(val, key){
			this.visible = true;
			this.selectId = val;
			this.selectKey = key;
			this.loadData(val);
		},
		closeModal(refresh = false){
			this.visible = false;
			if(refresh){
				this.$emit("callback", {refresh, data:this.selectId, key: this.selectKey})
			}
		},
		getValue(data, key){
			return data ? (data[key] ?? '') : '';
		},
		async loadData(val){
			let {data} = await FormMethods.invokeCustomQueryPromise("sysIcon", {});
			let typeList = [];
			data.forEach(item=>{
				let $data = typeList.filter(p=>p.label == item.type_);
				let icon = item.icon_
				if(icon == val){
					this.curtab = item.type_;
				}
				if($data.length > 0){
					$data[0].children.push({icon:icon});
				}else{
					let children = [];
					children.push({icon:icon})
					typeList.push({label:item.type_, children:children});
				}
			})
			this.typeList = typeList;
			this.curtab = this.curtab ? this.curtab : (typeList?.[0].label ?? "");
			// 提取字符串
			// let str = '';
			// let list = str.match(/\图标(.+?)class/g);
			// list.forEach(item=>{
			// 	console.log(item.replace("图标: ",'').replace("\" class",''))
			// })
        },
        // 提交
        onSubmit(validate){
            let self_ = this;
            if(self_.loading) return;
            self_.loading = true;
			self_.closeModal(true);
        },
    }
}
</script>

<style scoped lang="less">
</style>
