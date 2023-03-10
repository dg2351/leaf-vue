<template>
	<div class="p10">
		<div class="form_a boxa" style="padding: 10px">
			<a-timeline class="sp_a" style="margin-top: 30px">
				<a-timeline-item :class="getColorByJumpType(item.jumpType)" v-for="(item,index) in processData" >
					<template slot="dot">
						<span class="icon"></span>
					</template>
					<h3 style="margin-left: 15px">{{item.nodeName }}</h3>
					<div class="sp_main" style="margin-left: 15px; margin-top: 10px">
						<div class="img">
							<img :src="require('@/assets/bpm/user_icon.png')" alt=""/>
							<div>
								<h3>{{item.handlerUserName }}</h3>
								<span>{{moment(item.completeTime).format(formatStr)}}</span>
							</div>
						</div>
						<p class="sp_p">
							<b><a-icon type="edit"/>操作：</b>
							<span>{{item.handlerUserName }}进行了<i :class="getColorByJumpType(item.jumpType)">
								{{item.jumpType == 'SKIP' ? '提交' : item.jumpTypeName}}</i>操作</span>
						</p>
						<p class="sp_p" style="white-space: pre-wrap;">
							<b><a-icon type="form"/>意见：</b><span>{{item.remark}}</span>
						</p>
					</div>
				</a-timeline-item>

			</a-timeline>
		</div>
	</div>
</template>

<script>
import BpmCheckHistoryApi from "@/api/bpm/core/bpmCheckHistory";
import moment from 'moment'
export default {
	name: "bpmHistory",
	props: {
		instId: {
			type: String,
			default:null,
		}
	},
	data() {
		return {
			moment,
			processData: [],
			formatStr: "YYYY-MM-DD HH:mm:ss"
		}
	},
	methods: {
		getColorByJumpType(type){
			if(type.includes('REFUSE','BACK')){
				return 'red gray'
			}else if(type == 'AGREE'){
				return 'green'
			}else{
				return 'blue'
			}
		}
	},
	watch: {
		instId: {
			handler (newName, oldName) {
				if(newName!=null){
					BpmCheckHistoryApi.getCheckHistorys(this.instId).then(response => {
						if (response && response.length > 0) {
							this.processData = response;
							// console.log("getCheckHistorys>>> ", response)
						}
					});
				}
			},
			immediate: true
		}
	}
}
</script>

<style scoped lang="less">
.sp_a {
	.img {
		img {
			width: 70px;
		}

		> div {
			display: inline-block;
			vertical-align: top;
			margin-left: 10px;

			h3 {
				padding-top: 10px;
				font-size: 15px;
				margin-bottom: 4px;

			}

			span {
				display: block;
				color: #999;
			}
		}
	}

	.icon {
		height: 30px;
		width: 30px;
		display: block;
		border-radius: 50%;
		background: url(~@/assets/bpm/spg_icon.png) no-repeat center #5a8bff;
	}

	.ant-timeline-item-content {
		margin-left: 30px !important;
	}

	h3 {
		font-size: 16px;
		font-weight: bold;
	}

	.sp_p {

		.red {
			font-weight: bold;
			color: red;
			font-style: normal;
		}

		.green {
			font-weight: bold;
			color: #17b69b;
			font-style: normal;
		}

		.yellow {
			font-weight: bold;
			color: #f5bc00;
			font-style: normal;
		}

		.blue {
			font-weight: bold;
			color: #53a0ff;
			font-style: normal;
		}

		line-height: 24px;
		margin-bottom: 5px;
		color: #6d6f73;
		font-size: 14px;

		b {
			display: inline-block;
			font-weight: normal;

			.anticon {
				color: #052347;
			}
		}

		.time {
			display: block;
			font-size: 12px;
			color: #999;
		}
	}

	.sp_main {
		box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
		padding: 10px;
		border-radius: 3px;
	}

	.green {
		.icon {
			height: 30px;
			width: 30px;
			display: block;
			border-radius: 50%;
			background: url(~@/assets/bpm/sp_icon.png) no-repeat center #34c7ae;
		}
	}

	.gray {
		.icon {
			height: 30px;
			width: 30px;
			display: block;
			border-radius: 50%;
			background: url(~@/assets/bpm/sp_icon.png) no-repeat center #b4b4b4;
		}
	}
}
</style>