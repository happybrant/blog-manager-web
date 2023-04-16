<template>
  <div class="app-container">

    <el-row :gutter="20">
      <el-col :span="12">
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
            <TreeTable ref="tree" :selection-type="false" node-key="id" :expand-type="false" :stripe="true" :is-fold="false" border :data="categoryList" :columns="columns">
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
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <div class="title">
              <span>标签列表</span>
            </div>
          </div>
          <el-tag
            v-for="tag in dynamicTags"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="deleteTag(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="inputVisible"
            ref="saveTagInput"
            v-model="inputValue"
            class="input-new-tag"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          />
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
        </el-card>
      </el-col>
      <el-col :span="12" style="margin-top:15px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <div class="title">
              <span>博客设置</span>
            </div>
          </div>
          <el-form ref="form" label-width="80px" :inline="true" class="demo-form-inline">
            <el-form-item label="展示名">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="职业">
              <el-input v-model="form.title" />
            </el-form-item>
            <el-form-item label="现居地">
              <el-input v-model="form.location" />
            </el-form-item>
            <el-form-item label="个人路由">
              <el-input v-model="form.routing">
                <template slot="prepend">http://localhost:8080/#/</template>
                <el-button slot="append" icon="el-icon-position" title="跳转到前端页面" @click="jump" />
              </el-input>
            </el-form-item>
            <el-form-item label="展示控件">
              <el-checkbox-group v-model="form.controls">
                <el-checkbox label="分类" name="category" />
                <el-checkbox label="标签" name="tag" />
                <el-checkbox label="归档" name="archive" />
                <el-checkbox label="最近文章" name="recentPost" />
                <el-checkbox label="链接" name="link" />
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="头像" prop="imageUrl" style="display:block">
              <el-upload
                ref="upload"
                class="avatar-uploader"
                :action="uploadPath"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="handleCoverSelect"
                :on-error="handleAvatarError"
                :on-success="handleAvatarSuccess"
              >
                <img v-if="form.avatarUrl" :src="form.avatarUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </el-form-item>
            <el-form-item style="display:block">
              <el-button type="primary" @click="onSubmit">保存</el-button>
            </el-form-item>
          </el-form>
        </el-card>

      </el-col>
    </el-row>
    <EditCategoryForm ref="editCategoryForm" />
  </div>

</template>

<script>
import TreeTable from 'vue-table-with-tree-grid'
import { parseTime } from '@/utils/index'
import EditCategoryForm from '@/views/blog/editCategory'
export default {

  name: 'DragTable',
  components: { TreeTable, EditCategoryForm },
  data() {
    return {
      categoryList: [],
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
          headerAlign: 'center',
          width: 250
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
          template: 'id' }
      ],
      total: 0,
      listLoading: true,
      dynamicTags: [],
      tagList: [],
      inputVisible: false,
      inputValue: '',
      maxOrder: '',
      form: {
        id: '',
        name: '',
        title: '',
        location: '',
        controls: [],
        avatarUrl: '',
        routing: ''
      },
      uploadPath: process.env.VUE_APP_BASE_API + '/file/upload'

    }
  },
  mounted() {
    this.getCategoryList()
    this.getTagList()
    this.getSettingByCurrentUser()
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
      _this.listLoading = true
      _this.$store
        .dispatch('blog/getCategoryList')
        .then(function(response) {
          if (response != null && response.code === 200 && response.data.length > 0) {
            _this.categoryList = response.data
            _this.maxOrder = _this.getMaxorder(_this.categoryList)
          } else {
            _this.categoryList = []
          }
          _this.listLoading = false
          _this.oldList = _this.categoryList.map(v => v.id)
          _this.newList = _this.oldList.slice()
        })
        .catch(function(error) {
          _this.$message({ message: error.msg || 'Has Error', type: 'error', showClose: true })
          _this.listLoading = false
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
        siblings = this.categoryList.find(item => item.id === row.parentId).children
        if (siblings.length <= 1) {
          this.$message({ message: '当前是第一行，无法上移', type: 'warning', showClose: true })
          return
        }
      }
      // 获取当前节点在兄弟节点中的下标
      const index = siblings.findIndex(item => item.id === row.id)
      if (index === 0) {
        this.$message({ message: '当前是第一行，无法上移', type: 'warning', showClose: true })
        return
      }
      const nodeList = []
      const curNode = siblings[index]
      const preNode = siblings[index - 1]
      // 调换两个节点的order
      const temOrder = preNode.order
      preNode.order = curNode.order
      curNode.order = temOrder
      nodeList.push({ 'id': curNode.id, 'order': curNode.order }, { 'id': preNode.id, 'order': preNode.order })
      // 调换两个节点的顺序
      siblings[index - 1] = curNode
      siblings[index] = preNode
      this.updateCategories(nodeList)
    },
    moveDown(row) {
      let siblings = this.categoryList
      if (row.parentId !== 0) {
        // 获取当前节点所有的兄弟节点
        siblings = this.categoryList.find(item => item.id === row.parentId).children
        if (siblings.length <= 1) {
          this.$message({ message: '当前是最后一行，无法下移', type: 'warning', showClose: true })
          return
        }
      }
      // 获取当前节点在兄弟节点中的下标
      const index = siblings.findIndex(item => item.id === row.id)
      if (index === siblings.length - 1) {
        this.$message({ message: '当前是最后一行，无法下移', type: 'warning', showClose: true })
        return
      }
      const nodeList = []
      const curNode = siblings[index]
      const nextNode = siblings[index + 1]
      // 调换两个节点的order
      const temOrder = nextNode.order
      nextNode.order = curNode.order
      curNode.order = temOrder
      nodeList.push({ 'id': curNode.id, 'order': curNode.order }, { 'id': nextNode.id, 'order': nextNode.order })
      // 调换两个节点的顺序
      siblings[index + 1] = curNode
      siblings[index] = nextNode
      this.updateCategories(nodeList)
    },
    updateCategories(parameters) {
      const _this = this
      _this.$store
        .dispatch('blog/updateCategory', parameters)
        .then(function(response) {
          if (response != null && response.code === 200) {
            _this.$message({ message: '操作成功', type: 'success', showClose: true })
            _this.dialogFormVisible = false
          } else {
            _this.$message({ message: response == null || response.message == null || response.message === '' ? '操作失败' : response.message, type: 'error', showClose: true })
          }
        })
        .catch(function(error) {
          _this.$message({ message: error.msg || 'Has Error', type: 'error', showClose: true })
        })
    },
    openEditDialog(action, row) {
      this.$refs.editCategoryForm.show(action, row)
    },
    handleSelectedEditRow() {
      const rows = this.$refs.dragTable.selection

      if (rows.length === 0) {
        this.$alert('请选择需要编辑的行', '提示', { type: 'warning' })
      } else if (rows.length > 1) {
        this.$alert('请选择一行', '提示', { type: 'warning' })
      } else {
        this.openEditDialog('edit', rows[0])
      }
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

        _this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
          .then(() => {
            _this.$store
              .dispatch('blog/deleteCategory', parameters)
              .then(function(response) {
                if (response != null && response.code === 200 && response.data.length > 0) {
                  _this.$message({ message: '操作成功', type: 'success', showClose: true })
                  _this.getCategoryList()
                } else {
                  _this.$message({ message: response.message, type: 'warning', showClose: true })
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
    // 查看所有标签
    getTagList() {
      const _this = this
      _this.$store
        .dispatch('blog/getTagList')
        .then(function(response) {
          if (response != null && response.code === 200 && response.data.length > 0) {
            _this.tagList = response.data
            _this.dynamicTags = response.data.map(x => x.name)
          } else {
            _this.dynamicTags = []
          }
        })
        .catch(function(error) {
          _this.$message({ message: error.msg || 'Has Error', type: 'error', showClose: true })
        })
    },
    // 新增标签
    addTag(name) {
      const _this = this
      const parameters = {}
      parameters.name = name
      _this.$store
        .dispatch('blog/addTag', parameters)
        .then(function(response) {
          if (response != null && response.code === 200 && response.data.length > 0) {
            _this.$message({ message: '操作成功', type: 'success', showClose: true })
          } else {
            _this.$message({ message: '操作失败', type: 'error', showClose: true })
          }
        })
        .catch(function(error) {
          _this.$message({ message: error.msg || 'Has Error', type: 'error', showClose: true })
        })
    },

    // 执行删除操作
    deleteTag(tag) {
      const _this = this
      const parameters = {}
      const id = this.tagList.find(x => x.name === tag).id
      parameters.id = id
      _this
        .$confirm('此操作将永久删除该数据，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          _this.$store
            .dispatch('blog/deleteTag', parameters)
            .then(function(response) {
              if (response != null && response.code === 200 && response.data.length > 0) {
                _this.dynamicTags.splice(_this.dynamicTags.indexOf(tag), 1)

                _this.$message({ message: '操作成功', type: 'success', showClose: true })
              } else {
                _this.$message({ message: '操作失败', type: 'error', showClose: true })
              }
            })
            .catch(function(error) {
              _this.$message({ message: error.msg || 'Has Error', type: 'error', showClose: true })
            })
        })
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
        this.addTag(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    getSettingByCurrentUser() {
      const _this = this
      _this.$store
        .dispatch('blog/getSettingByCurrentUser')
        .then(function(response) {
          if (response != null && response.code === 200 && response.data != null) {
            _this.form = response.data
          }
        })
        .catch(function(error) {
          console.log(error)
          _this.$message({ message: error.msg || 'Has Error', type: 'error', showClose: true })
        })
    },
    // 点击保存按钮
    onSubmit() {
      if (!this.form.avatarUrl) {
        this.$message.error('请先选择图片!')
        return
      }
      if (this.form.id && this.form.avatarUrl.indexOf(9000) > 0) {
        // 表明是更新操作且图片没有更新,不需要上传图片
        this.updateSetting()
      } else {
        this.$refs.upload.submit()
      }
    },
    // 添加设置
    addSetting() {
      const _this = this
      const parameters = {}
      parameters.name = this.form.name
      parameters.title = this.form.title
      parameters.location = this.form.location
      parameters.controls = this.form.controls
      parameters.avatarUrl = this.form.avatarUrl
      parameters.routing = this.form.routing
      _this.$store
        .dispatch('blog/addSetting', parameters)
        .then(function(response) {
          if (response != null && response.code === 200 && response.data.length > 0) {
            _this.$message({ message: '操作成功', type: 'success', showClose: true })
          } else {
            _this.$message({ message: '操作失败', type: 'error', showClose: true })
          }
        })
        .catch(function(error) {
          console.log(error)
          _this.$message({ message: error.msg || 'Has Error', type: 'error', showClose: true })
        })
    },
    // 更新设置
    updateSetting() {
      const _this = this
      const parameters = {}
      parameters.id = this.form.id
      parameters.name = this.form.name
      parameters.title = this.form.title
      parameters.location = this.form.location
      parameters.controls = this.form.controls
      parameters.avatarUrl = this.form.avatarUrl
      parameters.routing = this.form.routing
      _this.$store
        .dispatch('blog/updateSetting', parameters)
        .then(function(response) {
          if (response != null && response.code === 200 && response.data.length > 0) {
            _this.$message({ message: '操作成功', type: 'success', showClose: true })
          } else {
            _this.$message({ message: '操作失败', type: 'error', showClose: true })
          }
        })
        .catch(function(error) {
          _this.$message({ message: error.msg || 'Has Error', type: 'error', showClose: true })
        })
    },
    // 文件选取时触发此方法
    handleCoverSelect(file, fileList) {
      const types = ['image/jpeg', 'image/png']
      const isJPG = types.indexOf(file.raw.type) > -1
      const isLt50M = file.size / 1024 / 1024 < 50

      if (!isJPG) {
        this.$message.error('只能上传图片')
        return false
      }
      if (!isLt50M) {
        this.$message.error('上传头像图片大小不能超过 50MB!')
        return false
      }
      this.form.avatarUrl = URL.createObjectURL(file.raw)
    },
    // 图片上传失败
    handleAvatarError(err, file, fileList) {
      this.$message.error('图片上传失败' + err)
    },
    // 文件上传成功
    handleAvatarSuccess(res, file) {
      this.form.avatarUrl = res
      if (this.form.id) {
        this.updateSetting()
      } else {
        this.addSetting()
      }
    },
    jump() {
      const tempwindow = window.open('_blank')
      tempwindow.location.href = 'http://localhost:8080/#/' + this.form.routing + '/articles'
    }
  }
}
</script>

<style scoped>
::v-deep .sortable-ghost{
  opacity: .8;
  color: #fff!important;
  background: #42b983!important;
}
</style>

<style lang="scss" scoped>
.icon-star{
  margin-right:2px;
}
.drag-handler{
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.show-d{
  margin-top: 15px;
}

.el-tag {
    margin-left: 10px;
    margin-top: 10px;
  }
  .button-new-tag {
    margin-top: 10px;
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .title{
  font-size: 20px;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
    position: relative;
}
.btn-wrap{
    position: absolute;
    right: 0;
}
::v-deep .treetable-row {
  height: 40px;
}
::v-deep .zk-icon-plus-square-o:before {
    content: "" !important;
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
    content: "" !important;
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
::v-deep .zk-table{
  font-size: 14px;

  .treetable-row {
      height: 40px;
    }
  .zk-icon-plus-square-o:before {
      content: "" !important;
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
      content: "" !important;
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
.icon{
    color: #409EFF;
    margin: 0 5px;
    vertical-align: middle;
    text-align: center;
    font-size: 16px;
}
::v-deep .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

</style>
