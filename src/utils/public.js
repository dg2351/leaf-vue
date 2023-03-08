/**
 * 返回顶部
 */
function toTop() {
    window.scroll({ top: 0, left: 0, behavior: "smooth" });
}

function versions(){
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
function base64ToBlob(base64Data, fileName) {
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
function getTargetDay(day) {
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