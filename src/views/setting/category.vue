<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="title">
          <span>分类列表</span>
          <div class="btn-wrap">
            <el-button type="primary" icon="el-icon-plus" @click="$event => addChild($event, 'add', null)">添加一级分类</el-button>
          </div>
        </div>
      </div>
      <section style="height:670px;overflow:auto">
        <TreeTable ref="tree" v-loading="isLoading" :selection-type="false" node-key="id" :expand-type="false" :stripe="true" :is-fold="false" border :data="categoryList" :columns="columns">
          <template slot="createTime" slot-scope="scope">
            <el-col prop="createTime" v-text="parseTime(scope.row.createTime)" />
          </template>
          <template slot="id" slot-scope="scope">
            <i v-if="scope.row.parentId == 0" class="el-icon-plus icon" title="添加子节点" @click="$event => addChild($event, 'add', scope.row)" />
            <i class="el-icon-edit icon" title="编辑节点" @click="$event => addChild($event, 'edit', scope.row)" />
            <i class="el-icon-delete icon" title="删除节点" @click="deleteCategory(scope.row)" />
            <i class="el-icon-top icon" title="上移" @click="moveUp(scope.row)" />
            <i class="el-icon-bottom icon" title="下移" @click="moveDown(scope.row)" />
          </template>
        </TreeTable>
      </section>
    </el-card>
    <EditCategoryForm ref="editCategoryForm" />
  </div>
</template>

<script>
import TreeTable from 'vue-table-with-tree-grid'
import { parseTime } from '@/utils/index'
import EditCategoryForm from '@/views/setting/editCategory'

export default {
  name: 'Category',
  components: { TreeTable, EditCategoryForm },
  data() {
    return {
      categoryList: [],
      isLoading: false,
      columns: [
        {
          label: '名称',
          prop: 'name',
          align: 'left',
          headerAlign: 'center',
          width: 160
        },
        {
          label: '描述',
          prop: 'description',
          align: 'left',
          headerAlign: 'center'
        },
        {
          label: '创建时间',
          prop: 'createTime',
          align: 'center',
          headerAlign: 'center',
          type: 'template',
          template: 'createTime',
          width: 160
        },
        {
          label: '操作',
          prop: 'id',
          align: 'center',
          headerAlign: 'center',
          type: 'template',
          template: 'id',
          width: 160
        }
      ],
      maxOrder: ''
    }
  },
  mounted() {
    this.getCategoryList()
  },
  methods: {
    indexAdd(index) {
      return index + 1
    },
    parseTime(time) {
      return parseTime(time, '{y}-{m}-{d} {h}:{i}')
    },
    getCategoryList() {
      const _this = this
      _this.isLoading = true
      _this.$store
        .dispatch('blog/getCategoryList')
        .then(function(response) {
          if (
            response != null &&
            response.code === 200 &&
            response.data.length > 0
          ) {
            _this.categoryList = response.data
            _this.maxOrder = _this.getMaxorder(_this.categoryList)
          } else {
            _this.categoryList = []
          }
          _this.isLoading = false
          _this.oldList = _this.categoryList.map((v) => v.id)
          _this.newList = _this.oldList.slice()
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
    // 获取最大排序
    getMaxorder(categoryList) {
      let maxOrder = categoryList[categoryList.length - 1].order
      for (const category of categoryList) {
        if (category.children != null || category.length > 0) {
          for (const child of category.children) {
            if (child.order > maxOrder) {
              maxOrder = child.order
            }
          }
        }
      }
      return maxOrder
    },
    addChild($event, action, row) {
      $event.stopPropagation()
      this.$refs.editCategoryForm.show(action, row)
    },
    moveUp(row) {
      let siblings = this.categoryList
      if (row.parentId !== 0) {
        // 获取当前节点所有的兄弟节点
        siblings = this.categoryList.find(
          (item) => item.id === row.parentId
        ).children
        if (siblings.length <= 1) {
          this.$message({
            message: '当前是第一行，无法上移',
            type: 'warning',
            showClose: true
          })
          return
        }
      }
      // 获取当前节点在兄弟节点中的下标
      const index = siblings.findIndex((item) => item.id === row.id)
      if (index === 0) {
        this.$message({
          message: '当前是第一行，无法上移',
          type: 'warning',
          showClose: true
        })
        return
      }
      const nodeList = []
      const curNode = siblings[index]
      const preNode = siblings[index - 1]
      // 调换两个节点的order
      const temOrder = preNode.order
      preNode.order = curNode.order
      curNode.order = temOrder
      nodeList.push(
        { id: curNode.id, order: curNode.order },
        { id: preNode.id, order: preNode.order }
      )
      // 调换两个节点的顺序
      siblings[index - 1] = curNode
      siblings[index] = preNode
      this.updateCategories(nodeList)
    },
    moveDown(row) {
      let siblings = this.categoryList
      if (row.parentId !== 0) {
        // 获取当前节点所有的兄弟节点
        siblings = this.categoryList.find(
          (item) => item.id === row.parentId
        ).children
        if (siblings.length <= 1) {
          this.$message({
            message: '当前是最后一行，无法下移',
            type: 'warning',
            showClose: true
          })
          return
        }
      }
      // 获取当前节点在兄弟节点中的下标
      const index = siblings.findIndex((item) => item.id === row.id)
      if (index === siblings.length - 1) {
        this.$message({
          message: '当前是最后一行，无法下移',
          type: 'warning',
          showClose: true
        })
        return
      }
      const nodeList = []
      const curNode = siblings[index]
      const nextNode = siblings[index + 1]
      // 调换两个节点的order
      const temOrder = nextNode.order
      nextNode.order = curNode.order
      curNode.order = temOrder
      nodeList.push(
        { id: curNode.id, order: curNode.order },
        { id: nextNode.id, order: nextNode.order }
      )
      // 调换两个节点的顺序
      siblings[index + 1] = curNode
      siblings[index] = nextNode
      this.updateCategories(nodeList)
    },

    // 点击删除按钮
    deleteCategory(row) {
      const children = row.children
      if (children.length > 0) {
        this.$alert('请先删除子分类', '提示', { type: 'warning' })
      } else {
        const _this = this
        var parameters = {}
        parameters.id = row.id
        _this.isLoading = true

        _this
          .$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            _this.$store
              .dispatch('blog/deleteCategory', parameters)
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
                  _this.getCategoryList()
                } else {
                  _this.$message({
                    message: response.message,
                    type: 'warning',
                    showClose: true
                  })
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
          })
          .catch(() => {
            this.$message({ type: 'info', message: '已取消删除' })
            _this.isLoading = false
          })
      }
    }

  }
}
</script>

<style scoped>
::v-deep .sortable-ghost {
  opacity: 0.8;
  color: #fff !important;
  background: #42b983 !important;
}
</style>

<style lang="scss" scoped>
.title{
  font-size: 20px;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
    position: relative;
}
.btn-wrap {
  position: absolute;
  right: 0;
}
::v-deep .treetable-row {
  height: 40px;
}
::v-deep .zk-icon-plus-square-o:before {
  content: '' !important;
  display: inline-block;
  width: 15px;
  height: 15px;
  background: url('../../assets/images/right.png') no-repeat;
  background-size: 100% 100%;
  position: relative;
  top: 3px;
  left: 2px;
}
::v-deep .zk-icon-minus-square-o:before {
  content: '' !important;
  display: inline-block;
  width: 15px;
  height: 15px;
  background: url('../../assets/images/down.png') no-repeat;
  background-size: 100% 100%;
  position: relative;
  top: 3px;
}
::v-deep .zk-table__body-row {
  height: 40px !important;
  cursor: pointer;
}
::v-deep .zk-table {
  font-size: 14px;

  .treetable-row {
    height: 40px;
  }
  .zk-icon-plus-square-o:before {
    content: '' !important;
    display: inline-block;
    width: 15px;
    height: 15px;
    background: url('../../assets/images/right.png') no-repeat;
    background-size: 100% 100%;
    position: relative;
    top: 3px;
    left: 2px;
  }
  .zk-icon-minus-square-o:before {
    content: '' !important;
    display: inline-block;
    width: 15px;
    height: 15px;
    background: url('../../assets/images/down.png') no-repeat;
    background-size: 100% 100%;
    position: relative;
    top: 3px;
  }
  .zk-table__body-row {
    height: 40px !important;
    cursor: pointer;
  }
}
.icon {
  color: #409eff;
  margin: 0 5px;
  vertical-align: middle;
  text-align: center;
  font-size: 16px;
}
</style>
