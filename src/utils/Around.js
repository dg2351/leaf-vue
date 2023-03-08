const phoneReg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{4}(\d{4})$/; // 手机号正则校验
const idNoReg = /(\d{6})(\d*)(\w{3})/; // 简易身份证号码正则
const addrReg = /(.{9})(.*)/; // 地址正则
const Around = {
    /**
     * 名字脱敏 保留首位
     * @param fullName
     * @returns {string}
     */
    desensitizedName(fullName) {
        if (!fullName) {
            return "";
        }
        return this.desensitizedCommon(fullName, 0, fullName.length > 2 ? 2 : 1)
    },

    /**
     * 脱敏公用
     * @param str 脱敏字符串
     * @param begin 起始保留长度，从0开始
     * @param end 结束保留长度，到str.length结束
     * @returns {string}
     */
    desensitizedCommon(str, begin, end) {
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
    },

    /**
     * 手机号脱敏
     * @param str
     * @returns {string|*|string}
     */
    desensitizedPhone(str) {
        if (!str) {
            return "";
        }
        return str.replace(phoneReg, '$1****$2');
    },

    /**
     * 身份证号脱敏
     * @param str
     * @returns {string|*|string}
     */
    desensitizedIdNo(str) {
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
    },

    /**
     * 地址脱敏
     * @param str
     * @returns {string|*|string}
     */
    desensitizedAddr(str) {
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
};
