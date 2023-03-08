import Vue from 'vue'
import axios from 'axios'
import {notification} from "ant-design-vue";
import {BASE_URL, ACCESS_TOKEN, LOGIN_URL, ignoreTokenPath} from '@/store/mutation-types';

let baseURL = BASE_URL;

const err = (error) => {
	if (error.response) {
		//token失效时跳转
		if (needLogin(error.response)) {
			Vue.ls.remove(ACCESS_TOKEN);
			Vue.ls.remove("appUser");
			window.eventBus.$emit("loginAct");

			let needAuthPath = true;
			//虽然token失效，但是链接为忽略token的链接时不处理，继续访问
			console.log("error.config...>>>>",error.config)
			console.log("error.response...>>>>",error.response)
			if(error.response.data && error.response.data.message == "tokenInvalid"){
				let data = error.response.data;
				if(data.path){
					for(let a=0;a<ignoreTokenPath.length;a++){
						if(ignoreTokenPath[a] == data.path){
							return getAjax({baseURL:baseURL}).postUrl(data.path,{});
						}
					}
				}
			}
			if(needAuthPath){
				setTimeout(() => {
					// 登录成功后跳转地址
					window.open(LOGIN_URL, '_self');
				}, 1000);
			}
			return Promise.reject(error);
		} else {
			switch (error.response.status) {
				case 400:
					error.message = '请求错误(400)';
					break;
				case 401:
					error.message = '未授权，请重新登录(401)';
					break;
				case 403:
					error.message = '拒绝访问(403)';
					break;
				case 404:
					error.message = '请求出错(404)';
					break;
				case 408:
					error.message = '请求超时(408)';
					break;
				case 500:
					error.message = '服务器错误(500)';
					break;
				case 501:
					error.message = '服务未实现(501)';
					break;
				case 502:
					error.message = '网络错误(502)';
					break;
				case 503:
					error.message = '服务不可用(503)';
					break;
				case 504:
					error.message = '网络超时(504)';
					break;
				case 505:
					error.message = 'HTTP版本不受支持(505)';
					break;
				default:
					error.message = `连接出错(${error.response.status})!`;
			}
		}
	} else {
		if (error.message.includes('timeout')) {
			error.message = '请求超时!';
			return;
		} else {
			error.message = '连接服务器失败!'
		}
	}
	// MessageBox.show({message: error.message, data: error.response});
	notification.error({
		message: '执行异常',
		description: error.message
	})
	return Promise.reject(error);
};

function needLogin(res) {
	var response = res.data;
	if (response.status && response.status == 500) {
		if (response.message == "tokenInvalid" || response.message == "tokenExpried") {
			return true;
		}
	}
	if (response.code && response.code == 401) {
		return true;
	}
	return false;

};

/**
 * 获取ajax 对象。
 * @param conf  {
 *      timeout:20000,
 *      baseUrl: 基础路径
 * }
 * @returns {{}}
 */
function getAjax(conf) {

	if (conf && conf.baseUrl) {
		baseURL = conf.baseUrl;
	}

	var timeout = conf && conf.timeout || 20000;
	const $ajax = axios.create({
		baseURL: baseURL, // api base_url
		timeout: timeout // 请求超时时间
	});


	// request interceptor
	$ajax.interceptors.request.use(config => {
		if (config.headers && config.headers['blob'] == 'true') {
			return config;
		}
		/**
		 * 传入参数不需要token。
		 */
		if (config.headers && !config.headers.needToken_) {
			return config;
		}

		var token = Vue.ls.get(ACCESS_TOKEN);
		if (token) {
			config.headers['Authorization'] = 'Bearer ' + token;
		}
		return config
	}, err);


	// response interceptor
	$ajax.interceptors.response.use((response) => {
		if (response && response.headers && response.headers['blob'] == 'true') {
			return response;
		}

		if (response && response.data && response.data.message) {
			if (response.data.show) {
				if (response.data.success) {
					// notification.success({
					// 	message: '操作提示',
					// 	description: response.data.message
					// })
				} else {
					// MessageBox.show(response.data);
					notification.error({
						message: '操作提示',
						description: response.data.message
					})
				}
			}
		}
		return response.data
	}, err);


	var ajax = {};

	/**
	 * 发送get请求。
	 * @param url       url
	 * @param params    数据格式为JSON {name:"ray"}
	 * @param config    {token:"是否需要token，值为true或false"}
	 * @returns {AxiosPromise}
	 */
	ajax.get = function (url, params, config) {

		var headers = getHeaders(config, "form");

		return $ajax({
			method: 'get',
			url: `${url}`,
			params: params,
			headers: headers
		});
	}
	/**
	 * 获取图片类似的数据。
	 * @param url
	 * @param config     {token:"是否需要token，值为true或false"}
	 * @returns {AxiosPromise}
	 */
	ajax.getBlob = function (url, config) {

		var headers = {
			'blob': 'true',
			'needToken_': true
		};

		if (config && config.token != undefined) {
			headers.needToken_ = config.token;
		}

		return $ajax({
			method: 'get',
			url: `${url}`,
			responseType: 'blob',
			headers: headers
		});
	}

	/**
	 * 传递键值对数据。
	 * @param url
	 * @param params 两种方式 ： 对象 {name:"RAY"} 传键值对 name=ray
	 * @param config    {token:"是否需要token，值为true或false"}
	 * @returns {AxiosPromise}
	 */
	ajax.postForm = function (url, params, config) {
		var data = getData(params);

		var headers = getHeaders(config, "form");

		return $ajax({
			method: 'post',
			url: `${url}`,
			data: data,
			headers: headers
		});
	}

	/**
	 * 下载文件。
	 * 之前的方法定义： function (url, params, responseType)
	 * @param url
	 * @param params 两种方式 ： 对象 {name:"RAY"} 传键值对 name=ray
	 * @param config    {token:"是否需要token，值为true或false",responseType:""}
	 * @returns {AxiosPromise}
	 */
	ajax.download = function (url, params, config) {
		var data = getData(params);
		var headers = getHeaders(config, "form");
		return $ajax({
			method: 'post',
			url: `${url}`,
			data: data,
			responseType: config.responseType,
			headers: headers
		});
	}

	/**
	 * post JSON数据
	 * @param url       url
	 * @param params    参数为JSON数据
	 * @param config    {token:true,responseType:""}
	 * @returns {AxiosPromise}
	 */
	ajax.postJson = function (url, params, config) {

		var headers = getHeaders(config, "json");

		var conf = {
			method: 'post',
			url: `${url}`,
			data: params,
			headers: headers
		};
		if (config && config.responseType) {
			conf.responseType = config.responseType;
		}
		return $ajax(conf);
	}

	/**
	 * post 方法，会将数据 平装到URL
	 * @param url save?name=ray
	 * @param params
	 * @returns {AxiosPromise}
	 */
	ajax.postUrl = function (url, params, config) {

		var headers = getHeaders(config, "json");

		return $ajax({
			method: 'post',
			url: `${url}`,
			params: params,
			headers: headers
		});
	}
	/**
	 * POST form数据，可以指定超时时间。
	 * @param url
	 * @param params    两种方式 ： 对象 {name:"RAY"} 传键值对 name=ray
	 * @param config     {token:true,timeout:20000}
	 * @returns {AxiosPromise}
	 */
	ajax.postTimeout = function (url, params, config) {

		var data = getData(params);

		var headers = getHeaders(config, "form");

		return $ajax({
			method: 'post',
			url: url,
			data: data,
			timeout: config.timeout,
			headers: headers
		})
	};

	/**
	 * putJson方法。
	 * @param url       url
	 * @param params    参数为JSONS数据。
	 * @param config     {token:true}
	 * @returns {AxiosPromise}
	 */
	ajax.putJson = function (url, params, config) {
		var headers = getHeaders(config, "json");

		return $ajax({
			method: 'put',
			url: `${url}`,
			data: params,
			headers: headers
		});
	}

	/**
	 * putForm方法。
	 * @param url       url
	 * @param params    两种方式 ： 对象 {name:"RAY"} 传键值对 name=ray
	 * @param config     {token:true}
	 * @returns {AxiosPromise}
	 */
	ajax.putForm = function (url, params, config) {

		var data = getData(params);

		var headers = getHeaders(config, "form");

		return $ajax({
			method: 'put',
			url: `${url}`,
			data: data,
			headers: headers
		});
	}

	/**
	 * delete 方法。
	 * @param url
	 * @param params    数据为JSON格式。
	 * @param config    {token:true}
	 * @returns {AxiosPromise}
	 */
	ajax.deleteJson = function (url, params, config) {
		var headers = getHeaders(config, "json");
		return $ajax({
			method: 'delete',
			url: `${url}`,
			data: params,
			headers: headers
		});
	}

	/**
	 * 删除方法。
	 * @param url
	 * @param params    参数为JSON或键值对
	 * @param config    {token:true}
	 * @returns {AxiosPromise}
	 */
	ajax.deleteForm = function (url, params, config) {
		var data = getData(params);

		var headers = getHeaders(config, "form");

		return $ajax({
			method: 'delete',
			url: `${url}`,
			data: data,
			headers: headers
		});
	}


	/**
	 * 上传数据。
	 * @param url       上传路径
	 * @param params    参数使用键值对的方式 name=ray
	 * @param callback  回调方法
	 * @param config    {token:true}
	 * @returns {AxiosPromise}
	 */
	ajax.upload = function (url, params, callback, config) {
		var headers = getHeaders(config, "multi");

		return $ajax({
			method: 'post',
			url: `${url}`,
			data: params,
			headers: headers,
			//上传进度处理函数
			onUploadProgress(progressEvent) {
				if (callback) {
					callback(progressEvent)
				}
			}
		});
	}

	return ajax;
}

/**
 * 获取请求头。
 * @param config {token:false}
 * @param type 可能的值:json,form,multi
 * @returns {{"X-Requested-With": string, needToken_: boolean, "Content-Type": string}}
 */
function getHeaders(config, type) {
	var contentType = "application/x-www-form-urlencoded";
	if (type == 'json') {
		contentType = 'application/json';
	} else if (type == "multi") {
		contentType = 'multipart/form-data';
	}
	var headers = {
		'Content-Type': contentType,
		'X-Requested-With': 'XMLHttpRequest',
		'needToken_': true
	};

	if (config && config.token != undefined) {
		headers.needToken_ = config.token;
	}
	return headers;
}

/**
 * 如果数据是JSON结构的数据，则转换为 name=ray&age=1
 * @param params
 * @returns {string}
 */
function getData(params) {
	var data = params;
	if (params && (typeof params == "object")) {
		var ary = [];
		for (var key in params) {
			ary.push(key + "=" + params[key]);
		}
		if (ary.length > 0) {
			data = ary.join("&");
		}
	}
	return data;
}

export default getAjax;
