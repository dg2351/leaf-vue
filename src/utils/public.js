/**
 * 返回顶部
 */
export function toTop() {
    window.scroll({ top: 0, left: 0, behavior: "smooth" });
}

export function versions(){
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
export function base64ToBlob(base64Data, fileName) {
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
export function getTargetDay(day) {
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
 * @param list
 * @param arr
 * @param parentId
 */
export function buildTree(arr, list, parentId) {
    list.filter(p=>p.pid == parentId).forEach(item => {
        let child = JSON.parse(JSON.stringify(item));
        child.children = [];
        buildTree(child.children, list, item.id)
        arr.push(child)
    })
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
export function getTreeNode(current, select, node, value, type='key') {
    for(let i=0;i<node.length;i++){
        let item = node[i];
        if(item[type] == value){
            current.push(item[type])
            return true;
        } else if(item.children && item.children.length > 0){
            let temp = getTreeNode(current, select, item.children, value, type);
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
export function getTreeVal(arr, data, val='id') {
    data.forEach(m=>{
        arr.push(m[val]);
        if(m.children && m.children.length > 0){
            getTreeVal(arr, m.children)
        }
    })
}

/**
 * 正则截取字符串
 */
export function strCutOut(str, s, e) {
    // return str.match(/${s}(\S*)${e}/); // 贪婪
    // return str.match(/${s}(\S*?)${e}/); // 非贪婪
    return str.match(new RegExp(`/${s}(\\S*?)${e}/`));
}