<template>
  <div class="app-container main-conent-screen">
    <el-row style="background:#fff">
      <line-chart :chart-data="lineChartData" />
    </el-row>
    <div class="screen-header">
      <el-row>
        <el-col :span="16">
          <el-date-picker
            v-model="dateRange"
            class=""
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="选择开始时间"
            end-placeholder="选择截止时间"
            :picker-options="pickerOptions"
            range-separator="至"
            align="left"
            style="width:400px"
            @change="getLogListPager"
          />
          <el-input v-model="listQuery.keyword" class="margin-l10" style="width:200px" placeholder="支持操作描述、菜单、IP地址" @keyup.enter.native="getLogListPager">
            <i slot="suffix" class="el-input__icon el-icon-search cursor-pointer" @click="getLogListPager" />
          </el-input>
        </el-col>
        <el-col :span="8" class="text-right">
          <el-switch
            v-model="needFilter"
            style="text-align: right"
            active-text="过滤超时接口"
            inactive-text="全部"
            @change="getLogListPager"
          />
          <el-input
            v-if="needFilter"
            v-model="listQuery.totalMillis"
            placeholder="超时时间"
            style="width:100px"
            class="timeout"
            size="small"
            type="number"
            @keyup.enter.native="getLogListPager"
            @blur="getLogListPager"
          />
        </el-col>
      </el-row>
    </div>
    <el-table ref="tableList" v-loading="listLoading" :data="logList" border fit highlight-current-row style="width: 100%">
      <el-table-column type="selection" width="60" align="center" />
      <el-table-column align="center" label="序号" width="65" type="index" :index="indexAdd" />

      <el-table-column width="180px" align="center" label="操作描述">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="菜单">
        <template slot-scope="{row}">
          <span>{{ row.menu }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="url">
        <template slot-scope="{row}">
          <span>{{ row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="操作耗时(毫秒)">
        <template slot-scope="{row}">
          <span>{{ row.totalMillis }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="ip">
        <template slot-scope="{row}">
          <span>{{ row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="请求参数" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.params }}</span>
        </template>
      </el-table-column>
      <el-table-column width="80px" align="center" label="请求用户">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="请求时间">
        <template slot-scope="{row}">
          <span>{{ parseTime(row.requestTime,'{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getLogListPager" />
    <EditForm ref="editForm" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { parseTime } from '@/utils/index'
import EditForm from '@/views/user/edit'
import LineChart from './components/LineChart'

export default {
  name: 'UserList',
  components: { Pagination, EditForm, LineChart },

  data() {
    return {
      logList: null,
      total: 0,
      listLoading: true,
      stateType: '全部',
      type: '全部',
      dateRange: null,
      needFilter: false,
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        startTime: '',
        endTime: '',
        keyword: '',
        totalMillis: 300
      },
      lineChartData: {},
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      categoryOptions: []
    }
  },
  created() {
    this.getLogListPager()
    this.getStatisticData()
  },
  methods: {
    indexAdd(index) {
      return index + 1 + (this.listQuery.pageIndex - 1) * this.listQuery.pageSize
    },
    parseTime(time, format) {
      return parseTime(time, format)
    },

    // 查看所有日志
    getLogListPager() {
      const _this = this
      _this.listLoading = true
      if (_this.dateRange != null && _this.dateRange.length > 0) {
        _this.listQuery.startTime = _this.dateRange[0]
        _this.listQuery.endTime = _this.dateRange[1]
      } else {
        _this.listQuery.startTime = ''
        _this.listQuery.endTime = ''
      }
      if (!_this.needFilter) {
        _this.listQuery.totalMillis = 0
      } else {
        if (_this.listQuery.totalMillis === 0) {
          // 默认超时时间为300ms
          _this.listQuery.totalMillis = 300
        }
      }

      _this.$store
        .dispatch('log/getLogListPager', _this.listQuery)
        .then(function(response) {
          if (response != null && response.code === 200 && response.data.records != null) {
            _this.logList = response.data.records
            _this.total = response.data.total
          } else {
            _this.logList = []
          }
        })
        .catch(function(error) {
          console.log(error)
          _this.$message({ message: error.msg || 'Has Error', type: 'error', showClose: true })
        })
      _this.listLoading = false
    },
    // 查看日志统计数据
    getStatisticData() {
      const _this = this
      _this.$store
        .dispatch('log/getStatisticData')
        .then(function(response) {
          if (response != null) {
            _this.lineChartData = response
          } else {
            _this.lineChartData = []
          }
        })
        .catch(function(error) {
          console.log(error)
          _this.$message({ message: error.msg || 'Has Error', type: 'error', showClose: true })
        })
    },
    // 打开新增、编辑界面
    openEditDialog(action, row) {
      this.$refs.editForm.show(action, row)
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.timeout {
  margin-left: 10px;
}
</style>
