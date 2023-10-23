let FormMethods={};
import rxAjax from "@/assets/js/ajax";

/**
 * 调用自定义查询
 */
FormMethods.invokeCustomQueryPromise=function(alias,params){
	return rxAjax.postForm("/form/custom/query/queryForJson_"+alias, {
		params: JSON.stringify(params)
	});
}
/**
 * 调用自定义查询。
 */
FormMethods.invokeCustomQuery=function(alias,params,callback){
	rxAjax.postForm("/form/custom/query/queryForJson_"+alias, {
		params: JSON.stringify(params)
	}).then(res=>{
		if(res.success && callback) {
			callback(res.data);
		}
	})
}

/**
 * 调用服务端脚本。
 */
FormMethods.invokeScriptPromise=function(alias,params){
	return rxAjax.postJson("/system/invokeScript/invoke/"+alias, params);
}

/**
 * 调用服务端脚本。
 */
FormMethods.invokeScript=function(alias, params, callback) {
	rxAjax.postJson("/system/invokeScript/invoke/"+alias, params).then(res => {
		if(callback) {
			callback(res);
		}
	})
}

export default FormMethods;
