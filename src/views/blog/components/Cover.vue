<template>
  <el-dialog :title="dialogTitle" :visible="dialogFormVisible" :modal="dialogFormVisible" :close-on-click-modal="false" custom-class="dl-width-custom" :width="'600px'" @close="btnCancel_Click">
    <div class="body">
      <el-form ref="formMain" label-width="120px">
        <el-row>
          <el-col>
            <el-upload
              ref="upload"
              class="avatar-uploader"
              :action="uploadPath"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleCoverSelect"
              :on-success="handleAvatarSuccess"
            >
              <img v-if="coverUrl" :src="coverUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitUpload">上 传</el-button>
      <el-button v-if="coverUrl" type="danger" class="margin-l10" @click="deleteCover">删 除</el-button>
      <el-button type="primary" plain class="margin-l10" @click="btnCancel_Click">关 闭</el-button>
    </div>
  </el-dialog>
</template>
<script>

export default {
  data() {
    return {
      dialogTitle: '博客封面', // 对话框标题
      dialogFormVisible: false, // 控制窗口是否可见
      loading: false, // 控制列表显示加载中
      disabled: false,
      coverUrl: '',
      uploadPath: process.env.VUE_APP_BASE_API + '/file/upload'
    }
  },
  methods: {
    show(data) {
      // 字段初始化
      this.dialogFormVisible = true
      if (data != null && data !== undefined) {
        this.coverUrl = data
      }
    },
    // 手动上传文件
    submitUpload() {
      if (!this.coverUrl) {
        this.$message.error('请先选择图片!')
        return
      }
      this.$refs.upload.submit()
      this.dialogFormVisible = false
    },
    deleteCover() {
      this.coverUrl = ''
      this.$parent.postForm.coverUrl = ''
    },
    // 文件上传成功
    handleAvatarSuccess(res, file) {
      this.$parent.postForm.coverUrl = res
      this.coverUrl = ''
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
      this.coverUrl = URL.createObjectURL(file.raw)
    },
    // 关闭窗口
    btnCancel_Click() {
      this.dialogFormVisible = false
      this.$refs.formMain.resetFields()
      this.coverUrl = ''
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
