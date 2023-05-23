<template>
  <div class="app-container main-conent-screen">
    <div class="screen-header">
      <el-row>
        <el-col>
          <el-button type="warning" icon="el-icon-delete" @click="deleteArticle()">删除</el-button>
          <el-radio-group v-model="stateType" class="margin-l10" @change="getArticleList">
            <el-radio-button label="全部" />
            <el-radio-button label="发布" />
            <el-radio-button label="草稿" />
          </el-radio-group>
          <el-date-picker
            v-model="listQuery.createTime"
            class="margin-l10"
            align="right"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions"
            @change="getArticleList"
          />
          <!-- <el-select v-model="listQuery.categoryId" placeholder="请选择分类" clearable class="margin-l10" @change="getArticleList">
            <el-option
              v-for="item in categoryOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select> -->
          <el-select ref="select" v-model="categoryName" placeholder="请选择分类" clearable class="margin-l10" @clear="handleSelectClear" @remove-tag="handleRemoveTag">
            <el-option class="custom-tree" value="">
              <el-tree ref="tree" :data="categoryOptions" node-key="id" :props="defaultProps" highlight-current :expand-on-click-node="false" empty-text="暂无数据" v-on="$listeners" @node-click="handleNodeClick" />
            </el-option>
          </el-select>
          <el-input v-model="listQuery.title" class="margin-l10" style="width:15%;" placeholder="请输入标题搜索">
            <i slot="suffix" class="el-input__icon el-icon-search cursor-pointer" @click="getArticleList" />
          </el-input>
        </el-col>
        <el-col />
      </el-row>
    </div>
    <el-table ref="tableList" v-loading="listLoading" :data="articleList" border fit highlight-current-row style="width: 100%">
      <el-table-column type="selection" width="60" align="center" />
      <el-table-column align="center" label="序号" width="65" type="index" :index="indexAdd" />

      <el-table-column width="180px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime,'{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="所属分类">
        <template slot-scope="scope">
          <span>{{ scope.row.categoryName }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="状态" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status == 1 ? '已发布':'草稿' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="标题">
        <template slot-scope="{row}">
          <a class="link-type" @click="openViewDialog(row.id)">
            <span>{{ row.title }}</span>
          </a>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="标签" width="210">
        <template slot-scope="{row}">
          <el-tag v-for="element in row.tags" :key="element.id" class="margin-l10">
            {{ element.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column class-name="image-col" label="封面" width="210" style="padding:0">
        <template slot-scope="{row}">
          <el-image
            v-if="row.coverUrl"
            style="vertical-align: middle;width: 50px; height: 50px;"
            :src="row.coverUrl"
            :preview-src-list="coverList"
          />
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="作者">
        <template slot-scope="scope">
          <span>{{ scope.row.createUsername }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <router-link :to="{path:'/blog/edit',query:{id:scope.row.id}}">
            <el-button type="primary" size="small" icon="el-icon-edit">编辑</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getArticleList" />
    <ViewForm ref="viewForm" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { parseTime } from '@/utils/index'
import ViewForm from '@/views/blog/view'

export default {
  name: 'ArticleList',
  components: { Pagination, ViewForm },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '1': 'success',
        '2': 'info',
        '0': 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      articleList: null,
      total: 0,
      listLoading: true,
      stateType: '全部',
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        status: null,
        createTime: null,
        title: '',
        categoryId: null
      },
      categoryName: '',
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
      categoryOptions: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      coverList: []
    }
  },
  created() {
    this.getArticleList()
    this.getCategoryList()
  },
  methods: {
    indexAdd(index) {
      return index + 1 + (this.listQuery.pageIndex - 1) * this.listQuery.pageSize
    },
    parseTime(time, format) {
      return parseTime(time, format)
    },

    // 查看所有博客
    getArticleList() {
      const _this = this
      _this.listLoading = true
      _this.listQuery.status = _this.stateType === '全部' ? null : (_this.stateType === '发布' ? 1 : 2)
      _this.listQuery.createTime = _this.parseTime(_this.listQuery.createTime, '{y}-{m}-{d}')
      _this.$store
        .dispatch('blog/getArticleList', _this.listQuery)
        .then(function(response) {
          if (response != null && response.code === 200 && response.data.records != null) {
            _this.articleList = response.data.records
            _this.total = response.data.total
            // 将coverUrl属性取出来组成新数组
            _this.articleList.forEach(item => {
              if (item.coverUrl) {
                _this.coverList.push(item.coverUrl)
              }
            })
          } else {
            _this.articleList = []
          }
        })
        .catch(function(error) {
          _this.$message({ message: error.msg || 'Has Error', type: 'error', showClose: true })
        })
      _this.listLoading = false
    },
    // 获取所有分类
    getCategoryList() {
      const _this = this
      _this.listLoading = true
      _this.$store
        .dispatch('blog/getCategoryList')
        .then(function(response) {
          if (response != null && response.code === 200 && response.data.length > 0) {
            _this.categoryOptions = response.data
          } else {
            _this.categoryOptions = []
          }
          _this.listLoading = false
        })
        .catch(function(error) {
          _this.$message({ message: error.msg || 'Has Error', type: 'error', showClose: true })
          _this.listLoading = false
        })
    },
    // 点击删除按钮
    deleteArticle() {
      const rows = this.$refs.tableList.selection

      if (rows.length === 0) {
        this.$alert('请选择需要删除的行', '提示', { type: 'warning' })
      } else {
        var list = []
        for (var i = 0; i < rows.length; i++) {
          list.push(rows[i].id)
        }
        const _this = this
        _this.isLoading = true

        _this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
          .then(() => {
            _this.$store
              .dispatch('blog/deleteArticle', list)
              .then(function(response) {
                if (response != null && response.code === 200 && response.data.length > 0) {
                  _this.$message({ message: '操作成功', type: 'success', showClose: true })
                  _this.getArticleList()
                }
              })
              .catch(function(error) {
                _this.$message({ message: error.msg || 'Has Error', type: 'error', showClose: true })
                _this.isLoading = false
              })
          })
          .catch(() => { this.$message({ type: 'info', message: '已取消删除' }); _this.isLoading = false })
      }
    },
    // 打开预览视图
    openViewDialog(id) {
      const _this = this
      var parameters = {}
      parameters.id = id
      _this.$store
        .dispatch('blog/getArticleById', parameters)
        .then(function(response) {
          if (response != null && response.code === 200 && response.data != null) {
            const postForm = response.data
            postForm.tagIds = response.data.tags.map(item => item.id)
            _this.$refs.viewForm.show(postForm)
          } else {
            _this.$message({ message: '找不到博客信息', type: 'error', showClose: true })
          }
        })
        .catch(function(error) {
          console.log(error)
          _this.$message({ message: error.msg || 'Has Error', type: 'error', showClose: true })
        })
    },
    hiddenPopper() {
      this.$refs.select.blur()
    },

    // 选择树结构点击事件
    handleNodeClick(data) {
      this.listQuery.categoryId = data.id
      this.categoryName = data.name
      this.getArticleList()
      this.hiddenPopper()
    },

    handleSelectClear() {
      this.listQuery.categoryId = null
      this.categoryName = ''
      this.getArticleList()
    },

    handleRemoveTag(value) {
      const fileterValue = this.value.filter(item => item !== value)
      this.$emit('input', fileterValue)
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
.custom-tree {
  height: auto;
  padding: 0;
}
.el-select-dropdown__item.selected {
  font-weight: normal;
}
::v-deep .image-col {
  text-align: center;
  padding:0
}
</style>
