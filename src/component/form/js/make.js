import {trigger} from "@/views/module/form/design/generator/config";
import {isArray} from "util";
import rxAjax from "@/assets/js/ajax";

export async function buildRules(conf, ruleList) {
	if (conf.vModel === undefined) return
	const rules = []
	if (trigger[conf.tag]) {
		if (conf.required) {
			const type = isArray(conf.defaultValue) ? 'array' : ''
			let message = isArray(conf.defaultValue) ? `请至少选择一个${conf.vModel}` : conf.placeholder
			if (!message) message = `${conf.label}不能为空`
			rules.push(Object.assign({required: true, type, message: `${message}`, trigger: `${trigger[conf.tag]}`}));
		}
		if (conf.regList && isArray(conf.regList)) {
			for(let regMap of conf.regList){
				let {success,data} = await rxAjax.get(`/form/bo/entity/t_rule_regular/dataInfo`, {pkId:regMap.pattern})
				if(success && data.pattern)
					rules.push({pattern: eval(data.pattern), message: data.message, trigger: `${trigger[conf.tag]}`});
			}
		}
		Object.assign(ruleList, {[conf.vModel]: rules});
	}
}
