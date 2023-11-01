<template>
  <el-dialog :title="dialogTitle" :visible="dialogFormVisible" :modal="dialogFormVisible" :close-on-click-modal="false" custom-class="dl-width-custom" :width="'710px'" @close="btnCancel_Click">
    <div class="body">
      <el-form ref="formMain" :model="form" label-width="120px" :rules="formRules">
        <el-row>
          <el-col>
            <el-form-item label="展示名" prop="name">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="职业" prop="title">
              <el-input v-model="form.title" />
            </el-form-item>
            <el-form-item label="现居地" prop="location">
              <el-input v-model="form.location" />
            </el-form-item>
            <el-form-item label="请填写路由" prop="routing">
              <el-input v-model="form.routing">
                <template slot="prepend">{{ frontApi }}</template>
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
            <el-form-item label="头像" prop="avatarUrl" style="display:block">
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

          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button ref="saveBtn" type="primary" :loading="isLoading" @click="btnSave_Click">确 定</el-button>
      <el-button type="primary" plain class="margin-l10" @click="btnCancel_Click">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      dialogTitle: '修改前端路由', // 对话框标题
      dialogFormVisible: false, // 控制窗口是否可见
      form: {
        id: '',
        routing: ''
      },
      uploadPath: process.env.VUE_APP_BASE_API + '/file/upload',
      frontApi: process.env.VUE_APP_FRONT_API,
      isLoading: false, // 保存按钮是否加载状态
      formRules: {
        name: [
          { required: true, message: '展示名不能为空', trigger: 'onblur' }
        ],
        title: [{ required: true, message: '职业不能为空', trigger: 'onblur' }],
        location: [
          { required: true, message: '展示名不能为空', trigger: 'onblur' }
        ],
        routing: [
          { required: true, message: '路由不能为空', trigger: 'onblur' }
        ],
        fullRouting: [
          { required: true, message: '路由不能为空', trigger: 'onblur' }
        ],
        avatarUrl: [
          { required: true, message: '请上传头像', trigger: 'onblur' }
        ]
      }
    }
  },
  methods: {
    show(form) {
      // 字段初始化
      this.dialogFormVisible = true
      this.form = form
    },
    // 点击保存按钮
    btnSave_Click() {
      this.$refs.formMain.validate((valid) => {
        if (valid) {
          this.isLoading = true
          if (this.form.id && this.form.avatarUrl.indexOf(9000) > 0) {
            // 表明是更新操作且图片没有更新,不需要上传图片
            this.updateSetting()
          } else {
            this.$refs.upload.submit()
          }
        }
      })
    },
    // 文件选取时触发此方法
    handleCoverSelect(file, fileList) {
      // 文件上传时也会触发该方法
      if (file.response != null) {
        return
      }
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
          if (
            response != null &&
            response.code === 200 &&
            response.data != null
          ) {
            _this.isLoading = false
            _this.dialogFormVisible = false
            _this.$parent.getSettingByCurrentUser()
            _this.$message({
              message: '操作成功',
              type: 'success',
              showClose: true
            })
          } else {
            _this.$message({
              message: '操作失败',
              type: 'error',
              showClose: true
            })
            _this.isLoading = false
          }
        })
        .catch(function(error) {
          console.log(error)
          _this.$message({
            message: error.msg || 'Has Error',
            type: 'error',
            showClose: true
          })
          _this.isLoading = false
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
      _this.$store
        .dispatch('blog/updateSetting', parameters)
        .then(function(response) {
          if (
            response != null &&
            response.code === 200 &&
            response.data.length > 0
          ) {
            _this.isLoading = false
            _this.dialogFormVisible = false
            _this.$parent.getSettingByCurrentUser()
            _this.$message({
              message: '操作成功',
              type: 'success',
              showClose: true
            })
          } else {
            _this.$message({
              message: '操作失败',
              type: 'error',
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
    },

    // 关闭窗口
    btnCancel_Click() {
      this.dialogFormVisible = false
    }
  }
}
</script>
<style>
  .avatar-uploader .el-upload {
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
