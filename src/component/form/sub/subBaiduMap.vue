<template>
    <div>
		<a-input :style="item.style" readOnly
				 v-model="sourceData[item.model]"
				 @click="baiduMapEvent().baiduMapOnModal(item.model)"/>

		<a-modal :visible="baiduMapConfig.visible" width="630px"
				 @ok="baiduMapEvent().baiduMapOnOk"
				 @cancel="baiduMapEvent().baiduMapOnCancel">
			<BaiMap class="mT10" :zcCenter="mapObject" :handleCenter=true
					@baiduMapClick="baiduMapEvent().baiduMapClick"></BaiMap>
			<a-form-model class="mT10"
						  :label-col="{ span: 4 }"
						  :wrapper-col="{ span: 8 }">
				<a-form-model-item label="详细地址">
					<a-input v-model="mapObject.address"
							 :addon-before="mapObject.addComp.province+mapObject.addComp.city+mapObject.addComp.district"
							 style="width: 100%"/>
				</a-form-model-item>
			</a-form-model>
		</a-modal>
	</div>
</template>

<script>
// import BaiMap from "@/component/baidu/baimap"
export default {
	name: "subBaiduMap",
	props:['sourceData','formConfig', 'item'],
	components:{
		// BaiMap,
	},
	data(){
		return{
			// 地图选取位置
			mapObject:{
				lng:null,
				lat:null,
				address:'',
				addComp:{province:'', city:'', district:'', street:'', streetNumber:''},
			},
			baiduMapConfig:{visible:false,key:null},
		}
	},
	methods:{
		baiduMapEvent(){
			let self_ = this;
			let func = {};
			func.baiduMapOnModal = function () {
				let value = self_.sourceData[key];
				if(value){
					let lng = getFormData(self_.sourceData, key+'_lng');
					let lat = getFormData(self_.sourceData,key+'_lat');
					let py = getFormData(self_.sourceData, key+'_py');
					let cy = getFormData(self_.sourceData, key+'_cy');
					let dt = getFormData(self_.sourceData, key+'_dt');
					let str = py+cy+dt;// 省市区
					if(str)
						value = value.replace(str, '');
					self_.mapObject = {
						lng:lng,
						lat:lat,
						addComp:{province:py, city:cy, district:dt},
						address:value};
				} else {
					self_.mapObject = {
						lng:null, lat:null,
						addComp:{province:'', city:'', district:'', street:'', streetNumber:''},
						address:''
					};
				}
				self_.baiduMapConfig = {visible:true,key:key};
			}
			func.baiduMapClick = function(value){
				let addComp = JSON.parse(JSON.stringify(value.addComp))
				self_.mapObject = {
					lng:value.lng,
					lat:value.lat,
					addComp:addComp,
					address:addComp.street + addComp.streetNumber
				};
			}
			func.baiduMapOnCancel = function(){
				self_.baiduMapConfig = {visible:false,key:null};
			}
			func.baiduMapOnOk = function(){
				let key = self_.baiduMapConfig.key;
				let lng = self_.mapObject.lng;
				let lat = self_.mapObject.lat;
				let addComp = self_.mapObject.addComp;
				let address = self_.mapObject.address;

				Object.assign(self_.sourceData, {
					[key+'_lng']:lng,
					[key+'_lat']:lat,
					[key+'_py']:addComp.province,//省
					[key+'_cy']:addComp.city,//市
					[key+'_dt']:addComp.district,//区
					[key]: addComp.province + addComp.city + addComp.district + address,
				})
				self_.baiduMapConfig = {visible:false,key:null};
			}
			return func;
		},
	}
}
</script>

<style scoped>

</style>