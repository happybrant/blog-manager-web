<template>
  <div class="main-conent-screen">
    <div class="screen-header">
      <el-row>
        <el-col>
          <el-button type="primary" icon="el-icon-plus" @click="openEditNoteCategoryDialog('add',null)">新增</el-button>
          <el-button type="warning" icon="el-icon-delete" @click="batchDeleteCategory()">批量删除</el-button>
          <el-input
            v-model="listQuery.keyword"
            class="margin-l10"
            style="width:15%;"
            placeholder="请输入名称或者编码搜索"
            @keyup.enter.native="getNoteCategoryList"
          >
            <i slot="suffix" class="el-input__icon el-icon-search cursor-pointer" @click="getNoteCategoryList" />
          </el-input>
        </el-col>
        <el-col />
      </el-row>
    </div>
    <el-table ref="noteCategoryList" v-loading="isLoading" :data="noteCategoryList" border fit highlight-current-row style="width: 100%">
      <el-table-column type="selection" width="60" align="center" :selectable="selectable" />
      <el-table-column align="center" label="序号" width="65" type="index" :index="indexAdd" />
      <el-table-column width="180px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime,'{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column width="300px" label="分类名称" prop="name" />
      <el-table-column class-name="status-col" label="编码" prop="code" width="140" />
      <el-table-column class-name="status-col" label="描述" prop="description" />
      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">
          <i v-if="scope.row.code != 'default'" class="el-icon-edit icon" title="编辑节点" @click="openEditNoteCategoryDialog('edit',scope.row)" />
          <i class="el-icon-top icon" title="上移" @click="moveUp(scope.row)" />
          <i class="el-icon-bottom icon" title="下移" @click="moveDown(scope.row)" />
          <i v-if="scope.row.code != 'default'" class="el-icon-delete icon" title="删除节点" @click="deleteCategory(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getNoteCategoryListPager" />
    <EditNoteCategoryForm ref="editNoteCategoryForm" />
  </div>
</template>

<script>
import { parseTime } from '@/utils/index'
import EditNoteCategoryForm from '@/views/setting/editNoteCategory'
import Pagination from '@/components/Pagination'
import { resetRouter } from '@/router'
export default {
  name: 'NoteCategoryTable',
  components: { EditNoteCategoryForm, Pagination },
  data() {
    return {
      total: 0,
      noteCategoryList: [],
      isLoading: false,
      listQuery: {
        pageIndex: 1,
        pageSize: 10
      }
    }
  },
  mounted() {
    this.getNoteCategoryListPager()
  },
  methods: {
    indexAdd(index) {
      this.noteCategoryList[index].index = index + 1
      return index + 1
    },
    parseTime(time) {
      return parseTime(time, '{y}-{m}-{d} {h}:{i}')
    },
    // 设置 列表是否可选，当为默认分类时，不可选
    selectable(row, index) {
      if (row.code === 'default') {
        return false
      } else {
        return true
      }
    },
    moveUp(row) {
      const index = row.index - 1
      if (index === 0) {
        this.$message({
          message: '当前是第一行，无法上移',
          type: 'warning',
          showClose: true
        })
        return
      }
      const nodeList = []
      const curNode = this.noteCategoryList[index]
      const preNode = this.noteCategoryList[index - 1]
      // 调换两个节点的order
      const temOrder = preNode.order
      preNode.order = curNode.order
      curNode.order = temOrder
      nodeList.push(
        { id: curNode.id, order: curNode.order },
        { id: preNode.id, order: preNode.order }
      )
      this.updateCategories(nodeList)
    },
    moveDown(row) {
      const index = row.index
      if (index === this.total) {
        this.$message({
          message: '当前是最后一行，无法下移',
          type: 'warning',
          showClose: true
        })
        return
      }
      const nodeList = []
      const curNode = this.noteCategoryList[index - 1]
      const nextNode = this.noteCategoryList[index]
      // 调换两个节点的order
      const temOrder = nextNode.order
      nextNode.order = curNode.order
      curNode.order = temOrder
      nodeList.push(
        { id: curNode.id, order: curNode.order },
        { id: nextNode.id, order: nextNode.order }
      )
      this.updateCategories(nodeList)
    },
    // 更新博客分类
    updateCategories(categories) {
      const _this = this
      _this.$store
        .dispatch('note/updateNoteCategory', categories)
        .then(function(response) {
          if (response != null && response.code === 200) {
            _this.getNoteCategoryListPager()
            _this.refreshRouter()
            _this.$message({ message: '操作成功', type: 'success', showClose: true })
          } else {
            _this.$message({ message: response == null || response.message == null ||
            response.message === '' ? '操作失败' : response.message, type: 'error', showClose: true })
          }
        })
        .catch(function(error) {
          _this.$message({ message: error.msg || 'Has Error', type: 'error', showClose: true })
        })
    },
    // 点击批量删除按钮
    batchDeleteCategory() {
      const rows = this.$refs.noteCategoryList.selection
      if (rows.length === 0) {
        this.$alert('请选择需要删除的行', '提示', { type: 'warning' })
      } else {
        var ids = rows.map(item => item.id)
        this.doDeleteCategory(ids)
      }
    },
    // 点击删除按钮
    deleteCategory(row) {
      var ids = []
      ids.push(row.id)
      this.doDeleteCategory(ids)
    },
    doDeleteCategory(ids) {
      const _this = this
      _this.isLoading = true
      _this
        .$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          _this.$store
            .dispatch('note/deleteNoteCategory', ids)
            .then(function(response) {
              if (
                response != null &&
                  response.code === 200 &&
                  response.data.length > 0
              ) {
                _this.$message({
                  message: '操作成功',
                  type: 'success',
                  showClose: true
                })
                _this.getNoteCategoryList()
                _this.refreshRouter()
              } else {
                _this.$message({
                  message: response.message,
                  type: 'warning',
                  showClose: true
                })
                _this.isLoading = false
              }
            })
            .catch(function(error) {
              _this.$message({
                message: error.msg || 'Has Error',
                type: 'error',
                showClose: true
              })
              _this.isLoading = false
            })
        }).catch(() => {
          _this.isLoading = false
        })
    },
    // 打开笔记分类编辑界面
    openEditNoteCategoryDialog(action, row) {
      this.$refs.editNoteCategoryForm.show(action, row)
    },
    getNoteCategoryList() {
      this.listQuery.pageIndex = 1
      this.listQuery.pageSize = 10
      this.getNoteCategoryListPager()
    },
    // 分页获取笔记分类列表
    getNoteCategoryListPager() {
      const _this = this
      _this.isLoading = true
      _this.$store
        .dispatch('note/getNoteCategoryListPager', _this.listQuery)
        .then(function(response) {
          if (
            response != null &&
            response.code === 200 &&
            response.data != null
          ) {
            _this.noteCategoryList = response.data.records
            _this.total = response.data.total
          } else {
            _this.noteCategoryList = []
          }
          _this.isLoading = false
        })
        .catch(function(error) {
          _this.$message({
            message: error.msg || 'Has Error',
            type: 'error',
            showClose: true
          })
          _this.isLoading = false
        })
    },
    // 刷新路由
    async refreshRouter() {
      const { roles, categoryList } = await this.$store.dispatch('user/getInfo')
      const accessRoutes = await this.$store.dispatch('permission/generateRoutes', { roles, categoryList })
      // 重置路由
      resetRouter()
      // 添加路由
      this.$router.addRoutes(accessRoutes)
    }
  }
}
</script>
<style scoped>
.icon {
  color: #409eff;
  margin: 0 5px;
  vertical-align: middle;
  text-align: center;
  font-size: 16px;
}
</style>
