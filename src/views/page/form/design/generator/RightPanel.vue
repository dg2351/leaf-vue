<template>
	<div class="right-board">
		<a-tabs v-model="currentTab" class="center-tabs">
			<a-tab-pane tab="组件属性" key="field" />
			<a-tab-pane tab="表单属性" key="form" />
		</a-tabs>
		<div class="field-box">
			<!-- 组件属性 -->
			<a-form v-show="currentTab==='field' && showField" class="form-box" size="small" label-width="90px">
				<a-form-item v-if="activeData.changeTag" label="组件类型">
					<a-select v-model="activeData.tagIcon"
							  placeholder="请选择组件类型" :style="{width: '100%'}"
							  @change="tagChange">
						<template v-for="group in tagList">
							<a-select-option v-for="item in group.options" :key="item.label"
											 :value="item.tagIcon">{{ item.label }}</a-select-option>
						</template>
					</a-select>
				</a-form-item>
				<a-form-item v-if="activeData.vModel!==undefined" label="字段名">
					<a-input v-model="activeData.vModel" placeholder="请输入字段名（v-model）" />
				</a-form-item>
				<a-form-item v-if="activeData.componentName!==undefined" label="组件名">
					{{ activeData.componentName }}
				</a-form-item>
				<a-form-item v-if="activeData.label!==undefined" label="标题">
					<a-input v-model="activeData.label" placeholder="请输入标题" />
				</a-form-item>
				<a-form-item v-if="activeData.placeholder!==undefined" label="占位提示">
					<a-input v-model="activeData.placeholder" placeholder="请输入占位提示" />
				</a-form-item>
				<a-form-item v-if="activeData['start-placeholder']!==undefined" label="开始占位">
					<a-input v-model="activeData['start-placeholder']" placeholder="请输入占位提示" />
				</a-form-item>
				<a-form-item v-if="activeData['end-placeholder']!==undefined" label="结束占位">
					<a-input v-model="activeData['end-placeholder']" placeholder="请输入占位提示" />
				</a-form-item>
				<a-form-item v-if="activeData.required !== undefined" label="是否必填">
					<a-switch v-model="activeData.required" />
				</a-form-item>
				<a-form-item v-if="activeData.vModel!==undefined" label="默认值">
					<a-input :value="setDefaultValue(activeData.defaultValue)"
							 placeholder="请输入默认值"
							 v-model="activeData.defaultValue"/>
				</a-form-item>
				<a-form-item v-if="activeData.maxLength !== undefined" label="最多输入">
					<a-input-number style="width: 160px" v-model="activeData.maxLength"
									placeholder="请输入字符长度" :min="1" :max="999"/>
				</a-form-item>
				<a-form-item v-if="activeData.span!==undefined" label="表单栅格">
					<a-slider v-model="activeData.span" :max="24" :min="1" :marks="{12:''}" @change="spanChange" />
				</a-form-item>
				<a-form-item v-if="activeData.layout==='rowFormItem'" label="栅格间隔">
					<a-input-number v-model="activeData.gutter" :min="0" placeholder="栅格间隔" />
				</a-form-item>
				<a-form-item v-if="activeData.layout==='rowFormItem'" label="布局模式">
					<a-radio-group v-model="activeData.type">
						<a-radio-button label="default" />
						<a-radio-button label="flex" />
					</a-radio-group>
				</a-form-item>
				<a-form-item v-if="activeData.justify!==undefined&&activeData.type==='flex'" label="水平排列">
					<a-select v-model="activeData.justify" placeholder="请选择水平排列" :style="{width: '100%'}">
						<a-option
							v-for="(item, index) in justifyOptions"
							:key="index"
							:label="item.label"
							:value="item.value"
						/>
					</a-select>
				</a-form-item>
				<a-form-item v-if="activeData.align!==undefined&&activeData.type==='flex'" label="垂直排列">
					<a-radio-group v-model="activeData.align">
						<a-radio-button label="top" />
						<a-radio-button label="middle" />
						<a-radio-button label="bottom" />
					</a-radio-group>
				</a-form-item>
				<a-form-item v-if="activeData.labelWidth!==undefined" label="标签宽度">
					<a-slider v-model="activeData.labelWidth" :max="24" :min="1" :marks="{12:''}" @change="v=>{formConf.span = v}" />
					<!--<a-input v-model.number="activeData.labelWidth" type="number" :min="1" :max="24" placeholder="请输入标签宽度" />-->
				</a-form-item>
				<a-form-item v-if="activeData.style&&activeData.style.width!==undefined" label="组件宽度">
					<a-input v-model="activeData.style.width" placeholder="请输入组件宽度" allowClear />
				</a-form-item>
				<a-form-item v-if="activeData.tag==='a-checkbox-group'" label="至少应选">
					<a-input-number
						:value="activeData.min"
						:min="0"
						placeholder="至少应选"
						@input="$set(activeData, 'min', $event?$event:undefined)"
					/>
				</a-form-item>
				<a-form-item v-if="activeData.tag==='a-checkbox-group'" label="最多可选">
					<a-input-number
						:value="activeData.max"
						:min="0"
						placeholder="最多可选"
						@input="$set(activeData, 'max', $event?$event:undefined)"
					/>
				</a-form-item>
				<a-form-item v-if="activeData.addonBefore!==undefined" label="前缀">
					<a-input v-model="activeData.addonBefore" placeholder="请输入前缀" />
				</a-form-item>
				<a-form-item v-if="activeData.addonAfter!==undefined" label="后缀">
					<a-input v-model="activeData.addonAfter" placeholder="请输入后缀" />
				</a-form-item>
				<a-form-item v-if="activeData['prefix']!==undefined" label="前图标">
					<a-input v-model="activeData['prefix']" placeholder="请输入前图标名称">
						<a slot="addonAfter" @click="openIconsDialog('prefix')">选择</a>
					</a-input>
				</a-form-item>
				<a-form-item v-if="activeData['suffix'] !== undefined" label="后图标">
					<a-input v-model="activeData['suffix']" placeholder="请输入后图标名称">
						<a slot="addonAfter" @click="openIconsDialog('suffix')">选择</a>
					</a-input>
				</a-form-item>
				<a-form-item v-if="activeData.tag === 'a-cascader'" label="选项分隔符">
					<a-input v-model="activeData.separator" placeholder="请输入选项分隔符" />
				</a-form-item>
				<a-form-item v-if="activeData.autoSize !== undefined" label="最小行数">
					<a-input-number v-model="activeData.autoSize.minRows" :min="1" :max="activeData.autoSize.maxRows" placeholder="最小行数" />
				</a-form-item>
				<a-form-item v-if="activeData.autoSize !== undefined" label="最大行数">
					<a-input-number v-model="activeData.autoSize.maxRows" :min="activeData.autoSize.minRows" :max="99" placeholder="最大行数" />
				</a-form-item>
				<a-form-item v-if="activeData.min !== undefined" label="最小值">
					<a-input-number v-model="activeData.min" placeholder="最小值" />
				</a-form-item>
				<a-form-item v-if="activeData.max !== undefined" label="最大值">
					<a-input-number v-model="activeData.max" placeholder="最大值" />
				</a-form-item>
				<a-form-item v-if="activeData.step !== undefined" label="步长">
					<a-input-number v-model="activeData.step" placeholder="步数" />
				</a-form-item>
				<a-form-item v-if="activeData.tag === 'a-input-number'" label="精度">
					<a-input-number v-model="activeData.precision" :min="0" placeholder="精度" />
				</a-form-item>
				<a-form-item v-if="activeData.tag === 'a-input-number'" label="按钮位置">
					<a-radio-group v-model="activeData['controls-position']">
						<a-radio-button label="">
							默认
						</a-radio-button>
						<a-radio-button label="right">
							右侧
						</a-radio-button>
					</a-radio-group>
				</a-form-item>
				<a-form-item v-if="activeData['active-text'] !== undefined" label="开启提示">
					<a-input v-model="activeData['active-text']" placeholder="请输入开启提示" />
				</a-form-item>
				<a-form-item v-if="activeData['inactive-text'] !== undefined" label="关闭提示">
					<a-input v-model="activeData['inactive-text']" placeholder="请输入关闭提示" />
				</a-form-item>
				<a-form-item v-if="activeData['active-value'] !== undefined" label="开启值">
					<a-input
						:value="setDefaultValue(activeData['active-value'])"
						placeholder="请输入开启值"
						@input="onSwitchValueInput($event, 'active-value')"
					/>
				</a-form-item>
				<a-form-item v-if="activeData['inactive-value'] !== undefined" label="关闭值">
					<a-input
						:value="setDefaultValue(activeData['inactive-value'])"
						placeholder="请输入关闭值"
						@input="onSwitchValueInput($event, 'inactive-value')"
					/>
				</a-form-item>
				<a-form-item label="时间类型" v-if="activeData.type !== undefined && 'el-date-picker' === activeData.tag">
					<a-select
						v-model="activeData.type"
						placeholder="请选择时间类型"
						:style="{ width: '100%' }"
						@change="dateTypeChange"
					>
						<a-option
							v-for="(item, index) in dateOptions"
							:key="index"
							:label="item.label"
							:value="item.value"
						/>
					</a-select>
				</a-form-item>
				<a-form-item v-if="activeData.name !== undefined" label="文件字段名">
					<a-input v-model="activeData.name" placeholder="请输入上传文件字段名" />
				</a-form-item>
				<a-form-item v-if="activeData.accept !== undefined" label="文件类型">
					<a-select v-model="activeData.accept" placeholder="请选择文件类型" :style="{ width: '100%' }" allowClear>
						<a-option label="图片" value="image/*" />
						<a-option label="视频" value="video/*" />
						<a-option label="音频" value="audio/*" />
						<a-option label="excel" value=".xls,.xlsx" />
						<a-option label="word" value=".doc,.docx" />
						<a-option label="pdf" value=".pdf" />
						<a-option label="txt" value=".txt" />
					</a-select>
				</a-form-item>
				<a-form-item v-if="activeData.fileSize !== undefined" label="文件大小">
					<a-input v-model.number="activeData.fileSize" placeholder="请输入文件大小">
						<a-select slot="append" v-model="activeData.sizeUnit" :style="{ width: '66px' }">
							<a-option label="KB" value="KB" />
							<a-option label="MB" value="MB" />
							<a-option label="GB" value="GB" />
						</a-select>
					</a-input>
				</a-form-item>
				<a-form-item v-if="activeData.action !== undefined" label="上传地址">
					<a-input v-model="activeData.action" placeholder="请输入上传地址" allowClear />
				</a-form-item>
				<a-form-item v-if="activeData['list-type'] !== undefined" label="列表类型">
					<a-radio-group v-model="activeData['list-type']" size="small">
						<a-radio-button label="text">
							text
						</a-radio-button>
						<a-radio-button label="picture">
							picture
						</a-radio-button>
						<a-radio-button label="picture-card">
							picture-card
						</a-radio-button>
					</a-radio-group>
				</a-form-item>
				<a-form-item
					v-if="activeData.buttonText !== undefined"
					v-show="'picture-card' !== activeData['list-type']"
					label="按钮文字"
				>
					<a-input v-model="activeData.buttonText" placeholder="请输入按钮文字" />
				</a-form-item>
				<a-form-item v-if="activeData['range-separator'] !== undefined" label="分隔符">
					<a-input v-model="activeData['range-separator']" placeholder="请输入分隔符" />
				</a-form-item>
				<a-form-item v-if="activeData['picker-options'] !== undefined" label="时间段">
					<a-input
						v-model="activeData['picker-options'].selectableRange"
						placeholder="请输入时间段"
					/>
				</a-form-item>
				<a-form-item v-if="activeData.format !== undefined" label="时间格式">
					<a-input
						:value="activeData.format"
						placeholder="请输入时间格式"
						@input="setTimeValue($event)"
					/>
				</a-form-item>
				<template v-if="['a-checkbox-group', 'a-radio-group', 'a-select'].indexOf(activeData.tag) > -1">
					<a-divider>选项</a-divider>
					<draggable
						:list="activeData.options"
						:animation="340"
						group="selectItem"
						handle=".option-drag"
					>
						<div v-for="(item, index) in activeData.options" :key="index" class="select-item">
							<div class="select-line-icon option-drag">
								<i class="el-icon-s-operation" />
							</div>
							<a-input v-model="item.label" placeholder="选项名" size="small" />
							<a-input
								placeholder="选项值"
								size="small"
								:value="item.value"
								@input="setOptionValue(item, $event)"
							/>
							<div class="close-btn select-line-icon" @click="activeData.options.splice(index, 1)">
								<i class="el-icon-remove-outline" />
							</div>
						</div>
					</draggable>
					<div style="margin-left: 20px;">
						<a-button
							style="padding-bottom: 0"
							icon="el-icon-circle-plus-outline"
							type="text"
							@click="addSelectItem"
						>
							添加选项
						</a-button>
					</div>
					<a-divider />
				</template>

				<template v-if="['a-cascader'].indexOf(activeData.tag) > -1">
					<a-divider>选项</a-divider>
					<a-form-item label="数据类型">
						<a-radio-group v-model="activeData.dataType" size="small">
							<a-radio-button label="dynamic">
								动态数据
							</a-radio-button>
							<a-radio-button label="static">
								静态数据
							</a-radio-button>
						</a-radio-group>
					</a-form-item>

					<template v-if="activeData.dataType === 'dynamic'">
						<a-form-item label="标签键名">
							<a-input v-model="activeData.labelKey" placeholder="请输入标签键名" />
						</a-form-item>
						<a-form-item label="值键名">
							<a-input v-model="activeData.valueKey" placeholder="请输入值键名" />
						</a-form-item>
						<a-form-item label="子级键名">
							<a-input v-model="activeData.childrenKey" placeholder="请输入子级键名" />
						</a-form-item>
					</template>

					<a-tree
						v-if="activeData.dataType === 'static'"
						draggable
						:data="activeData.options"
						node-key="id"
						:expand-on-click-node="false"
						:render-content="renderContent"
					/>
					<div v-if="activeData.dataType === 'static'" style="margin-left: 20px">
						<a-button
							style="padding-bottom: 0"
							icon="el-icon-circle-plus-outline"
							type="text"
							@click="addTreeItem"
						>
							添加父级
						</a-button>
					</div>
					<a-divider />
				</template>

				<a-form-item v-if="activeData.optionType !== undefined" label="选项样式">
					<a-radio-group v-model="activeData.optionType">
						<a-radio-button label="default">默认</a-radio-button>
						<a-radio-button label="button">按钮</a-radio-button>
					</a-radio-group>
				</a-form-item>
				<a-form-item v-if="activeData['active-color'] !== undefined" label="开启颜色">
					<a-color-picker v-model="activeData['active-color']" />
				</a-form-item>
				<a-form-item v-if="activeData['inactive-color'] !== undefined" label="关闭颜色">
					<a-color-picker v-model="activeData['inactive-color']" />
				</a-form-item>

				<a-form-item v-if="activeData['allow-half'] !== undefined" label="允许半选">
					<a-switch v-model="activeData['allow-half']" />
				</a-form-item>
				<a-form-item v-if="activeData['show-text'] !== undefined" label="辅助文字">
					<a-switch v-model="activeData['show-text']" @change="rateTextChange" />
				</a-form-item>
				<a-form-item v-if="activeData['show-score'] !== undefined" label="显示分数">
					<a-switch v-model="activeData['show-score']" @change="rateScoreChange" />
				</a-form-item>
				<a-form-item v-if="activeData['show-stops'] !== undefined" label="显示间断点">
					<a-switch v-model="activeData['show-stops']" />
				</a-form-item>
				<a-form-item v-if="activeData.range !== undefined" label="范围选择">
					<a-switch v-model="activeData.range" @change="rangeChange" />
				</a-form-item>
				<a-form-item v-if="activeData.border !== undefined && activeData.optionType === 'default'" label="是否带边框">
					<a-switch v-model="activeData.border" />
				</a-form-item>
				<a-form-item v-if="activeData.tag === 'el-color-picker'" label="颜色格式">
					<a-select v-model="activeData['color-format']"
							  placeholder="请选择颜色格式"
							  :style="{ width: '100%' }"
							  @change="colorFormatChange">
						<a-option v-for="(item, index) in colorFormatOptions"
								  :key="index"
								  :label="item.label"
								  :value="item.value"/>
					</a-select>
				</a-form-item>
				<a-form-item v-if="activeData.size !== undefined && (activeData.optionType === 'button' || activeData.border || activeData.tag === 'el-color-picker')"
							 label="选项尺寸">
					<a-radio-group v-model="activeData.size">
						<a-radio-button label="medium">中等</a-radio-button>
						<a-radio-button label="small">较小</a-radio-button>
						<a-radio-button label="mini">迷你</a-radio-button>
					</a-radio-group>
				</a-form-item>
				<a-form-item v-if="activeData.tag === 'a-input-number'" label="严格步数">
					<a-switch v-model="activeData['step-strictly']" />
				</a-form-item>
				<a-form-item v-if="activeData.tag === 'a-cascader'" label="是否多选">
					<a-switch v-model="activeData.props.props.multiple" />
				</a-form-item>
				<a-form-item v-if="activeData.tag === 'a-cascader'" label="展示全路径">
					<a-switch v-model="activeData['show-all-levels']" />
				</a-form-item>
				<a-form-item v-if="activeData.tag === 'a-cascader'" label="可否筛选">
					<a-switch v-model="activeData.filterable" />
				</a-form-item>
				<a-form-item v-if="activeData.allowClear !== undefined" label="能否清空">
					<a-switch v-model="activeData.allowClear" />
				</a-form-item>
				<a-form-item v-if="activeData.showTip !== undefined" label="显示提示">
					<a-switch v-model="activeData.showTip" />
				</a-form-item>
				<a-form-item v-if="activeData.multiple !== undefined" label="多选文件">
					<a-switch v-model="activeData.multiple" />
				</a-form-item>
				<a-form-item v-if="activeData['auto-upload'] !== undefined" label="自动上传">
					<a-switch v-model="activeData['auto-upload']" />
				</a-form-item>
				<a-form-item v-if="activeData.readOnly !== undefined" label="是否只读">
					<a-switch v-model="activeData.readOnly" />
				</a-form-item>
				<a-form-item v-if="activeData.disabled !== undefined" label="是否禁用">
					<a-switch v-model="activeData.disabled" />
				</a-form-item>
				<a-form-item v-if="activeData.tag === 'a-select'" label="是否可搜索">
					<a-switch v-model="activeData.filterable" />
				</a-form-item>
				<a-form-item v-if="activeData.tag === 'a-select'" label="是否多选">
					<a-switch v-model="activeData.multiple" @change="multipleChange" />
				</a-form-item>

				<template v-if="activeData.layoutTree">
					<a-divider>布局结构树</a-divider>
					<a-tree :data="[activeData]" :props="layoutTreeProps"
						node-key="renderKey" default-expand-all draggable>
					  <span slot-scope="{ node, data }">
						<span class="node-label">
						  {{ node.label }}
						</span>
					  </span>
					</a-tree>
				</template>

				<template v-if="activeData.layout === 'colFormItem' && activeData.tag !== 'a-button'">
					<a-divider>正则校验</a-divider>
					<div v-for="(item, index) in activeData.regList" :key="index" class="reg-item">
						  <span class="close-btn" @click="activeData.regList.splice(index, 1)">
							<i class="el-icon-close" />
						  </span>
						<a-form-item label="表达式">
							<a-input v-model="item.pattern" placeholder="请输入正则" />
						</a-form-item>
						<a-form-item label="错误提示" style="margin-bottom:0">
							<a-input v-model="item.message" placeholder="请输入错误提示" />
						</a-form-item>
					</div>
					<div style="margin-left: 20px">
						<a-button icon="el-icon-circle-plus-outline" type="text" @click="addReg">添加规则</a-button>
					</div>
				</template>
			</a-form>
			<!-- 表单属性 -->
			<a-form v-show="currentTab === 'form'" class="form-box" size="small" label-width="90px">
					<a-form-item label="表单名">
						<a-input v-model="formConf.formRef" placeholder="请输入表单名（ref）" />
					</a-form-item>
					<a-form-item label="表单模型">
						<a-input v-model="formConf.formModel" placeholder="请输入数据模型" />
					</a-form-item>
					<a-form-item label="校验模型">
						<a-input v-model="formConf.formRules" placeholder="请输入校验模型" />
					</a-form-item>
					<a-form-item label="表单尺寸">
						<a-radio-group v-model="formConf.size">
							<a-radio-button label="medium">
								中等
							</a-radio-button>
							<a-radio-button label="small">
								较小
							</a-radio-button>
							<a-radio-button label="mini">
								迷你
							</a-radio-button>
						</a-radio-group>
					</a-form-item>
					<a-form-item label="标签对齐">
						<a-radio-group v-model="formConf.labelPosition">
							<a-radio-button label="left">
								左对齐
							</a-radio-button>
							<a-radio-button label="right">
								右对齐
							</a-radio-button>
							<a-radio-button label="top">
								顶部对齐
							</a-radio-button>
						</a-radio-group>
					</a-form-item>
					<a-form-item label="标签宽度">
						<a-input-number v-model="formConf.labelWidth" placeholder="标签宽度" />
					</a-form-item>
					<a-form-item label="栅格间隔">
						<a-input-number v-model="formConf.gutter" :min="0" placeholder="栅格间隔" />
					</a-form-item>
					<a-form-item label="禁用表单">
						<a-switch v-model="formConf.disabled" />
					</a-form-item>
					<a-form-item label="表单按钮">
						<a-switch v-model="formConf.formBtns" />
					</a-form-item>
					<a-form-item label="显示未选中组件边框">
						<a-switch v-model="formConf.unFocusedComponentBorder" />
					</a-form-item>
				</a-form>
		</div>

		<!-- <treeNode-dialog :visible.sync="dialogVisible" title="添加选项" @commit="addNode" /> -->
		<!--弹窗-->
		<iconModal ref="iconModal" :key="iconsVisible" @callback="setIcon"/>
	</div>
</template>

<script>
import { isArray } from 'util'
import draggable from 'vuedraggable'
import { isNumberStr } from './index'
import {
	inputComponents,
	selectComponents,
	layoutComponents
} from './config'
import iconModal from "@/views/page/system/menu/iconModal";

const dateTimeFormat = {
	date: 'yyyy-MM-dd',
	week: 'yyyy 第 WW 周',
	month: 'yyyy-MM',
	year: 'yyyy',
	datetime: 'yyyy-MM-dd HH:mm:ss',
	daterange: 'yyyy-MM-dd',
	monthrange: 'yyyy-MM',
	datetimerange: 'yyyy-MM-dd HH:mm:ss'
}

export default {
	components: {
		draggable,iconModal
	},
	props: ['showField', 'activeData', 'formConf'],
	data() {
		return {
			currentTab: 'field',
			currentNode: null,
			dialogVisible: false,
			iconsVisible: false,
			dateTypeOptions: [
				{
					label: '日(date)',
					value: 'date'
				},
				{
					label: '周(week)',
					value: 'week'
				},
				{
					label: '月(month)',
					value: 'month'
				},
				{
					label: '年(year)',
					value: 'year'
				},
				{
					label: '日期时间(datetime)',
					value: 'datetime'
				}
			],
			dateRangeTypeOptions: [
				{
					label: '日期范围(daterange)',
					value: 'daterange'
				},
				{
					label: '月范围(monthrange)',
					value: 'monthrange'
				},
				{
					label: '日期时间范围(datetimerange)',
					value: 'datetimerange'
				}
			],
			colorFormatOptions: [
				{
					label: 'hex',
					value: 'hex'
				},
				{
					label: 'rgb',
					value: 'rgb'
				},
				{
					label: 'rgba',
					value: 'rgba'
				},
				{
					label: 'hsv',
					value: 'hsv'
				},
				{
					label: 'hsl',
					value: 'hsl'
				}
			],
			justifyOptions: [
				{
					label: 'start',
					value: 'start'
				},
				{
					label: 'end',
					value: 'end'
				},
				{
					label: 'center',
					value: 'center'
				},
				{
					label: 'space-around',
					value: 'space-around'
				},
				{
					label: 'space-between',
					value: 'space-between'
				}
			],
			layoutTreeProps: {
				label(data, node) {
					return data.componentName || `${data.label}: ${data.vModel}`
				}
			}
		}
	},
	computed: {
		dateOptions() {
			if (
				this.activeData.type !== undefined
				&& this.activeData.tag === 'el-date-picker'
			) {
				if (this.activeData['start-placeholder'] === undefined) {
					return this.dateTypeOptions
				}
				return this.dateRangeTypeOptions
			}
			return []
		},
		tagList() {
			return [
				{
					label: '输入型组件',
					options: inputComponents
				},
				{
					label: '选择型组件',
					options: selectComponents
				}
			]
		}
	},
	methods: {
		addReg() {
			this.activeData.regList.push({
				pattern: '',
				message: ''
			})
		},
		addSelectItem() {
			this.activeData.options.push({
				label: '',
				value: ''
			})
		},
		addTreeItem() {
			++this.idGlobal
			this.dialogVisible = true
			this.currentNode = this.activeData.options
		},
		renderContent(h, { node, data, store }) {
			return (
				<div class="custom-tree-node">
				<span>{node.label}</span>
				<span class="node-operation">
				<i on-click={() => this.append(data)}
		class="el-icon-plus"
			title="添加"
				></i>
				<i on-click={() => this.remove(node, data)}
		class="el-icon-delete"
			title="删除"
				></i>
				</span>
				</div>
		)
		},
		append(data) {
			if (!data.children) {
				this.$set(data, 'children', [])
			}
			this.dialogVisible = true
			this.currentNode = data.children
		},
		remove(node, data) {
			const { parent } = node
			const children = parent.data.children || parent.data
			const index = children.findIndex(d => d.id === data.id)
			children.splice(index, 1)
		},
		addNode(data) {
			this.currentNode.push(data)
		},
		setOptionValue(item, val) {
			item.value = isNumberStr(val) ? +val : val
		},
		setDefaultValue(val) {
			if (Array.isArray(val)) {
				return val.join(',')
			}
			if (['string', 'number'].indexOf(val) > -1) {
				return val
			}
			if (typeof val === 'boolean') {
				return `${val}`
			}
			return val
		},
		onDefaultValueInput(v) {
			let str = v.data;
			console.log(v, str)
			if (isArray(this.activeData.defaultValue)) {
				// 数组
				this.$set(
					this.activeData,
					'defaultValue',
					str.split(',').map(val => (isNumberStr(val) ? +val : val))
				)
			} else if (['true', 'false'].indexOf(str) > -1) {
				// 布尔
				this.$set(this.activeData, 'defaultValue', JSON.parse(str))
			} else {
				// 字符串和数字
				this.$set(
					this.activeData,
					'defaultValue',
					isNumberStr(str) ? +str : str
				)
			}
		},
		onSwitchValueInput(val, name) {
			if (['true', 'false'].indexOf(val) > -1) {
				this.$set(this.activeData, name, JSON.parse(val))
			} else {
				this.$set(this.activeData, name, isNumberStr(val) ? +val : val)
			}
		},
		setTimeValue(val, type) {
			const valueFormat = type === 'week' ? dateTimeFormat.date : val
			this.$set(this.activeData, 'defaultValue', null)
			this.$set(this.activeData, 'value-format', valueFormat)
			this.$set(this.activeData, 'format', val)
		},
		spanChange(val) {
			this.formConf.span = val
		},
		multipleChange(val) {
			this.$set(this.activeData, 'defaultValue', val ? [] : '')
		},
		dateTypeChange(val) {
			this.setTimeValue(dateTimeFormat[val], val)
		},
		rangeChange(val) {
			this.$set(
				this.activeData,
				'defaultValue',
				val ? [this.activeData.min, this.activeData.max] : this.activeData.min
			)
		},
		rateTextChange(val) {
			if (val) this.activeData['show-score'] = false
		},
		rateScoreChange(val) {
			if (val) this.activeData['show-text'] = false
		},
		colorFormatChange(val) {
			this.activeData.defaultValue = null
			this.activeData['show-alpha'] = val.indexOf('a') > -1
			this.activeData.renderKey = +new Date() // 更新renderKey,重新渲染该组件
		},
		openIconsDialog(model) {
			this.iconsVisible = new Date().getTime();
			this.$nextTick(()=>{
				this.$refs.iconModal.openModal(this.activeData[model], model)
			})
		},
		setIcon(v) {
			this.activeData[v.key] = v.data
		},
		tagChange(tagIcon) {
			let target = inputComponents.find(item => item.tagIcon === tagIcon)
			if (!target) target = selectComponents.find(item => item.tagIcon === tagIcon)
			this.$emit('tag-change', target)
		}
	}
}
</script>

<style lang="less" scoped>
.right-board {
	/*width: 250px;*/
	/*position: absolute;*/
	right: 0;
	top: 0;
	padding-top: 3px;
	.field-box {
		position: relative;
		height: calc(90vh - 60px);
		box-sizing: border-box;
		overflow: hidden;
		.form-box{
			overflow-y: auto;
			height: calc(90vh - 60px);
		}
	}
}
.select-item {
	display: flex;
	border: 1px dashed #fff;
	box-sizing: border-box;
	& .close-btn {
		cursor: pointer;
		color: #f56c6c;
	}
	& .a-input + .a-input {
		margin-left: 4px;
	}
}
.select-item + .select-item {
	margin-top: 4px;
}
.select-item.sortable-chosen {
	border: 1px dashed #409eff;
}
.select-line-icon {
	line-height: 32px;
	font-size: 22px;
	padding: 0 4px;
	color: #777;
}
.option-drag {
	cursor: move;
}
.time-range {
	.el-date-editor {
		width: 227px;
	}
	::v-deep .el-icon-time {
		display: none;
	}
}
.document-link {
	position: absolute;
	display: block;
	width: 26px;
	height: 26px;
	top: 0;
	left: 0;
	cursor: pointer;
	background: #409eff;
	z-index: 1;
	border-radius: 0 0 6px 0;
	text-align: center;
	line-height: 26px;
	color: #fff;
	font-size: 18px;
}
.node-label{
	font-size: 14px;
}
.node-icon{
	color: #bebfc3;
}
</style>
