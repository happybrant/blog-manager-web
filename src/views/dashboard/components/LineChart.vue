<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

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
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      legendData: [],
      xData: [],
      series: [],
      serieData: {
        name: '', itemStyle: {
          normal: {
            color: '#FF005A',
            lineStyle: {
              color: '#FF005A',
              width: 2
            }
          }
        },
        smooth: true,
        type: 'line',
        data: null,
        animationDuration: 2800,
        animationEasing: 'cubicInOut'
      }
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.xData = []
        this.series = []
        this.legendData = []
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
      this.series = []
      this.legendData = []
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions(chartData) {
      if (chartData.blogData) {
        const month = Object.keys(chartData.blogData)
        const blogData = Object.values(chartData.blogData)
        const noteData = Object.values(chartData.noteData)
        const photoData = Object.values(chartData.photoData)
        this.legendData = ['博客数量', '笔记数量', '照片数量']
        this.xData = month
        // 深拷贝，不破坏原对象
        const blogSerieData = JSON.parse(JSON.stringify(this.serieData))
        blogSerieData.name = '博客数量'
        blogSerieData.data = blogData
        this.series.push(blogSerieData)
        const noteSerieData = JSON.parse(JSON.stringify(this.serieData))
        noteSerieData.name = '笔记数量'
        noteSerieData.data = noteData
        noteSerieData.itemStyle.normal.color = '#3888fa'
        noteSerieData.itemStyle.normal.lineStyle.color = '#3888fa'
        this.series.push(noteSerieData)
        const photoSerieData = JSON.parse(JSON.stringify(this.serieData))
        photoSerieData.name = '照片数量'
        photoSerieData.data = photoData
        photoSerieData.itemStyle.normal.color = '#40c9c6'
        photoSerieData.itemStyle.normal.lineStyle.color = ' #40c9c6'
        this.series.push(photoSerieData)
      } else if (chartData.todoData) {
        const month = Object.keys(chartData.todoData)
        const todoData = Object.values(chartData.todoData)
        const workingData = Object.values(chartData.workingData)
        const doneData = Object.values(chartData.doneData)
        this.legendData = ['创建任务数', '开始任务数', '完成任务数']
        this.xData = month
        // 深拷贝，不破坏原对象
        const todoSerieData = JSON.parse(JSON.stringify(this.serieData))
        todoSerieData.name = '创建任务数'
        todoSerieData.data = todoData
        this.series.push(todoSerieData)
        const workingSerieData = JSON.parse(JSON.stringify(this.serieData))
        workingSerieData.name = '开始任务数'
        workingSerieData.data = workingData
        workingSerieData.itemStyle.normal.color = '#3888fa'
        workingSerieData.itemStyle.normal.lineStyle.color = '#3888fa'
        this.series.push(workingSerieData)
        const doneSerieData = JSON.parse(JSON.stringify(this.serieData))
        doneSerieData.name = '完成任务数'
        doneSerieData.data = doneData
        doneSerieData.itemStyle.normal.color = '#40c9c6'
        doneSerieData.itemStyle.normal.lineStyle.color = ' #40c9c6'
        this.series.push(doneSerieData)
      }
      this.chart.setOption({
        xAxis: {
          data: this.xData,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 30,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: this.legendData
        },
        series: this.series
      })
    }
  }
}
</script>
