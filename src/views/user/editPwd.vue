<template>
  <el-dialog :title="dialogTitle" :visible="dialogFormVisible" :modal="dialogFormVisible" :close-on-click-modal="false" custom-class="dl-width-custom" :width="'710px'" @close="btnCancel_Click">
    <div class="body">
      <el-form ref="formMain" :model="form" :rules="formRules" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="原密码" prop="oldPwd">
              <el-input v-model="form.oldPwd" type="password" placeholder="请填写原密码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="新密码" prop="newPwd">
              <el-input v-model="form.newPwd" type="password" placeholder="请填写新密码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="确认新密码" prop="confirmNewPwd">
              <el-input v-model="form.confirmNewPwd" type="password" placeholder="请确认新密码" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button ref="saveBtn" type="primary" :loading="isLoading" @click="btnSave_Click">保 存</el-button>
      <el-button type="primary" plain class="margin-l10" @click="btnCancel_Click">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>

export default {
  data() {
    var validateOldPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入原密码'))
      } else {
        if (this.form.newPwd !== '') {
          this.$refs.formMain.validateField('newPwd')
        }
        callback()
      }
    }
    var validateNewPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (this.form.confirmNewPwd !== '') {
          this.$refs.formMain.validateField('confirmNewPwd')
        }
        callback()
      }
    }
    var validateConfirmPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请确认新密码'))
      } else if (value !== this.form.newPwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      dialogTitle: '修改密码', // 对话框标题
      dialogFormVisible: false, // 控制窗口是否可见
      disabled: false,
      form: { // 表单对象
        id: '',
        oldPwd: '',
        newPwd: '',
        confirmNewPwd: ''
      },
      formRules: {
        oldPwd: [{ validator: validateOldPwd, trigger: 'blur' }],
        newPwd: [{ validator: validateNewPwd, trigger: 'blur' }],
        confirmNewPwd: [{ validator: validateConfirmPwd, trigger: 'blur' }]
      },
      isLoading: false // 保存按钮是否加载状态
    }
  },
  methods: {
    show(id) {
      // 字段初始化
      this.dialogFormVisible = true
      this.form.id = id
    },
    // 点击确定按钮
    btnSave_Click() {
      this.$refs.formMain.validate(valid => {
        if (valid) {
          const _this = this
          var parameters = {}
          parameters.id = _this.form.id
          parameters.newPwd = _this.form.newPwd
          parameters.oldPwd = _this.form.oldPwd
          _this.$store
            .dispatch('user/updatePwd', parameters)
            .then(function(response) {
              if (response != null && response.code === 200) {
                _this.$message({ message: '操作成功', type: 'success', showClose: true })
                _this.dialogFormVisible = false
                _this.$store.dispatch('user/logout')
                _this.$router.push(`/login?redirect=${_this.$route.fullPath}`)
              } else {
                _this.$message({ message: response == null || response.message == null || response.message === '' ? '操作失败' : response.message, type: 'error', showClose: true })
              }
            })
            .catch(function(error) {
              console.log(error)
              _this.$message({ message: error.msg || 'Has Error', type: 'error', showClose: true })
            })
        }
      })
    },

    // 关闭窗口
    btnCancel_Click() {
      this.dialogFormVisible = false
      this.$refs.formMain.resetFields()
      this.form.name = ''
      this.form.imageUrl = ''
    }
  }
}
</script>

<style lang="scss" scoped>

::v-deep .el-form-item__label:before {
    content: '*';
    color: #F56C6C;
    margin-right: 4px;
}
</style>
