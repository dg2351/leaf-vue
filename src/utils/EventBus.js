// 事件总线
import Vue from 'vue'

const vm = new Vue({
    data() {
        return {}
    },
    beforeDestroy() {
        this.$off();
    },
    methods: {
        /**
         * 发送事件
         * @param name 事件名称
         * @param payload 载荷
         */
        send(name, payload) {
            this.$emit(name, payload)
        },

        /**
         * 接收事件
         * @param names 事件名称
         * @param callBack 回调函数
         */
        receive(names, callBack) {
            // this.$off(name);
            this.$on(names, callBack)
        }
    }
});

export default vm
