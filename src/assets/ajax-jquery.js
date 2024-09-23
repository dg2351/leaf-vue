import Vue from "vue";
import jQuery from "jquery";
import {ACCESS_TOKEN, BASE_URL} from "@/plugins/mutation-types";

let baseURL = BASE_URL;

const MethodApi = {}
MethodApi.get = function (url, param) {
	return jqAjax().get(url, param);
}
MethodApi.postJson = function (url, param) {
	return jqAjax().postJson(url, param);
}
MethodApi.postForm = function (url, param) {
	return jqAjax().postForm(url, param);
}
export default MethodApi

function setToken(token) {
	let expires_in = 1800;
	Vue.ls.set(ACCESS_TOKEN, token, expires_in);
	return token;
}
function getToken() {
	let token = Vue.ls.get(ACCESS_TOKEN);
	if(token){
		return token;
	} else{
		return "";//setToken(token);
	}
}

function jqAjax(conf) {
	var $ajax = {
		async: false,
		timeout: conf && conf.timeout || 20000, // 请求超时时间
	}
	var ajax = {};
	ajax.get = function (url, params, config) {
		var headers = getHeaders(config, "form");
		var result = null;
		jQuery.ajax(Object.assign($ajax, {
			url: `${baseURL}${url}`,
			type: 'get',
			data: params,
			headers: headers,
			success: value=>{result=value.data}
		}));
		return result;
	}
	ajax.postForm = function (url, params, config) {
		var result = null;
		jQuery.ajax(Object.assign($ajax, {
			url: `${baseURL}${url}`,
			type: 'post',
			data: params,
			headers: getHeaders(config, "form"),
			success: value=>{result=value.data},
			error: value=>{
				if(err(value)){
					result = this.postForm(url, params, config)
				}
			}
		}));
		return result;
	}
	ajax.postJson = function (url, params, config) {
		var result = null;
		jQuery.ajax(Object.assign($ajax, {
			url: `${baseURL}${url}`,
			type: 'post',
			data: JSON.stringify(params),
			headers: getHeaders(config, "json"),
			success: value=>{result=value.data},
			error: value=>{
				if(err(value)){
					result = this.postJson(url, params, config)
				}
			}
		}));
		return result;
	}
	return ajax
	/**
	 * 获取请求头
	 * @param config {token:false}
	 * @param type 可能的值:json,form,multi
	 * @returns {{"X-Requested-With": string, needToken_: boolean, "Content-Type": string}}
	 */
	function getHeaders(config, type) {
		var contentType = "application/x-www-form-urlencoded";
		if (type === 'json') {
			contentType = 'application/json';
		} else if (type === "multi") {
			contentType = 'multipart/form-data';
		}
		var headers = {
			'Content-Type': contentType,
			'X-Requested-With': 'XMLHttpRequest',
			'needToken_': true
		};
		var token = getToken();
		if (token) {
			headers.Authorization = 'Bearer ' + token;
		}
		return headers;
	}

	/**
	 * 失败回调
	 * @param error
	 * @returns {boolean}
	 */
	function err(error) {
		function needLogin(res) {
			if (res.code && res.code === 500
					|| (res.detailMsg === "tokenInvalid" || res.detailMsg === "tokenExpried")) {
				return true;
			}
			return !!(res.code && res.code === 401);
		}
		const result = error.responseJSON;
		if (result && needLogin(result)) {//token失效时返回true,重新请求
			// Vue.ls.remove(ACCESS_TOKEN);
			console.log("error.response...>>>>", result)
			return true;
		}
		return false;
	};
}
