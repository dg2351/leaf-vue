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

export  default util;