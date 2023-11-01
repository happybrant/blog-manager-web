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
        <el-row>
          <el-col :span="24">
            <el-form-item label="编码" prop="code">
              <el-input v-model="form.code" placeholder="请填写分类编码" maxlength="15" show-word-limit />
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
      dialogTitle: '新增笔记分类', // 对话框标题
      dialogFormVisible: false, // 控制窗口是否可见
      loading: false, // 控制列表显示加载中
      form: { // 表单对象
        id: '',
        name: '',
        code: '',
        description: ''
      },
      formRules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'onblur' }],
        code: [{ required: true, message: '请输入分类编码', trigger: 'onblur' }],
        parentCategory: []
      },
      isLoading: false // 保存按钮是否加载状态

    }
  },
  methods: {
    show(action, data) {
      // 字段初始化
      this.dialogFormVisible = true
      this.form.name = ''
      this.form.description = ''
      this.form.code = ''
      this.form.id = ''
      if (action === 'add') {
        this.dialogTitle = '新增分类'
      } else {
        this.dialogTitle = '编辑分类'
        this.form.id = data.id
        this.form.name = data.name
        this.form.code = data.code
        this.form.description = data.description
      }
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
            parameters.code = _this.form.code

            if (_this.form.id != null) {
              parameters.id = _this.form.id
            }
            let requestMethod = ''
            if (_this.dialogTitle.indexOf('新增') > -1) {
              requestMethod = 'note/addNoteCategory'
            } else {
              requestMethod = 'note/updateNoteCategory'
              parameters = [parameters]
            }
            _this.isLoading = true
            _this.$store
              .dispatch(requestMethod, parameters)
              .then(function(response) {
                if (response != null && response.code === 200) {
                  _this.$message({ message: '操作成功', type: 'success', showClose: true })
                  _this.isLoading = false
                  _this.dialogFormVisible = false
                  _this.$parent.getNoteCategoryList()
                  _this.$parent.refreshRouter()
                } else {
                  _this.$message({ message: response == null || response.message == null ||
                  response.message === '' ? '操作失败' : response.message, type: 'error', showClose: true })
                  _this.isLoading = false
                }
              })
              .catch(function(error) {
                _this.$message({ message: error.msg || 'Has Error', type: 'error', showClose: true })
                _this.isLoading = false
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
      this.form.code = ''
      this.form.description = ''
      this.form.status = 1
    }
  }
}
</script>
