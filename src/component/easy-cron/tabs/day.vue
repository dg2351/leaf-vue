<template>
  <div class="config-list">
    <a-radio-group v-model="type">
      <div class="item">
        <a-radio value="TYPE_NOT_SET" class="choice" :disabled="disableChoice">不设置</a-radio>
        <span class="tip-info">日和周只能设置其中之一</span>
      </div>
      <div class="item">
        <a-radio value="TYPE_EVERY" class="choice" :disabled="disableChoice">每日</a-radio>
      </div>
      <div class="item">
        <a-radio value="TYPE_RANGE" class="choice" :disabled="disableChoice">区间</a-radio>
        从
        <a-input-number :disabled="type!=TYPE_RANGE || disableChoice" :max="maxValue" :min="minValue" :precision="0" v-model="valueRange.start"/>
        日
        至
        <a-input-number :disabled="type!=TYPE_RANGE || disableChoice" :max="maxValue" :min="minValue" :precision="0" v-model="valueRange.end"/>
        日
      </div>
      <div class="item">
        <a-radio value="TYPE_LOOP" class="choice" :disabled="disableChoice">循环</a-radio>
        从
        <a-input-number :disabled="type!=TYPE_LOOP || disableChoice" :max="maxValue" :min="minValue" :precision="0" v-model="valueLoop.start"/>
        日开始，间隔
        <a-input-number :disabled="type!=TYPE_LOOP || disableChoice" :max="maxValue" :min="minValue" :precision="0" v-model="valueLoop.interval"/>
        日
      </div>
      <div class="item">
        <a-radio value="TYPE_WORK" class="choice" :disabled="disableChoice">工作日</a-radio>
        本月
        <a-input-number :disabled="type!=TYPE_WORK || disableChoice" :max="maxValue" :min="minValue" :precision="0" v-model="valueWork"/>
        日，最近的工作日
      </div>
      <div class="item">
        <a-radio value="TYPE_LAST" class="choice" :disabled="disableChoice">最后一日</a-radio>
      </div>
      <div class="item">
        <a-radio value="TYPE_SPECIFY" class="choice" :disabled="disableChoice">指定</a-radio>
        <div class="list">
          <a-checkbox-group v-model="valueList">
            <a-checkbox class="list-check-item" v-for="i in maxValue"
                        :name="`key-${i}`" :value="i" :disabled="type!=TYPE_SPECIFY || disableChoice">{{i}}</a-checkbox>
          </a-checkbox-group>
        </div>
      </div>
    </a-radio-group>
  </div>
</template>

<script>
import mixin from './mixin'
import SecondUi from "@/component/easy-cron/tabs/second";
import MinuteUi from "@/component/easy-cron/tabs/minute";
import HourUi from "@/component/easy-cron/tabs/hour";
import WeekUi from "@/component/easy-cron/tabs/week";
import MonthUi from "@/component/easy-cron/tabs/month";
import YearUi from "@/component/easy-cron/tabs/year";

export default {
  name: 'DayUi',
  mixins: [mixin],
  props: {
    week: {
      type: String,
      default: '?'
    }
  },
  data() {
    return {}
  },
  computed: {
    disableChoice() {
      return (this.week && this.week !== '?') || this.disabled
    }
  },
  watch: {
    value_c(newVal, oldVal) {
      // 数值变化
      this.updateValue()
    },
    week(newVal, oldVal) {
      // console.info('new week: ' + newVal)
      this.updateValue()
    }
  },
  methods: {
    updateValue() {
      this.$emit('change', this.disableChoice ? '?' : this.value_c)
    }
  },
  created() {
    this.DEFAULT_VALUE = '*'
    this.minValue = 1
    this.maxValue = 31
    this.valueRange.start = 1
    this.valueRange.end = 31
    this.valueLoop.start = 1
    this.valueLoop.interval = 1
    this.parseProp(this.prop)
  }
}
</script>

<style scoped>

.config-list {
  text-align: left;
  margin: 0 10px 10px 10px;
}

.item {
  margin-top: 5px;
}

.tip-info {
  color: #999
}

.choice {
  border: 1px solid transparent;
  padding: 5px 8px;
}

.choice:hover {
  border: 1px solid #2d8cf0;
}

.w60 {
  width: 60px;
}

.ivu-input-number {
  margin-left: 5px;
  margin-right: 5px;
}

.list {
  margin: 0 20px;
}

.list-check-item {
  padding: 1px 3px;
  width: 4em;
  margin-left:0px;
}
</style>
