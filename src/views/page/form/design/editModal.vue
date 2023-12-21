<template>
	<a-modal title="表单设计" dialogClass="modal_a" width="100%" centered :maskClosable="false"
			 :visible="visible" @cancel="closeModal" :footer="null">
		<div class="main">
			<div class="left">
				<div class="components-list">
					<div class="components-title">输入型组件</div>
					<draggable class="components-draggable"
							   :list="inputComponents"
							   :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
							   :sort="false"
							   draggable=".components-item"
							   :clone="cloneComponent"
							   @end="onEnd">
						<div class="components-item" v-for="(element, index) in inputComponents" :key="index"
							  @click="addComponent(element)">
							<div class="components-body">
								<svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
									<path :d="svgData[element.tagIcon]" fill="#32373B"></path>
								</svg>
								{{ element.label }}
							</div>
						</div>
					</draggable>

					<div class="components-title">选择型组件</div>
					<draggable class="components-draggable"
							   :list="selectComponents"
							   :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
							   :clone="cloneComponent"
							   draggable=".components-item"
							   :sort="false"
							   @end="onEnd">
						<div v-for="(element, index) in selectComponents" :key="index"
							 class="components-item" @click="addComponent(element)">
							<div class="components-body">
								<svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
									<path :d="svgData[element.tagIcon]" fill="#32373B"></path>
								</svg>
								{{ element.label }}
							</div>
						</div>
					</draggable>

					<div class="components-title">布局型组件</div>
					<draggable class="components-draggable"
							   :list="layoutComponents"
							   :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
							   :clone="cloneComponent"
							   draggable=".components-item"
							   :sort="false"
							   @end="onEnd">
						<div v-for="(element, index) in layoutComponents" :key="index"
							 class="components-item" @click="addComponent(element)">
							<div class="components-body">
								<svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
									<path :d="svgData[element.tagIcon]" fill="#32373B"></path>
								</svg>
								{{ element.label }}
							</div>
						</div>
					</draggable>
				</div>
			</div>
			<div class="center">
				<div class="options">
					<span @click="copy">复制代码</span>
					<span @click="empty">清空</span>
				</div>
				<div class="centerMain">
					<a-row class="center-board-row" :gutter="formConf.gutter">
						<a-form :size="formConf.size"
								:disabled="formConf.disabled"
								:labelAlign="formConf.labelAlign"
								:label-width="formConf.labelWidth + 'px'">
							<div v-show="!drawingList.length" class="empty-info">
								从左侧拖入或点选组件进行表单设计
							</div>
							<draggable class="drawing-board"
									   :list="drawingList"
									   :animation="340"
									   group="componentsGroup">
								<draggable-item
									v-for="(element, index) in drawingList"
									:key="element.renderKey"
									:drawing-list="drawingList"
									:element="element"
									:index="index"
									:active-id="activeId"
									:form-conf="formConf"
									@activeItem="activeFormItem"
									@copyItem="drawingItemCopy"
									@deleteItem="drawingItemDelete"
								/>
							</draggable>
						</a-form>
					</a-row>
				</div>
			</div>
			<div class="right">
				<right-panel v-if="activeData" :active-data="activeData" :form-conf="formConf"
							 :show-field="!!drawingList.length" @tag-change="tagChange" />
			</div>
			<input id="copyNode" type="hidden">
		</div>
	</a-modal>
</template>

<script>
import form_model from "@/component/form/form_model";
import ClipboardJS from 'clipboard'
import draggable from "vuedraggable";
import beautifier from 'js-beautify'
import saveAs from "file-saver"
import CodeTypeDialog from "./generator/CodeTypeDialog"
import DraggableItem from "./generator/DraggableItem.vue";
import RightPanel from "./generator/RightPanel.vue"
import { makeUpHtml, vueTemplate, vueScript, cssStyle } from './generator/html.js'
import { makeUpJs } from './generator/js.js'
import { makeUpCss } from './generator/css.js'

import {
	inputComponents,
	selectComponents,
	layoutComponents,
	formConf,
	drawingList,
} from "./generator/config";

let tempActiveData;
let svgData={
	input:"M118.784 727.04h778.24v-430.08h-778.24v430.08z m-40.96-471.04h860.16v512h-860.16v-512z m116.736 153.6v204.8c0 12.288 8.192 20.48 20.48 20.48s20.48-8.192 20.48-20.48v-204.8c0-12.288-8.192-20.48-20.48-20.48s-20.48 8.192-20.48 20.48z",
	textarea:"M118.784 778.24h778.24v-532.48h-778.24v532.48z m-40.96-573.44h860.16v614.4h-860.16v-614.4z m778.24 409.6l-122.88 122.88h122.88v-122.88zM194.56 358.4v204.8c0 12.288 8.192 20.48 20.48 20.48s20.48-8.192 20.48-20.48v-204.8c0-12.288-8.192-20.48-20.48-20.48s-20.48 8.192-20.48 20.48z",
	password:"M869.012601 642.85835c12.107759 0 21.912056-10.031471 21.912056-22.38687l0-196.638519c0-46.985104-37.273928-85.09405-83.262332-85.09405l-75.425853 0c-0.022513-0.021489-0.022513-0.067538-0.047072-0.089028l-7.858992 0 0-62.188364c0-103.028515-81.636299-186.584536-182.363398-186.584536l-36.479843 0c-100.045577 0-181.165106 82.449827-182.2713 184.529737 0 0.181125-0.11154 0.316202-0.11154 0.497327 0 0.113587 0.065492 0.203638 0.065492 0.315178 0 0.407276-0.065492 0.814552-0.065492 1.242294l0.316202 0c0.858554 12.132318 10.704806 21.799492 23.040762 21.799492 12.377912 0 22.204721-9.667174 23.037692-21.799492l0.227174 0c3.479241-77.863369 63.339584-139.938146 136.844691-139.938146l34.290991 0c75.765591 0 137.184429 65.825195 137.184429 147.031705l0 55.095829 34.108842 0c0 0.021489 0 0.067538 0.023536 0.089028L355.676164 338.739934c0-0.021489 0.021489-0.067538 0.045025-0.089028l-49.334615 0c-0.022513 0.021489-0.045025 0.067538-0.045025 0.089028l-95.483678 0c-45.99045 0-83.263355 38.108946-83.263355 85.09405l0 422.777933c0 46.984081 37.272905 85.070514 83.263355 85.070514l596.804455 0c45.988404 0 83.262332-38.086433 83.262332-85.070514l0-24.599258c-0.047072-12.311397-9.850345-22.295795-21.912056-22.295795s-21.842471 9.984399-21.913079 22.295795l0 0.066515c0 0.021489 0 0.021489 0 0.046049 0 0 0 0.046049 0 0.066515l0 19.946284c0 24.733311-19.6045 44.771693-43.820018 44.771693L215.238644 886.909715c-24.216541 0-43.821041-20.038382-43.821041-44.771693L171.417603 428.306856c0-24.736381 19.6045-44.771693 43.821041-44.771693L803.278481 383.535163c24.215518 0 43.820018 20.036335 43.820018 44.771693l0 192.164624C847.099523 632.826879 856.904843 642.85835 869.012601 642.85835zM517.142625 647.328152l-31.601742 0c-4.38282 0-7.885598 3.569292-7.885598 7.972579l0 95.510284c0 4.40431 3.524267 7.951089 7.885598 7.951089l31.601742 0c0.947582 0 1.807159-0.227174 2.620687-0.541329 64.87659-5.399987 115.860774-60.043514 115.880217-126.791731 0-70.344115-56.607252-127.35762-126.404921-127.35762-66.234517 0-120.491235 51.365878-125.866662 116.736725-0.273223 0.837064-0.497327 1.699712-0.497327 2.64627l0 31.847336c0 4.406356 3.523243 7.954159 7.882528 7.954159l31.602765 0c4.359284 0 7.904017-3.548826 7.904017-7.954159l0-7.972579c-1.036609-5.149277 0-10.434653 0-15.900132 0-43.9817 35.353183-79.606059 78.974679-79.606059 43.640939 0 78.992075 35.623335 78.992075 79.606059 0 38.489616-27.130917 70.612221-63.204507 77.998445l0-54.125735C525.026176 650.897444 521.502933 647.328152 517.142625 647.328152z",
	number:"M248.016763 312.008875a160.043387 160.043387 0 0 1-37.865154 45.816837 265.056083 265.056083 0 0 1-63.865895 41.65167l-7.320596 3.407864v70.176753l17.291754-6.058424a329.048194 329.048194 0 0 0 50.486873-25.243437c8.835203-5.174904 16.913102-10.476026 24.233699-15.650931v277.29915h70.807839V304.940712h-50.234439zM492.247011 631.085912c7.320597-7.699248 25.243436-23.097744 51.749045-45.816838a770.682115 770.682115 0 0 0 71.691359-66.642672 181.87896 181.87896 0 0 0 31.80673-49.098484 124.450142 124.450142 0 0 0 10.097375-48.846049 109.556514 109.556514 0 0 0-35.088377-82.546038 130.003698 130.003698 0 0 0-93.400715-33.195119 136.062123 136.062123 0 0 0-92.643412 30.670776 127.353137 127.353137 0 0 0-40.515715 88.352027l-1.135955 12.621719 73.079749 7.573031v-13.883891a62.225071 62.225071 0 0 1 16.282016-45.943054 58.564773 58.564773 0 0 1 43.797363-16.155799 57.428818 57.428818 0 0 1 41.904104 15.146062 48.593615 48.593615 0 0 1 15.524714 36.602983A82.798472 82.798472 0 0 1 566.588931 467.003575a496.538395 496.538395 0 0 1-79.643042 76.487612 487.324541 487.324541 0 0 0-61.34155 57.807469 181.500308 181.500308 0 0 0-32.185382 53.137434 92.390977 92.390977 0 0 0-6.184642 36.602983v12.621718h270.862074v-69.41945H488.460496zM929.841982 513.32528a93.400715 93.400715 0 0 0-32.185381-26.758042 89.614199 89.614199 0 0 0 19.816097-21.709356 90.623937 90.623937 0 0 0 15.019845-50.486873 104.507827 104.507827 0 0 0-15.398496-54.399605 107.537039 107.537039 0 0 0-44.302231-40.389498 133.790213 133.790213 0 0 0-61.720203-14.388759 122.178232 122.178232 0 0 0-81.914951 28.272649 129.877481 129.877481 0 0 0-42.282756 78.38087l-2.271909 12.621718 70.807839 12.621718 2.019475-12.621718a72.322445 72.322445 0 0 1 18.932577-42.913842 49.603353 49.603353 0 0 1 35.719463-13.379021 47.836312 47.836312 0 0 1 35.088377 12.621718 42.913842 42.913842 0 0 1 12.621718 32.437816 39.379761 39.379761 0 0 1-17.544189 36.350548 81.157648 81.157648 0 0 1-45.564402 12.621719h-5.932208l-12.621718-1.388389-8.204117 70.934056 18.175274-4.796253a119.527672 119.527672 0 0 1 28.903735-4.543818 58.69099 58.69099 0 0 1 43.418711 16.660668 57.681252 57.681252 0 0 1 16.786885 42.913842 62.351288 62.351288 0 0 1-18.932577 46.321705 60.710465 60.710465 0 0 1-45.438186 18.680143 53.011217 53.011217 0 0 1-37.865155-13.88389 88.352028 88.352028 0 0 1-22.84531-49.098483l-2.398126-11.485764-69.41945 9.213854 1.262171 12.621718a124.828793 124.828793 0 0 0 40.894367 83.681992 129.246395 129.246395 0 0 0 89.740417 32.437816 137.702946 137.702946 0 0 0 98.449402-37.865155A122.30445 122.30445 0 0 0 950.667817 580.599039a108.546777 108.546777 0 0 0-20.825835-67.273759z",
	select:"M242.048 170.666667h535.466667c39.381333 0 71.338667 32 71.338666 71.381333v535.466667c0 39.381333-31.957333 71.338667-71.381333 71.338666H242.048C202.666667 848.853333 170.666667 816.896 170.666667 777.472V242.048C170.666667 202.666667 202.666667 170.666667 242.048 170.666667z m0 49.962666a21.418667 21.418667 0 0 0-21.418667 21.418667v535.466667c0 11.776 9.6 21.376 21.418667 21.376h535.466667a21.418667 21.418667 0 0 0 21.376-21.418667V242.048a21.418667 21.418667 0 0 0-21.418667-21.418667H242.048z m92.970667 169.557334l174.122666 185.813333 174.293334-185.856a21.333333 21.333333 0 0 1 32.938666 1.28 29.354667 29.354667 0 0 1-1.152 37.674667s-191.146667 203.733333-191.573333 204.117333a21.077333 21.077333 0 0 1-30.421333-1.365333l-190.037334-202.752a29.397333 29.397333 0 0 1-0.938666-37.418667 21.333333 21.333333 0 0 1 32.768-1.493333z",
	cascader:"M832.128 219.733333c5.589333 0 10.965333 2.176 14.933333 6.101334A20.693333 20.693333 0 0 1 853.333333 240.64v542.677333a20.778667 20.778667 0 0 1-20.778666 20.778667H191.445333A20.778667 20.778667 0 0 1 170.666667 783.317333V240.512a20.778667 20.778667 0 0 1 20.778666-20.778667h640.682667zM219.989333 268.416v486.997333h217.6V268.373333h-217.6z m584.362667 486.997333V268.373333h-318.08v486.997334h318.08zM367.274667 363.093333a7.808 7.808 0 0 1 0 11.861334L310.357333 418.773333c-4.864 3.669333-11.861333 0.298667-11.861333-5.76V325.333333c0-6.058667 6.997333-9.386667 11.861333-5.76l56.917334 43.52z m173.184 31.957334a12.202667 12.202667 0 0 1-12.16-12.202667v-24.32c0-6.698667 5.461333-12.202667 12.16-12.202667h211.2c6.698667 0 12.202667 5.205333 12.202666 12.202667v24.32a12.202667 12.202667 0 0 1-12.202666 12.202667h-211.2z m0 134.229333a12.202667 12.202667 0 0 1-12.16-12.202667v-24.32c0-6.698667 5.461333-12.202667 12.16-12.202666h211.2c6.698667 0 12.202667 5.205333 12.202666 12.202666v24.32a12.202667 12.202667 0 0 1-12.202666 12.202667h-211.2z m0 133.888a12.202667 12.202667 0 0 1-12.16-12.16v-24.32c0-6.741333 5.461333-12.202667 12.16-12.202667h211.2c6.698667 0 12.202667 5.162667 12.202666 12.16v24.32a12.202667 12.202667 0 0 1-12.202666 12.202667h-211.2z",
	radio:"M512 874.666667a362.666667 362.666667 0 1 1 0-725.333334 362.666667 362.666667 0 0 1 0 725.333334z m-0.597333-48.938667a314.325333 314.325333 0 1 0 0-628.650667 314.325333 314.325333 0 0 0 0 628.650667z m0-72.533333a241.792 241.792 0 1 1 0-483.584 241.792 241.792 0 0 1 0 483.584z m0-48.384a193.408 193.408 0 1 0 0-386.816 193.408 193.408 0 0 0 0 386.816z",
	checkbox:"M896 546.432a64 64 0 0 1 64 64V896a64 64 0 0 1-64 64H610.432a64 64 0 0 1-64-64V610.432a64 64 0 0 1 64-64H896z m-482.432 0a64 64 0 0 1 64 64V896a64 64 0 0 1-64 64H128a64 64 0 0 1-64-64V610.432a64 64 0 0 1 64-64h285.568z m482.432 64H610.432V896H896V610.432z m-482.432 0H128V896h285.568V610.432zM896 64a64 64 0 0 1 64 64v285.568a64 64 0 0 1-64 64H610.432a64 64 0 0 1-64-64V128a64 64 0 0 1 64-64H896z m-395.52 48.64a32 32 0 0 1 6.656 40.384l-3.392 4.736-232.96 269.952a32 32 0 0 1-39.872 7.04l-4.672-3.2-144.832-119.04a32 32 0 0 1 35.84-52.736l4.8 3.2 120.64 99.2 212.608-246.272a32 32 0 0 1 45.12-3.328zM896 128H610.432v285.568H896V128z",
	switch:"M2 512c0-141 114-255 255-255h510c141 0 255 114 255 255S908 767 767 767H257C116 767 2 653 2 512z m255 208.8c115.5 0 208.8-93.2 208.8-208.8S372.5 303.2 257 303.2c-115.5 0-208.8 93.2-208.8 208.8S141.5 720.8 257 720.8z",
	slider:"M122.368 165.888h778.24c-9.216 0-16.384-7.168-16.384-16.384v713.728c0-9.216 7.168-16.384 16.384-16.384h-778.24c9.216 0 16.384 7.168 16.384 16.384V150.016c0 8.192-6.656 15.872-16.384 15.872zM89.6 850.432a46.98 46.98 0 0 0 47.104 47.104h750.08a46.98 46.98 0 0 0 47.104-47.104V162.304a46.98 46.98 0 0 0-47.104-47.104h-750.08A46.98 46.98 0 0 0 89.6 162.304v688.128z m123.904-391.68h52.736v80.896h-52.736z m355.84 0h227.328v80.896H569.344z m-266.24 34.816a115.2 115.2 0 1 0 230.4 0 115.2 115.2 0 1 0-230.4 0z",
	time:"M512 157.538462a354.461538 354.461538 0 1 1 0 708.923076 354.461538 354.461538 0 0 1 0-708.923076z m0 31.507692a322.953846 322.953846 0 1 0 0 645.907692 322.953846 322.953846 0 0 0 0-645.907692z m-39.384615 149.661538a15.753846 15.753846 0 0 1 15.438769 12.603077L488.369231 354.461538l0.118154 184.123077 148.952615 77.587693a15.753846 15.753846 0 0 1 7.876923 18.313846l-1.181538 2.953846a15.753846 15.753846 0 0 1-18.313847 7.876923l-2.953846-1.181538-157.420307-81.99877a15.753846 15.753846 0 0 1-8.073847-10.515692l-0.393846-3.465846L456.861538 354.461538a15.753846 15.753846 0 0 1 15.753847-15.753846z",
	"time-range":"M512 157.538462a354.461538 354.461538 0 1 1 0 708.923076 354.461538 354.461538 0 0 1 0-708.923076z m0 31.507692a322.953846 322.953846 0 1 0 0 645.907692 322.953846 322.953846 0 0 0 0-645.907692z m-39.384615 149.661538a15.753846 15.753846 0 0 1 15.438769 12.603077L488.369231 354.461538l0.118154 184.123077 148.952615 77.587693a15.753846 15.753846 0 0 1 7.876923 18.313846l-1.181538 2.953846a15.753846 15.753846 0 0 1-18.313847 7.876923l-2.953846-1.181538-157.420307-81.99877a15.753846 15.753846 0 0 1-8.073847-10.515692l-0.393846-3.465846L456.861538 354.461538a15.753846 15.753846 0 0 1 15.753847-15.753846z",
	date:"M649.846154 161.476923a15.753846 15.753846 0 0 1 15.438769 12.603077l0.315077 3.150769-0.039385 59.076923H787.692308a78.769231 78.769231 0 0 1 78.76923 78.769231v472.615385a78.769231 78.769231 0 0 1-78.76923 78.76923H236.307692a78.769231 78.769231 0 0 1-78.76923-78.76923V315.076923a78.769231 78.769231 0 0 1 78.76923-78.769231h161.437539l0.039384-59.076923a15.753846 15.753846 0 0 1 31.192616-3.150769l0.315077 3.150769-0.039385 59.076923h204.8l0.039385-59.076923c0-8.664615 7.089231-15.753846 15.753846-15.753846z m185.107692 307.2H189.006769L189.046154 787.692308a47.261538 47.261538 0 0 0 42.417231 47.02523L236.307692 834.953846h551.384616a47.261538 47.261538 0 0 0 47.02523-42.417231L834.953846 787.692308v-319.015385zM397.745231 267.815385H236.307692a47.261538 47.261538 0 0 0-47.02523 42.41723L189.046154 315.076923l-0.039385 122.092308H834.953846V315.076923a47.261538 47.261538 0 0 0-42.417231-47.025231L787.692308 267.815385h-122.131693l0.039385 66.953846a15.753846 15.753846 0 0 1-31.192615 3.150769L634.092308 334.769231l-0.039385-66.953846h-204.8l0.039385 66.953846a15.753846 15.753846 0 0 1-31.192616 3.150769L397.784615 334.769231l-0.039384-66.953846z",
	"range-picker":"M649.846154 161.476923a15.753846 15.753846 0 0 1 15.438769 12.603077l0.315077 3.150769-0.039385 59.076923H787.692308a78.769231 78.769231 0 0 1 78.76923 78.769231v472.615385a78.769231 78.769231 0 0 1-78.76923 78.76923H236.307692a78.769231 78.769231 0 0 1-78.76923-78.76923V315.076923a78.769231 78.769231 0 0 1 78.76923-78.769231h161.437539l0.039384-59.076923a15.753846 15.753846 0 0 1 31.192616-3.150769l0.315077 3.150769-0.039385 59.076923h204.8l0.039385-59.076923c0-8.664615 7.089231-15.753846 15.753846-15.753846z m185.107692 307.2H189.006769L189.046154 787.692308a47.261538 47.261538 0 0 0 42.417231 47.02523L236.307692 834.953846h551.384616a47.261538 47.261538 0 0 0 47.02523-42.417231L834.953846 787.692308v-319.015385zM397.745231 267.815385H236.307692a47.261538 47.261538 0 0 0-47.02523 42.41723L189.046154 315.076923l-0.039385 122.092308H834.953846V315.076923a47.261538 47.261538 0 0 0-42.417231-47.025231L787.692308 267.815385h-122.131693l0.039385 66.953846a15.753846 15.753846 0 0 1-31.192615 3.150769L634.092308 334.769231l-0.039385-66.953846h-204.8l0.039385 66.953846a15.753846 15.753846 0 0 1-31.192616 3.150769L397.784615 334.769231l-0.039384-66.953846z",
	upload:"M512 128l184 192H544v448h-64V320H328l184-192z m384 384h-64v320H192V512h-64v384h768V512z",
	rate:"M545.8 786.6l181.9 93.1c8.5 4.2 16.9 4.2 25.4 0s12.7-16.9 8.5-25.4l-33.8-198.8c-4.2-25.4 4.2-50.8 21.2-67.7L892.8 444c8.5-8.5 8.5-16.9 4.2-25.4s-12.7-16.9-21.2-16.9l-203-29.6c-25.4-4.2-46.5-16.9-55-42.3L529 147.9c-4.2-8.5-12.7-12.7-21.2-12.7s-16.9 4.2-21.2 12.7L401.9 334c-12.7 21.2-33.8 38.1-59.2 42.3l-198.8 29.6c-8.5 0-16.9 8.5-21.2 16.9-4.2 8.5 0 16.9 4.2 25.4L270.8 592c16.9 16.9 25.4 42.3 21.2 67.7l-33.8 198.8c0 8.5 4.2 16.9 8.5 25.4 4.2 8.5 16.9 4.2 25.4 0L474 790.8c25.2-16.9 50.6-16.9 71.8-4.2zM313.6 943.7c-26.5 13.2-57.3 13.2-83.8-4.4-22-17.6-35.3-48.5-30.9-75l35.3-207.2c0-8.8 0-17.6-8.8-22L75.5 480.7c-17.6-22-26.5-52.9-17.6-79.4s35.3-48.5 61.7-52.9l211.6-30.9c8.8 0 17.6-4.4 17.6-13.2l92.6-189.6c13.2-26.5 39.7-44.1 70.5-44.1s57.3 17.6 70.5 44.1L675 304.3c4.4 8.8 13.2 13.2 17.6 13.2l211.6 30.9c30.9 4.4 52.9 26.5 61.7 52.9 8.8 26.5 0 57.3-17.6 79.4L798.6 630.6c-4.4 4.4-8.8 13.2-8.8 22L825 859.9c4.4 30.9-8.8 57.3-30.9 75-22 17.6-57.3 17.6-83.8 4.4l-189.6-97c-8.8-4.4-17.6-4.4-22 0L313.6 943.7z",
	color:"M839.40092 381.955739L383.33938 61.770634c-9.482682-6.656598-22.56547-4.36693-29.223267 5.114552-6.656598 9.481481-4.36693 22.56547 5.115752 29.223267l29.558077 20.751016L68.604837 572.921009c-5.950977 8.475852-4.734141 19.817388 2.36047 26.885598a21.071426 21.071426 0 0 0 3.288097 2.863285l403.390776 283.207207a20.951422 20.951422 0 0 0 4.736541 4.604537c9.481481 6.656598 22.56427 4.36693 29.222067-5.115752l332.911484-474.189277c6.657798-9.480281 4.36813-22.56307-5.113352-29.220868zM489.921745 843.235034L114.923812 579.961618l374.997933 263.273416 105.186722-149.824448-105.186722 149.824448z m179.954942-256.32281c-0.0072-0.0072-145.981934-143.15225-540.082034-28.132435L423.126562 140.968185l374.997932 263.272216-128.247807 182.671823zM852.89292 430.246373s-70.7265 79.779568 0 175.765618c0 0 111.560112-57.349703 0-175.765618z",
	button:"M800 256h-64a32 32 0 0 0-31.84-32H159.84C142.4 224 128 238.432 128 256.224v415.552A32 32 0 0 0 159.84 704H160v64H128c-35.328 0-64-28.48-64-63.904V223.904C64 188.608 92.864 160 128 160h608c35.328 0 64 28.48 64 63.904V256zM192 351.84A64 64 0 0 1 256.16 288h639.68A64 64 0 0 1 960 351.84v448.32A64 64 0 0 1 895.84 864H256.16A64 64 0 0 1 192 800.16v-448.32z m64 32.384v383.552A31.968 31.968 0 0 0 287.744 800h576.512c17.184 0 31.744-14.4 31.744-32.224V384.224A31.968 31.968 0 0 0 864.256 352H287.744C270.56 352 256 366.4 256 384.224z m219.232 238.4c0 12.16-1.92 23.168-5.76 32.96-3.808 9.792-9.12 18.048-15.872 24.8-6.752 6.72-14.592 11.904-23.52 15.488a76.064 76.064 0 0 1-28.576 5.344H320V448h72.384c8.576 0 16.64 1.6 24.192 4.768 7.552 3.2 14.24 7.616 20.128 13.28 5.856 5.696 10.464 12.704 13.856 21.056a73.824 73.824 0 0 1 3.872 39.872c-0.768 4.256-1.92 8.288-3.36 12.128-1.472 3.84-3.328 7.328-5.6 10.496a27.776 27.776 0 0 1-7.776 7.552c4.512 1.6 9.024 4.48 13.536 8.736 4.48 4.224 8.576 9.28 12.16 15.072a80.736 80.736 0 0 1 11.84 41.664z m-50.72 0c0-11.104-3.264-19.36-9.824-24.8a33.568 33.568 0 0 0-21.984-8.128h-25.024v65.472h25.024c4.064 0 8-0.64 11.84-1.984a29.184 29.184 0 0 0 10.144-5.952 29.28 29.28 0 0 0 7.104-10.112c1.824-4.096 2.72-8.928 2.72-14.496z m-16.576-103.584c0-9.28-2.432-15.872-7.264-19.84a25.216 25.216 0 0 0-16.416-5.952h-16.576v51.2h16.576c6.08 0 11.552-1.92 16.416-5.76 4.832-3.84 7.264-10.368 7.264-19.648z m166.528-21.824v204h-52.064v-204.384h-65.28V448h182.304v49.216h-64.96zM792.16 704l-78.336-143.424v140.64H661.44V448h42.272l75.904 128v-128H832v256h-39.84z",
	row:"M896 0H128a128 128 0 0 0-128 128v768a128 128 0 0 0 128 128h768a128 128 0 0 0 128-128V128a128 128 0 0 0-128-128zM128 960a64 64 0 0 1-64-64V384h256v576z m832-64a64 64 0 0 1-64 64H384V384h576z m0-576H64V128a64 64 0 0 1 64-64h768a64 64 0 0 1 64 64z",
};
export default {
	name: "edit",
	props: {
		params: Object,
	},
	components: {
		form_model,
		draggable,
		DraggableItem,
		RightPanel,
		CodeTypeDialog,
	},
	computed: {
		routerParams() {
			return this.$route.query;
		},
	},
	data() {
		return {
			visible: false,
			loading: false,
			//
			svgData,
			//
			idGlobal: 100,
			inputComponents,
			selectComponents,
			layoutComponents,
			formConf,
			drawingList,
			activeId: null,
			activeData: null,
			dialogVisible:false,
			showFileName:false,
			generateConf: null,

			labelWidth: 100,
			formData: {},
		}
	},
	methods:{
		openModal(params){
			this.visible = true;
			this.loadData(params.id);
		},
		closeModal(refresh = false){
			this.visible = false;
			if(refresh){
				this.$emit("callback", {refresh})
			}
		},
		loadData(id){
			let that = this;
			if(id){
			} else{
			}
		},
		// 提交
		onSubmit(validate){
		},
		// 组件
		activeFormItem(element) {
			this.activeData = element;
			this.activeId = element.formId;
		},
		onEnd(obj, a) {
			if (obj.from !== obj.to) {
				this.activeData = tempActiveData;
				this.activeId = this.idGlobal;
			}
		},
		drawingItemDelete(index, parent) {
			parent.splice(index, 1);
			this.$nextTick(() => {
				const len = this.drawingList.length;
				if (len) {
					this.activeFormItem(this.drawingList[len - 1]);
				}
			});
		},
		addComponent(item) {
			const clone = this.cloneComponent(item);
			console.log(clone,88)
			this.drawingList.push(clone);
			this.activeFormItem(clone);
		},
		drawingItemCopy(item, parent) {
			let clone = JSON.parse(JSON.stringify(item));
			clone = this.createIdAndKey(clone);
			parent.push(clone);
			this.activeFormItem(clone);
		},
		createIdAndKey(item) {
			item.formId = ++this.idGlobal;
			item.renderKey = +new Date();
			if (item.layout === "colFormItem") {
				item.vModel = `field${this.idGlobal}`;
			} else if (item.layout === "rowFormItem") {
				item.componentName = `row${this.idGlobal}`;
			}
			if (Array.isArray(item.children)) {
				item.children = item.children.map((childItem) =>
					this.createIdAndKey(childItem)
				);
			}
			return item;
		},
		cloneComponent(origin) {
			console.log(origin);
			const clone = JSON.parse(JSON.stringify(origin));
			clone.formId = ++this.idGlobal;
			clone.span = formConf.span;
			clone.renderKey = +new Date(); // 改变renderKey后可以实现强制更新组件
			if (!clone.layout) clone.layout = "colFormItem";
			clone.placeholder !== undefined && (clone.placeholder += clone.label);
			if (clone.layout === "colFormItem") {
				clone.vModel = `field${this.idGlobal}`;
				tempActiveData = clone;
			} else if (clone.layout === "rowFormItem") {
				delete clone.label;
				clone.componentName = `row${this.idGlobal}`;
				clone.gutter = this.formConf.gutter;
				tempActiveData = clone;
			}
			return tempActiveData;
		},
		empty(){
			let self_ = this;
			this.$util.modal(this).confirm('操作提示', '确定要清空所有组件吗？', function () {
				self_.drawingList = []
			})
		},
		tagChange(newTag) {
			newTag = this.cloneComponent(newTag)
			newTag.vModel = this.activeData.vModel
			newTag.formId = this.activeId
			newTag.span = this.activeData.span
			delete this.activeData.tag
			delete this.activeData.tagIcon
			delete this.activeData.document
			Object.keys(newTag).forEach(key => {
				if (this.activeData[key] !== undefined
					&& typeof this.activeData[key] === typeof newTag[key]) {
					newTag[key] = this.activeData[key]
				}
			})
			this.activeData = newTag
			this.updateDrawingList(newTag, this.drawingList)
		},
		updateDrawingList(newTag, list) {
			const index = list.findIndex(item => item.formId === this.activeId)
			if (index > -1) {
				list.splice(index, 1, newTag)
			} else {
				list.forEach(item => {
					if (Array.isArray(item.children)) this.updateDrawingList(newTag, item.children)
				})
			}
		},
		AssembleFormData() {
			this.formData = {
				fields: JSON.parse(JSON.stringify(this.drawingList)),
				...this.formConf
			}
		},
		copy() {
			this.dialogVisible = true
			this.showFileName = false
			this.operationType = 'copy'
		},
		titleCase(str) {
			return str.replace(/( |^)[a-z]/g, L => L.toUpperCase())
		},
	}
}
</script>

<style lang="less">
* {
	padding: 0;
	margin: 0;
}
.main {
	display: flex;
	.left {
		border: 1px solid #ccc;
		width: 20%;
		height: 90vh;
		overflow-y: auto;
		padding: 10px;
		box-sizing: border-box;
		.components-title {
			margin-bottom: 20px;
		}
		.components-draggable {
			margin-bottom: 20px;
			display: flex;
			flex-wrap: wrap;
			text-align: left;
			.components-item {
				width: 48%;
				margin: 2% 1%;
				.components-body {
					border: 1px solid #d0e0ef;
					display: inline-block;
					width: 100%;
					/*height: 100%;*/
					border-radius: 2px;
					color: #73879a;
					padding: 0px 0 0px 4px;
					background: #f3f6fa;
					line-height: 30px;
					font-size: 14px;
					cursor: move;
					&:hover {
						border: 1px dashed #787be8;
						color: #787be8;
					}
					.icon {
						vertical-align: middle;
						display: inline-block;
						width: 20px;
					}
				}
			}
		}
	}
	.center {
		width: 56%;
		margin: 0 2%;
		border: 1px solid #ccc;
		box-sizing: border-box;
		.options {
			display: flex;
			border-bottom: 1px solid #ccc;
			padding: 10px;
			span {
				margin-right: 20px;
				cursor: pointer;
			}
		}

		.centerMain {
			/*overflow-x: auto;*/
			height: calc(90vh - 42px);
			.center-scrollbar {
				height: calc(100vh - 42px);
				overflow: hidden;
				padding: 10px;
				box-sizing: border-box;
				.empty-info {
					text-align: center;
					// line-height: calc(100vh - 100px);
				}
			}
		}
		.drawing-item,
		.drawing-row-item {
			&:hover {
				& > .a-form-item {
					background: #f6f7ff;
					border-radius: 6px;
				}
				& > .drawing-item-copy,
				& > .drawing-item-delete {
					display: initial;
				}
			}
			& > .drawing-item-copy,
			& > .drawing-item-delete {
				display: none;
				position: absolute;
				top: 0px;
				width: 22px;
				height: 22px;
				line-height: 22px;
				text-align: center;
				border-radius: 50%;
				font-size: 12px;
				border: 1px solid;
				cursor: pointer;
				z-index: 1;
			}
			& > .drawing-item-copy {
				right: 40px;
				border-color: #409EFF;;
				color: #409EFF;;
				background: #fff;
				&:hover {
					background: #409EFF;;
					color: #fff;
				}
			}
			& > .drawing-item-delete {
				right: 10px;
				border-color: #f56c6c;
				color: #f56c6c;
				background: #fff;
				&:hover {
					background: #f56c6c;
					color: #fff;
				}
			}
		}
	}
	.right {
		width: 20%;
	}
	.center-board-row {
		padding: 12px 12px 15px 12px;
		box-sizing: border-box;
		& > .el-form {
			// 69 = 12+15+42
			height: calc(100vh - 69px);
		}
	}
	.drawing-board {
		height: calc(90vh - 95px);
		position: relative;
		.components-body {
			padding: 0;
			margin: 0;
			font-size: 0;
		}
		.sortable-ghost {
			position: relative;
			display: block;
			overflow: hidden;
			&::before {
				content: " ";
				position: absolute;
				left: 0;
				right: 0;
				top: 0;
				height: 3px;
				background: rgb(89, 89, 223);
				z-index: 2;
			}
		}
		.components-item.sortable-ghost {
			width: 100%;
			height: 60px;
			background-color: #f6f7ff;
		}
		.active-from-item {
			& > .a-form-item{
				background: #f6f7ff;
				border-radius: 6px;
			}
			& > .drawing-item-copy, & > .drawing-item-delete{
				display: initial;
			}
			& > .component-name{
				color: #409EFF;;
			}
		}
		.a-form-item{
			margin-bottom: 15px;
		}
	}
	.drawing-item{
		position: relative;
		cursor: move;
		&.unfocus-bordered:not(.activeFromItem) > div:first-child  {
			border: 1px dashed #ccc;
		}
		.a-form-item{
			padding: 12px 10px;
		}
	}
	.drawing-row-item{
		position: relative;
		cursor: move;
		box-sizing: border-box;
		border: 1px dashed #ccc;
		border-radius: 3px;
		padding: 0 2px;
		margin-bottom: 15px;
		.drawing-row-item {
			margin-bottom: 2px;
		}
		.a-col{
			margin-top: 22px;
		}
		.a-form-item{
			margin-bottom: 0;
		}
		.drag-wrapper{
			min-height: 80px;
		}
		&.active-from-item{
			border: 1px dashed #409EFF;;
		}
		.component-name{
			position: absolute;
			top: 0;
			left: 0;
			font-size: 12px;
			color: #bbb;
			display: inline-block;
			padding: 0 6px;
		}
	}
	.drawing-item, .drawing-row-item{
		&:hover {
			& > .a-form-item{
				background: #f6f7ff;
				border-radius: 6px;
			}
			& > .drawing-item-copy, & > .drawing-item-delete{
				display: initial;
			}
		}
		& > .drawing-item-copy, & > .drawing-item-delete{
			display: none;
			position: absolute;
			top: 5px;
			width: 22px;
			height: 22px;
			line-height: 22px;
			text-align: center;
			border-radius: 50%;
			font-size: 12px;
			border: 1px solid;
			cursor: pointer;
			z-index: 1;
		}
		& > .drawing-item-copy{
			right: 40px;
			border-color: #409EFF;;
			color: #409EFF;;
			background: #fff;
			&:hover{
				background: #409EFF;;
				color: #fff;
			}
		}
		& > .drawing-item-delete{
			right: 10px;
			border-color: #F56C6C;
			color: #F56C6C;
			background: #fff;
			&:hover{
				background: #F56C6C;
				color: #fff;
			}
		}
	}
}
</style>
