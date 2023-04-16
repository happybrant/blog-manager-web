<template>
  <el-dialog :title="dialogTitle" :visible="dialogFormVisible" :modal="dialogFormVisible" :close-on-click-modal="false" custom-class="dl-width-custom" :width="'710px'" @close="btnCancel_Click">
    <div class="body">
      <el-form ref="formMain" :model="form" :rules="formRules" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="名称" prop="name">
              <el-input ref="txtName" v-model="form.name" placeholder="请填写分组名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="描述">
              <el-input v-model="form.description" type="textarea" rows="5" placeholder="请填写描述信息" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="封面图片" prop="imageUrl">
              <el-upload
                class="avatar-uploader"
                :action="uploadPath"
                :auto-upload="true"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button ref="saveBtn" type="primary" :loading="isLoading" @click="btnSave_Click">保 存</el-button>
      <el-button v-if="dialogTitle == '编辑相册'" plain type="danger" class="margin-l10" @click="btnDelete_Click">删 除</el-button>
      <el-button type="primary" plain class="margin-l10" @click="btnCancel_Click">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>

export default {
  data() {
    return {
      dialogTitle: '新增相册', // 对话框标题
      dialogFormVisible: false, // 控制窗口是否可见
      loading: false, // 控制列表显示加载中
      disabled: false,
      form: { // 表单对象
        id: '',
        name: '',
        imageUrl: '',
        description: ''
      },
      formRules: {
        name: [{ required: true, message: '请输入相册名称', trigger: 'onblur' }],
        imageUrl: [{ required: true, message: '请上传相册封面照片', trigger: 'change' }]
      },
      uploadPath: process.env.VUE_APP_BASE_API + '/file/upload',
      isLoading: false // 保存按钮是否加载状态
    }
  },
  methods: {
    show(action, data) {
      // 字段初始化
      this.dialogFormVisible = true
      this.dialogTitle = action === 'add' ? '新增相册' : '编辑相册'

      this.form.id = ''
      this.form.name = ''
      this.form.imageUrl = ''
      this.form.description = ''

      if (data != null && data !== undefined) {
        this.form.id = data.id
        this.form.name = data.name
        this.form.imageUrl = data.imageUrl
        this.form.description = data.description
      }
    },
    // 点击确定按钮
    btnSave_Click() {
      this.$refs.formMain.validate(valid => {
        if (valid) {
          const _this = this
          var parameters = {}
          if (_this.form.id != null) {
            parameters.id = _this.form.id
          }

          parameters.name = _this.form.name
          parameters.imageUrl = _this.form.imageUrl
          parameters.description = _this.form.description

          let requestMethod = ''
          if (_this.dialogTitle === '新增相册') {
            requestMethod = 'album/addAlbum'
          } else {
            requestMethod = 'album/updateAlbum'
          }
          _this.$store
            .dispatch(requestMethod, parameters)
            .then(function(response) {
              if (response != null && response.code === 200) {
                _this.$message({ message: '操作成功', type: 'success', showClose: true })
                _this.dialogFormVisible = false
                _this.$parent.getAlbumListPager()
              } else {
                _this.$message({ message: response == null || response.message == null || response.message === '' ? '操作失败' : response.message, type: 'error', showClose: true })
              }
            })
            .catch(function(error) {
              _this.$message({ message: error.msg || 'Has Error', type: 'error', showClose: true })
            })
        }
      })
    },
    btnDelete_Click() {
      const _this = this
      var parameters = {}
      parameters.id = _this.form.id
      _this
        .$confirm('此操作将永久删除该数据，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          _this.$store
            .dispatch('album/deleteAlbum', parameters)
            .then(function(response) {
              if (response != null && response.code === 200) {
                _this.$message({ message: '操作成功', type: 'success', showClose: true })
                _this.dialogFormVisible = false
                _this.$parent.getAlbumListPager()
              } else {
                _this.$message({ message: response == null || response.message == null || response.message === '' ? '操作失败' : response.message, type: 'error', showClose: true })
              }
            })
            .catch(function(error) {
              _this.$message({ message: error.msg || 'Has Error', type: 'error', showClose: true })
            })
        })
    },

    handleAvatarSuccess(res, file) {
      this.form.imageUrl = res
    },
    beforeAvatarUpload(file) {
      const types = ['image/jpeg', 'image/png']
      const isJPG = types.indexOf(file.type) > -1
      const isLt2M = file.size / 1024 / 1024 < 50

      if (!isJPG) {
        this.$message.error('只能上传图片')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 50MB!')
      }
      return isJPG && isLt2M
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
  ::v-deep .el-upload-list__item-actions .el-upload-list__item-delete {
    position: static;
    font-size: inherit;
    color: inherit;
}
 ::v-deep .el-upload-list__item-actions span {
    display: none;
    cursor: pointer;
}
 ::v-deep .el-upload-list__item-actions {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    cursor: default;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0,0,0,.5);
    -webkit-transition: opacity .3s;
    transition: opacity .3s;
}
::v-deep .el-upload-list__item-actions:hover {
    opacity: 1;
}
::v-deep.el-upload-list__item-actions:hover span {
    display: inline-block;
}
.el-upload-list__item-actions:after {
    display: inline-block;
    content: "";
    height: 100%;
    vertical-align: middle;
}
</style>
