<template>
  <div class="dashboard-editor-container">

    <panel-group :group-data="panelGroupData" @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="6">
        <div class="box-wrapper">
          <box-card :box-data="boxData" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="9">
        <div class="chart-wrapper">
          <pie-chart :chart-data="pieChartData" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="9">
        <div class="chart-wrapper">
          <bar-chart :chart-data="barChartData" />
        </div>
      </el-col>
    </el-row>

    <!-- <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <box-card />
      </el-col>
    </el-row> -->
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import BoxCard from './components/BoxCard'

// const lineChartData = {
//   mix: {
//     blogData: { '2021-08': 100, '2021-09': 120, '2021-10': 161, '2021-11': 109, '2021-12': 105, '2022-01': 175, '2022-02': 165 },
//     noteData: { '2021-08': 180, '2021-09': 160, '2021-10': 151, '2021-11': 106, '2021-12': 145, '2022-01': 150, '2022-02': 130 },
//     photoData: { '2021-08': 130, '2021-09': 151, '2021-10': 106, '2021-11': 175, '2021-12': 165, '2022-01': 161, '2022-02': 150 }

//   },
//   tasks: {
//     todoData: { '2021-08': 130, '2021-09': 151, '2021-10': 106, '2021-11': 175, '2021-12': 165, '2022-01': 161, '2022-02': 150 },
//     workingData: { '2021-08': 180, '2021-09': 160, '2021-10': 151, '2021-11': 106, '2021-12': 145, '2022-01': 150, '2022-02': 130 },
//     doneData: { '2021-08': 100, '2021-09': 120, '2021-10': 161, '2021-11': 109, '2021-12': 105, '2022-01': 175, '2022-02': 165 }
//   }
// }
// const pieChartData = {
//   '心得体会': 120,
//   'Java天地': 80,
//   '滴滴打车': 200
// }

// const barChartData = {
//   todoData: { '星期一': 130, '星期二': 151, '星期三': 106, '星期四': 175, '星期五': 165, '星期六': 161, '星期天': 150 },
//   workingData: { '星期一': 180, '星期二': 160, '星期三': 151, '星期四': 106, '星期五': 145, '星期六': 150, '星期天': 130 },
//   doneData: { '星期一': 100, '星期二': 120, '星期三': 161, '2星期四': 109, '星期五': 105, '星期六': 175, '星期天': 165 }
// }
// const boxData = {
//   'Java': 80,
//   'Vue': 40,
//   'CSS': 100
// }
// const panelGroupData = {
//   publishedBlogCount: 23,
//   draftBlogCount: 12,
//   todoTaskCount: 12,
//   workingTaskCount: 34,
//   doneTaskCount: 11,
//   noteCount: 123,
//   albumCount: 4,
//   photoCount: 1203
// }
export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
    PieChart,
    BarChart,
    BoxCard
  },
  data() {
    return {
      lineChartData: {},
      mixLineChartData: {},
      taskLineChartData: {},
      pieChartData: {},
      barChartData: {
        todoData: {},
        workingData: {},
        doneData: {}
      },
      boxData: {},
      panelGroupData: {
        publishedBlogCount: 23,
        draftBlogCount: 12,
        todoTaskCount: 12,
        workingTaskCount: 34,
        doneTaskCount: 11,
        noteCount: 123,
        albumCount: 4,
        photoCount: 1203
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.getStatisticData()
    })
  },
  methods: {
    handleSetLineChartData(type) {
      if (type === 'mix') {
        this.lineChartData = this.mixLineChartData
      } else if (type === 'tasks') {
        this.lineChartData = this.taskLineChartData
      }
    },
    getStatisticData() {
      const _this = this
      _this.listLoading = true
      _this.$store
        .dispatch('home/getStatisticData')
        .then(function(response) {
          if (response == null || response.data == null || response.code !== 200) return
          const statisticData = response.data
          _this.panelGroupData.publishedBlogCount = statisticData.publishedBlogCount
          _this.panelGroupData.draftBlogCount = statisticData.draftBlogCount
          _this.panelGroupData.todoTaskCount = statisticData.todoTaskCount
          _this.panelGroupData.workingTaskCount = statisticData.workingTaskCount
          _this.panelGroupData.doneTaskCount = statisticData.doneTaskCount
          _this.panelGroupData.noteCount = statisticData.noteCount
          _this.panelGroupData.albumCount = statisticData.albumCount
          _this.panelGroupData.photoCount = statisticData.photoCount

          _this.pieChartData = statisticData.articleCategoryMap
          _this.boxData = statisticData.articleTagMap

          _this.mixLineChartData.blogData = statisticData.articleMap
          _this.mixLineChartData.noteData = statisticData.noteMap
          _this.mixLineChartData.photoData = statisticData.photoMap

          _this.taskLineChartData.todoData = statisticData.todoTaskYearMap
          _this.taskLineChartData.workingData = statisticData.workingTaskYearMap
          _this.taskLineChartData.doneData = statisticData.doneTaskYearMap

          _this.barChartData.todoData = statisticData.todoTaskWeekMap
          _this.barChartData.workingData = statisticData.workingTaskWeekMap
          _this.barChartData.doneData = statisticData.doneTaskWeekMap

          // 默认展示博客、笔记和照片混合数据
          _this.lineChartData = _this.mixLineChartData
        })
        .catch(function(error) {
          console.log(error)
          _this.$message({ message: error.msg || 'Has Error', type: 'error', showClose: true })
          _this.listLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
    .box-wrapper {
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
