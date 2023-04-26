<template>
	<div>
		<div style="position: absolute;z-index: 100;">
			<a-input v-model="mapLocation.address" placeholder="请输入详细地址" style="width: 155px"/>
			<a-button @click="querySearch(mapLocation.address)">定位</a-button>
		</div>

		<baidu-map class="bm-view" ak="YOUR_APP_KEY"
				   :center="center" :zoom="zoom" :scroll-wheel-zoom="true" :mapClick="false"
				   @ready="handler" @click="getClickInfo">
			<!-- 比例尺控件，注册此组件才会在地图上显示比例尺 -->
			<bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale>
			<!-- 缩放控件，注册此组件才会显示拖放进度 -->
			<bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>

			<bm-marker v-if="zbD" :position="center" :dragging=handleCenter
				@click="infoWindowOpen" @dragend="getClickInfo">
			</bm-marker>
		</baidu-map>
	</div>


</template>
<script>
//项目中引入使用百度地图的组件
// import BaiduMap from 'vue-baidu-map/components/map/Map.vue'    // 百度地图组件
// import BmScale from 'vue-baidu-map/components/controls/Scale'   // 比例尺组件
// import BmNavigation from 'vue-baidu-map/components/controls/Navigation'　　//　缩放组件
// import BmMarker from 'vue-baidu-map/components/overlays/Marker'　　// 标记点的组件
// import BmLabel from 'vue-baidu-map/components/overlays/Label'　　　　// 标签组件，展示在标记点中的数字
// import BmInfoWindow from 'vue-baidu-map/components/overlays/InfoWindow'  // 信息窗体
let center = {
	lng: 113.399158, lat: 22.523294
}
export default {
	name: "zcgl-hydm",
	props:{
		"zcCenter":{
			type:Object,
		},
		"handleCenter":{
			type:Boolean,
		}
	},
	components: {
		BaiduMap,
		BmScale,
		BmNavigation,
		BmMarker,
		BmInfoWindow,
		BmLabel
	},
	computed: {},
	data() {
		return {
			center: {lng: center.lng, lat: center.lat, address:''},
			zoom: 16,
			showFlag:false,

			zbD:false,

			mapLocation: {
				address: undefined,
				coordinate: undefined
			}
		}
	},
	created() {
		console.log(this.center)
	},
	methods: {
		getClickInfo(e){
			let that = this;
			if(that.handleCenter){
				that.zbD=true;
				this.center.lng = e.point.lng
				this.center.lat = e.point.lat

				var geoc = new BMap.Geocoder();
				let address = "";
				geoc.getLocation(e.point, function (rs) {
					var addComp = rs.addressComponents;
					address = rs.address
					that.center.addComp = addComp;
					that.center.address = address;
					that.$emit('baiduMapClick',that.center);
				})
			}
		},

		// 地图初始化完成回调
		handler({ BMap, map }) {
			this.BMap = BMap
			this.map = map
		},
		// 关闭标记详情
		infoWindowClose() {
			this.showFlag = false
		},
		// 打开标记详情
		infoWindowOpen() {
			this.showFlag = !this.showFlag
		},
		// 查询地址
		querySearch(queryString) {
			var that = this
			var myGeo = new this.BMap.Geocoder()
			myGeo.getPoint(queryString, function(point) {
				if (point) {
					that.mapLocation.coordinate = point
					that.makerCenter(point)
				} else {
					that.mapLocation.coordinate = null
				}
			})
		},
		makerCenter(point) {
			if (this.map) {
				this.zcCenter.lng = point.lng
				this.zcCenter.lat = point.lat
				this.zoom = 16
			}
		},
	},
	watch: {
		zcCenter: {
			handler: function(newVal, oldVal) {
				if(newVal.lat =='' || newVal.lng=='' || newVal.lat ==null || newVal.lng==null || isNaN(newVal.lat) || isNaN(newVal.lng)){
					this.center.lng = center.lng;
					this.center.lat = center.lat;
					this.zbD=false;
				}else{
					this.zbD=true;
					this.center.lng = newVal.lng;
					this.center.lat = newVal.lat;
				}
			},
			deep: true,
			immediate:true,
		},
	}
}
</script>

<style scoped>
.bm-view {
	width: 600px;
	height: 300px;
}
</style>