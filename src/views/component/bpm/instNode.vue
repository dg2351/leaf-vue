<template>
	<div class="newPres" v-if="bpmInst">
		<ul class="con">
			<li class="ed xia" v-if="startNode">
				<p class="sx">1</p>
				<p class="tit">{{ currentNode && currentNode.nodeId == startNode.nodeId ? reCommitTip : '已申请' }}</p>
			</li>

			<!--显示审批历史-->
			<template v-for="(item,index) in bpmCheckHistory" v-if="showHistroy == true">
				<li
					class="xia"
					:class="(item.jumpType && item.jumpType.toUpperCase().indexOf('REFUSE') > -1) ? 'fail' : 'ed' ">

					<p class="sx">{{ index + 2 }}</p>
					<a-tooltip>
						<template slot="title">
							<span>审批意见：{{item.remark | remarkFilter}}</span>
						</template>
						<p class="tit">{{item.handlerUserName}}{{item.jumpTypeName}}</p>
					</a-tooltip>
				</li>
			</template>

			<!--{{taskNodeUsers.length}}&#45;&#45;{{currentNode ? true : false}}&#45;&#45;{{currentNode.index}}-{{currentNode.nodeText}}-->

			<template v-for="(item,index) in taskNodeUsers">

				<template v-if="index > 0">
					<!--流程结束-->
					<template v-if="!currentNode">
						<li  class="xia"
							 :class="item.leastHistory && item.leastHistory.checkStatus.indexOf('REFUSE') > -1 ? 'fail' : 'ed' "
						>
							<p class="sx">{{ getSeriesNum(index-1) }}</p> <!--序号-->
							<a-tooltip v-if="item.leastHistory"> <!--审批意见-->
								<template slot="title">
									<span>审批意见：{{item.leastHistory.remark | remarkFilter }}</span>
								</template>
								<div>
									<div class="tit">
										<p>{{item.leastHistory.handlerUserName}}</p>
										<p>{{item.leastHistory.jumpTypeName}}</p>
									</div>
								</div>
							</a-tooltip>
						</li>
					</template>
					<template v-else>
						<!--1.显示已审批节点（最新审批意见）-->
						<li  class="xia" :class="currentNode.nodeId !== startNode.nodeId && currentNode.index > index ? 'ed' : ''"> <!--已审批是蓝色，待审批是灰色-->
							<p class="sx">{{ getSeriesNum(index-1) }}</p> <!--序号-->
							<a-tooltip v-if="item.leastHistory && currentNode.nodeId !== startNode.nodeId && currentNode.index > index"> <!--节点存在审批记录且已审批-->
								<span slot="title">审批意见：{{item.leastHistory.remark | remarkFilter }}</span>
								<div class="tit">
									<p>{{item.leastHistory.handlerUserName}}</p>
									<p>{{item.leastHistory.jumpTypeName}}</p>
								</div>
							</a-tooltip>

							<div class="tit" v-else> <!--节点不存在审批记录，说明是流程第一次走到该节点，那一定是待审批-->
								<p>{{item.realName}}</p>
								<p>{{ waitApproveTit }}</p>
							</div>
						</li>
					</template>

				</template>
			</template>
		</ul>

		<!--如果是审批不通过-->
		<a-button v-if="showBtn" type="danger" style="width: 100%" size="small" @click="seeRefuseOpnion">驳回意见</a-button>

	</div>
</template>

<script>
import FormFunctions from "@/views/modules/form/core/js-comps/FormFunctions";
import BpmCheckHistoryApi from "@/api/bpm/core/bpmCheckHistory";
import BpmInstApi from "@/api/bpm/core/bpmInst";
import BpmDefApi from "@/api/bpm/core/bpmDef";

/**
 * 1.必须有发起人节点
 * 2.一条线，没有子流程
 * 3.已启动非草稿状态的流程
 */
export default {
	name: "inst_new",
	props: {
		instId: {
			type: String,
			default: null
		},
		showHistroy: {
			type: Boolean,
			default: true
		},
		showBtn: {
			type: Boolean,
			default: false
		},
		taskNodeConfig: {
			type: Object,
			required: false
		}
	},
	watch: {
		instId: {
			handler(){
				this.init()
			},
			immediate: true
		}
	},
	data(){
		return {
			bpmInst: null,
			bpmCheckHistory: [],
			taskNodeUsers: [],
			bpmInstStatus: [/*草稿*/'DRAFTED', /*运行*/'RUNNING', /*暂停*/'SUPSPEND', /*作废*/'CANCEL', /*成功结束*/'SUCCESS_END', /*异常结束*/'ERROR_END', 'LOCKED'],
			startNode: null,
			currentNode: null,
			waitApproveTit: '待审批',
			reCommitTip: '请修改后重新提交',
		}
	},
	filters: {
		remarkFilter(value){
			return value && value != '' ? value : '无意见'
		}
	},
	methods: {
		async init(){
			await this.getBpmInst()
			if(!this.bpmInst){
				return console.error("流程实例不存在")
			}
			if(this.bpmInst.status != 'DRAFTED'){
				await this.queryBpmCheckHistory()
			}
			await this.getTaskNodeUsers()
		},
		seeRefuseOpnion(){
			let hit = this.bpmCheckHistory[this.bpmCheckHistory.length - 1]
			this.$emit('seeRefuseOpnion', hit.remark)
		},
		async getBpmInst() {
			await new Promise((resolve,reject) => {
				return BpmInstApi.getBpmInst(this.instId).then(res => {
					if(res.success){
						this.bpmInst = res.data
						resolve()
					}else{
						this.$message.error(res.message)
						reject(res.message)
					}

				})
			})
		},
		async queryBpmCheckHistory(){
			await BpmCheckHistoryApi.getCheckHistorys(this.instId).then(historys => {
				this.bpmCheckHistory = historys.filter(item => item.jumpType != 'SKIP')
			})
		},
		async getTaskNodeUsers(){
			let res = await FormFunctions.invokeCustomQueryPromise('getDefId',{instId:this.instId});
			const defId = res.data[0].defId;
			// 获取流程节点信息
			await BpmDefApi.getNodesByDefId(defId).then(nodes => {
				let userNodes = nodes?.filter(item => item.nodeType === 'bpmn:UserTask')
				this.taskNodeUsers = userNodes.map((node,index,arr) => {
					return {
						"nodeId": node.nodeId,
						"nodeText": node.name,
						"nodeType": node.nodeType,
						"index": index,
						"realName": this.taskNodeConfig ? this.taskNodeConfig?.[node.nodeId]?.name : node.name, //业务节点名称
						"leastHistory":  this.findLeastHistory(node.nodeId) //获取节点最近审批的历史记录

					}
				})

				this.startNode = this.taskNodeUsers?.[0] //发起人节点
			})

			// 获取当前运行节点
			if(this.bpmInst.status === 'RUNNING' || this.bpmInst.status === 'SUBMIT'){
				/** BpmInstApi.getTaskNodeUsers 依赖活动流程，已结束流程会报错。。 */
				await BpmInstApi.getTaskNodeUsers(this.bpmInst.actInstId).then(nodes => {
					// 当前运行节点
					let currentTaskNode = nodes.find(node => node.running == true)
					// 获取节点为止
					if(currentTaskNode){
						this.currentNode = this.taskNodeUsers.find(node => node.nodeId == currentTaskNode.nodeId)
						this.currentNode.running = true
						this.currentNode.taskId = currentTaskNode.taskId
					}
				})

			}
		},
		findLeastHistory(taskNodeId){
			//返回符合测试条件的第一个数组元素的值，如果没有符合条件的则返回undefine
			let hit = this.bpmCheckHistory.find(item => {
				return taskNodeId === item.nodeId
			});
			return hit
		},
		getSeriesNum(index){
			let preCount = this.showHistroy == true ? this.bpmCheckHistory.length + 1 : 1
			let taskNodeCount = this.taskNodeUsers.length
			return  preCount + (index + 1)
		}
	}
}
</script>

<style scoped>

</style>