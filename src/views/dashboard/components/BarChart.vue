<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

const animationDuration = 3000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      xData: [],
      todoSerieData: [],
      workingSerieData: [],
      doneSerieData: []
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.xData = []
        this.todoSerieData = []
        this.workingSerieData = []
        this.doneSerieData = []
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.xData = []
      this.todoSerieData = []
      this.workingSerieData = []
      this.doneSerieData = []
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions(chartData) {
      if (chartData.todoData) {
        this.xData = Object.keys(chartData.todoData)
        this.todoSerieData = Object.values(chartData.todoData)
      }
      if (chartData.workingData) {
        this.workingSerieData = Object.values(chartData.workingData)
      }
      if (chartData.doneData) {
        this.doneSerieData = Object.values(chartData.doneData)
      }
      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: this.xData,
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: '创建任务数',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: this.todoSerieData,
          animationDuration
        }, {
          name: '开始任务数',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: this.workingSerieData,
          animationDuration
        }, {
          name: '结束任务数',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: this.doneSerieData,
          animationDuration
        }]
      })
    }
  }
}
</script>
