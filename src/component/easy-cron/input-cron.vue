<template>
    <a-popover :autoAdjustOverflow="true" :arrowPointAtCenter="false"
               trigger="click" placement="bottom"
               v-model="visible" @visibleChange="visibleChange">
        <!-- 触发popover的元素 -->
        <a-icon type="form" class="openPop"></a-icon>
        <!-- 弹框内容区域 -->
        <template slot="content">
            <easy-cron class="easy-cron mt10"
                       :style="`width: ${width}px;`"
                       v-model="editCronValue"
                       :exeStartTime="exeStartTime"
                       :hideYear="hideYear"
                       :remote="remote"
                       :hideSecond="hideSecond"></easy-cron>
        </template>
    </a-popover>
</template>

<script>
import EasyCron from './cron'

export default {
    name: 'input-cron',
    model: {
        prop: 'cronValue',
        event: 'change'
    },
    components: {EasyCron},
    props: {
        cronValue: {
            type: String,
            default: ''
        },
        width: {
            type: Number,
            default: 530
        },
        placeholder: {
            type: String,
            default: '请输入cron表达式'
        },
        disabled: {
            type: Boolean,
            default: false
        },
        exeStartTime: {
            type: [Number, String, Object],
            default: 0
        },
        hideSecond: {
            type: Boolean,
            default: false
        },
        hideYear: {
            type: Boolean,
            default: false
        },
        remote: {
            type: Function,
            default: null
        }
    },
    data() {
        return {
            visible: false,
            editCronValue: this.cronValue,
        }
    },
    watch: {
        cronValue(newVal, oldVal) {
            if (newVal === this.editCronValue) {
                return
            }
            this.editCronValue = newVal
        },
        editCronValue(newVal, oldVal) {
            if(this.visible){
                this.$emit('change', newVal)
            }
        }
    },
    methods:{
        visibleChange(){
            // 关闭回调
            this.$emit('change', this.editCronValue)
        }
    }
}
</script>

<style scoped>
.input-cron, .input-ui {
}

.input-cron .ivu-input-wrapper {
  width: 100% !important;
}

.config-btn {
  cursor: pointer;
}

.config-btn:hover {
  color: #2D8CF0;
}

.easy-cron >>> .el-input__inner{
  border-color: #DCDFE6;
}

.easy-cron >>> .el-textarea__inner{
  border-color: #DCDFE6;
}
</style>
