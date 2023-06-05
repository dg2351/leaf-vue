import Vue from 'vue'
import {notification} from "ant-design-vue";

export const util = {}

util.link = (self_)=>{
    let method = {};
    method.sub = (name, query, params)=>{
        self_.$router.push({ name: name, query: query, params:params });
    }
    method.post = (name, params)=>{
        self_.$router.push({ name: name, params: params });
    }
    method.get = (name, query)=>{
        self_.$router.push({ name: name, query: query });
    }
    method.back = ()=>{
        self_.$router.go(-1);
    }
    method.open = (url)=>{
        window.open(url);
    }
    return method;
}

util.modal = (self_)=>{
    let method = {};
    method.confirm = (name, content, callback)=>{
        self_.$confirm({
            title: name??'操作提示',
            content: content,
            okText: '确认',
            cancelText: '取消',
            zIndex:1000,
            onOk() {
                if(callback){
                    callback();
                }
            },
            onCancel() {}
        })
    }
    return method;
}

/**
 * 返回顶部
 */
util.toTop = ()=>{
    window.scroll({ top: 0, left: 0, behavior: "smooth" });
}

/**
 * 当前浏览器版本
 */
util.versions = ()=>{
    let u = navigator.userAgent, app = navigator.appVersion;
    return {
        trident: u.indexOf('Trident') > -1, //IE内核
        presto: u.indexOf('Presto') > -1, //opera内核
        webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
        mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
        android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
        iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
        iPad: u.indexOf('iPad') > -1, //是否iPad
        webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
        weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
        qq: u.match(/\sQQ/i) == " qq" //是否QQ
    };
}

/**
 * base64转blob
 * @param base64Data
 * @param fileName
 * @returns {File}
 */
util.base64ToBlob = (base64Data, fileName)=>{
    let arr = base64Data.split(","),
        fileType = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        l = bstr.length,
        u8Arr = new Uint8Array(l);
    while (l--) {
        u8Arr[l] = bstr.charCodeAt(l);
    }
    return new File([u8Arr], fileName, {
        type: fileType
    });
}

/**
 * 当前日期的附近日期
 * @param day
 * @returns {string}
 */
util.getTargetDay = (day)=>{
    function doHandleMonth(month) {
        // 月份补0
        return month.toString().length == 1 ? ("0" + month) : month
    }
    var today = new Date();
    var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
    today.setTime(targetday_milliseconds); //注意，这行是关键代码
    var tYear = today.getFullYear();
    var tMonth = today.getMonth();
    var tDate = today.getDate();
    tMonth = doHandleMonth(tMonth + 1);
    tDate = doHandleMonth(tDate);
    return tYear + "-" + tMonth + "-" + tDate;
}

/**
 * 构造树
 * @param source
 */
util.buildTree = (source, fkey = 'id', pkey = 'pid')=>{
    let list = [];
    let pkList = [];
    source.forEach(map=>{
        let pid = map[pkey];
        let list = source.filter(p=>p[fkey] == pid);
        if(list.length == 0 && !pkList.includes(pid))
            pkList.push(pid);
    })
    pkList.forEach(pid=>{
        treeFunction(list, source, pid, fkey, pkey);
    })
    return list;
    function treeFunction(arr, list, parentId, fkey = 'id', pkey = 'pid'){
        list.filter(p=>p[pkey] == parentId).forEach(item => {
            let child = JSON.parse(JSON.stringify(item));
            let children = [];
            treeFunction(children, list, item[fkey], fkey, pkey)
            if(children.length > 0)
                child.children = children;
            arr.push(child)
        })
    }
}

/**
 * 设置编号
 * @param list
 * @param i
 */
util.setTreeNo = (list, i=0)=>{
    setNo(list);
    function setNo(arr) {
        arr.forEach(m=>{
            m.xh = ++i;
            if(m.children && m.children.length > 0)
                setNo(m.children)
        })
    }
    return i;
}

/**
 * 递归遍历树节点
 * @param current   匹配的节点值
 * @param select    匹配节点值的父节点集合
 * @param node      树
 * @param value     需要匹配的值
 * @param type      匹配值的key
 * @returns {boolean}
 */
util.getTreeNode = (current, select, node, value, type='key')=>{
    for(let i=0;i<node.length;i++){
        let item = node[i];
        if(item[type] == value){
            current.push(item[type])
            return true;
        } else if(item.children && item.children.length > 0){
            let temp = util.getTreeNode(current, select, item.children, value, type);
            if(temp){
                select.push(item[type])
                return true;
            }
        }
    }
}

/**
 * 获取树结构下的值
 * @param arr
 * @param data
 */
util.getTreeVal = (arr, data, val='id')=>{
    data.forEach(m=>{
        arr.push(m[val]);
        if(m.children && m.children.length > 0){
            util.getTreeVal(arr, m.children)
        }
    })
}

/**
 * 正则截取字符串
 */
util.strCutOut = (str, s, e)=>{
    // return str.match(/${s}(\S*)${e}/); // 贪婪
    // return str.match(/${s}(\S*?)${e}/); // 非贪婪
    return str.match(new RegExp(`/${s}(\\S*?)${e}/`));
}

/**
 * 页面回调通用方法
 */
util.component = (self_)=>{
    let method = {};
    /**
     * 回调
     * @param data
     */
    method.back = (data)=>{
        if(data.link){
            self_.currentTabComponent = data.link;
            self_.params = data.params;
        }
    }
    /**
     * 回调触发
     * @param params
     * @param isLoad  是否重新加载页面
     */
    method.event = (link, params={}, isLoad=false)=>{
        self_.$emit("formBack", {link:link, params:params, isLoad:isLoad})
    }
    return method;
}

/**
 * 同步请求调用
 * @param methodApi
 * [{
 *		api:FormFunctions.invokeCustomQueryPromise('qyInfo', {}),
 *		back:function (data) {self_.qyInfo = data?.[0];}
 *	}]
 */
util.promiseAll = (methodApi)=>{
    Promise.all(methodApi.map(item=>{return item.api})).then((res) => {
        res.forEach((item, i) => {methodApi[i].back(item.success ? item.data : []);})
    });
}

/**
 * andt 消息提示
 * @returns {{}}
 */
util.message = ()=>{
    let method = {};
    method.success = function(mess,desc){
        notification.success({message: mess,description:desc,duration:3})
    }
    method.warning = function(mess,desc){
        notification.warning({message: mess,description:desc,duration:3})
    }
    method.error = function(mess,desc){
        notification.error({message: mess,description:desc,duration:3})
    }
    return method;
}

/**
 * 页面置顶
 */
util.scrollToTop = ()=>{
    window.scroll({ top: 0, left: 0, behavior: "smooth" });
}

/**
 * 数据密文
 */
util.around = ()=>{
    let method = {};
    const phoneReg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{4}(\d{4})$/; // 手机号正则校验
    const idNoReg = /(\d{6})(\d*)(\w{3})/; // 简易身份证号码正则
    const addrReg = /(.{9})(.*)/; // 地址正则

    /**
     * 脱敏公用
     * @param str 脱敏字符串
     * @param begin 起始保留长度，从0开始
     * @param end 结束保留长度，到str.length结束
     * @returns {string}
     */
    method.desensitizedCommon = (str, begin, end)=>{
        if (!str && (begin + end) >= str.length) {
            return "";
        }

        let leftStr = str.substring(0, begin);
        let rightStr = str.substring(str.length - end, str.length);

        let strCon = ''
        for (let i = 0; i < str.length - end - begin; i++) {
            strCon += '*';
        }
        return leftStr + strCon + rightStr;
    }

    /**
     * 名字脱敏 保留首位
     * @param fullName
     * @returns {string}
     */
    method.desensitizedName = (fullName)=>{
        if (!fullName) {
            return "";
        }
        return method.desensitizedCommon(fullName, 0, fullName.length > 2 ? 2 : 1)
    }

    /**
     * 手机号脱敏
     * @param str
     * @returns {string|*|string}
     */
    method.desensitizedPhone = (str)=>{
        if (!str) {
            return "";
        }
        return str.replace(phoneReg, '$1****$2');
    }

    /**
     * 身份证号脱敏
     * @param str
     * @returns {string|*|string}
     */
    method.desensitizedIdNo = (str)=>{
        if (!str) {
            return "";
        }
        if (idNoReg.test(str)) {
            let text1 = RegExp.$1;
            let text3 = RegExp.$3;
            let text2 = RegExp.$2.replace(/./g, "*");
            return text1 + text2 + text3;
        }
        return str;
    }

    /**
     * 地址脱敏
     * @param str
     * @returns {string|*|string}
     */
    method.desensitizedAddr = (str)=>{
        if (!str) {
            return "";
        }
        if (addrReg.test(str)) {
            let text1 = RegExp.$1;
            let text2 = RegExp.$2.replace(/./g, "*");
            return text1 + text2;
        }
        return str;
    }
    return method;
}

util.toPercent = (value, fixed=2)=>{
	let percent = parseFloat((value*100).toFixed(fixed))
	if(isNaN(percent)) percent = 0;
	return (percent>100?100:percent) + '%'
}

util.toFixed = (value, fixed)=>{
	if(isNaN(value)){
		value = 0;
	}
	return parseFloat(value.toFixed(fixed))
}

util.cookieEvent = ()=>{
	let method = {};
	method.getCookie = (name)=>{
		let nameEQ = name + "=";
		let ca = document.cookie.split(';');    //把cookie分割成组
		for(let i=0;i < ca.length;i++) {
			let c = ca[i];                      //取得字符串
			while (c.charAt(0)==' ') {          //判断一下字符串有没有前导空格
				c = c.substring(1,c.length);      //有的话，从第二位开始取
			}
			if (c.indexOf(nameEQ) == 0) {       //如果含有我们要的name
				return unescape(c.substring(nameEQ.length,c.length));    //解码并截取我们要值
			}
		}
		return false;
	}

	//清除cookie
	method.clearCookie = (name)=>{
		method.setCookie(name, "", -1);
	}

	//设置cookie
	method.setCookie = (name, value, seconds)=>{
		seconds = seconds || 0;   //seconds有值就直接赋值，没有为0，这个根php不一样。
		var expires = "";
		if (seconds != 0 ) {      //设置cookie生存时间
			var date = new Date();
			date.setTime(date.getTime()+(seconds*1000));
			expires = "; expires="+date.toGMTString();
		}
		document.cookie = name+"="+escape(value)+expires+"; path=/";   //转码并赋值
	}
	return method;
}

export  default util;

let api = {
    install(Vue){
        Vue.prototype.$util = util;
    }
}
Vue.use(api);
