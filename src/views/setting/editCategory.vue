<template>
  <el-dialog :title="dialogTitle" :visible="dialogFormVisible" :modal="dialogFormVisible" :close-on-click-modal="false" custom-class="dl-width-custom" :width="'710px'" @close="btnCancel_Click">
    <div class="body">
      <el-form ref="formMain" :model="form" :rules="formRules" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" placeholder="请填写分类名称" maxlength="15" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="isParentShow">
          <el-col>
            <el-form-item label="上级目录" prop="parentCategory">
              <el-select ref="selType" v-model="form.parentCategory" clearable filterable placeholder="请选择上级目录" style="width:100%;">
                <el-option v-for="(item,index) in form.parentCategoryList" :key="index" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="描述">
              <el-input v-model="form.description" type="textarea" rows="4" placeholder="请填写描述信息" maxlength="100" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="isLoading" @click="btnSaveCategory_Click">保 存</el-button>
      <el-button type="primary" plain class="margin-l10" @click="btnCancel_Click">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      dialogTitle: '新增分类', // 对话框标题
      dialogFormVisible: false, // 控制窗口是否可见
      loading: false, // 控制列表显示加载中
      form: { // 表单对象
        id: '',
        name: '',
        description: '',
        parentCategory: 0,
        order: '',
        path: '',
        parentCategoryList: []
      },
      formRules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'onblur' }],
        parentCategory: []
      },
      isLoading: false, // 保存按钮是否加载状态
      isParentShow: false // 父分类是否展示
    }
  },
  methods: {
    show(action, data) {
      // 字段初始化
      this.dialogFormVisible = true
      this.isParentShow = false
      this.form.name = ''
      this.form.description = ''
      this.form.order = ''
      this.form.path = ''
      this.form.parentCategory = 0
      this.form.parentCategoryList = []
      this.formRules.parentCategory = []
      if (action === 'add') {
        this.form.order = this.$parent.maxOrder + 1
        if (data != null) {
          this.dialogTitle = '新增子分类'
          this.form.parentCategory = data.id
          this.form.path = '/' + data.name
        } else {
          this.dialogTitle = '新增分类'
        }
      } else {
        this.dialogTitle = '编辑分类'
        this.form.id = data.id
        this.form.name = data.name
        this.form.description = data.description
        this.form.order = data.order
        this.form.path = data.path
        // 修改操作
        if (data.parentId !== 0) {
          this.dialogTitle = '编辑子分类'
          // 修改子节点
          this.isParentShow = true
          this.formRules.parentCategory = [{ required: true, message: '请选择上级分类', trigger: 'change' }]
          // 找到父节点层级的所有兄弟节点
          this.form.parentCategoryList = this.getSiblings(this.$parent.categoryList, data.parentId)
          this.form.parentCategory = data.parentId
        } else {
          this.formRules.parentCategory = []
        }
      }
    },
    // 获取父节点的兄弟节点
    getSiblings(tableData, parentId) {
      for (let i = 0; i < tableData.length; i++) {
        if (tableData[i].id === parentId) {
          return tableData
        } else {
          if (tableData[i].children != null && tableData[i].children.length > 0) {
            const data = this.getSiblings(tableData[i].children, parentId)
            if (data != null) {
              return data
            }
          }
        }
      }
    },
    // 获取父节点的名称
    getParentCategoryName() {
      let obj = {}
      obj = this.form.parentCategoryList.find(item => item.id === this.form.parentCategory)
      return obj.name
    },
    // 点击确定按钮
    btnSaveCategory_Click() {
      this.$refs.formMain.validate(valid => {
        if (valid) {
          const _this = this
          // 新增分类或者编辑分类时的操作
          if (_this.dialogTitle.indexOf('新增') > -1 || _this.dialogTitle.indexOf('编辑') > -1) {
            var parameters = {}

            parameters.name = _this.form.name
            parameters.description = _this.form.description
            parameters.order = _this.form.order
            parameters.parentId = _this.form.parentCategory

            if (_this.form.id != null) {
              parameters.id = _this.form.id
            }

            let requestMethod = ''
            if (_this.dialogTitle.indexOf('新增') > -1) {
              requestMethod = 'blog/addCategory'
              if (_this.dialogTitle.indexOf('子分类') > -1) {
                parameters.path = _this.form.path + '/' + _this.form.name
              } else {
                parameters.path = '/' + _this.form.name
              }
            } else {
              requestMethod = 'blog/updateCategory'
              if (_this.dialogTitle.indexOf('子分类') > -1) {
                parameters.path = '/' + _this.getParentCategoryName() + '/' + _this.form.name
              } else {
                parameters.path = '/' + _this.form.name
              }
              var list = []
              list.push(parameters)
              parameters = list
            }
            _this.$store
              .dispatch(requestMethod, parameters)
              .then(function(response) {
                if (response != null && response.code === 200) {
                  _this.$message({ message: '操作成功', type: 'success', showClose: true })
                  _this.dialogFormVisible = false
                  _this.$parent.getCategoryList()
                } else {
                  _this.$message({ message: response == null || response.message == null || response.message === '' ? '操作失败' : response.message, type: 'error', showClose: true })
                }
              })
              .catch(function(error) {
                _this.$message({ message: error.msg || 'Has Error', type: 'error', showClose: true })
              })
          }
        }
      })
    },
    // 关闭窗口
    btnCancel_Click() {
      this.dialogFormVisible = false
      this.$refs.formMain.resetFields()
      this.form.name = ''
      this.form.description = ''
      this.form.status = 1
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
