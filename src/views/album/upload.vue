<template>
  <el-dialog :title="dialogTitle" :visible="dialogFormVisible" :modal="dialogFormVisible" :close-on-click-modal="false" custom-class="dl-width-custom" :width="'710px'" @close="btnCancel_Click">
    <div class="body">
      <el-form ref="formMain" label-width="120px">
        <el-row>
          <el-col>
            <el-upload
              ref="upload"
              multiple
              action="/"
              :auto-upload="false"
              list-type="picture-card"
              :on-remove="handleUpload"
              :on-change="handleUpload"
            >
              <i class="el-icon-plus" style="text-align:center" />
            </el-upload>
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
import store from '@/store'

export default {
  data() {
    return {
      dialogTitle: '图片上传', // 对话框标题
      dialogFormVisible: false, // 控制窗口是否可见
      fileList: [],
      isLoading: false // 保存按钮是否加载状态
    }
  },
  methods: {
    show() {
      // 字段初始化
      this.dialogFormVisible = true
    },
    // 点击确定按钮
    btnSave_Click() {
      const _this = this
      // 文件大小
      let fileSize = 0
      const formData = new FormData()
      formData.append('albumId', _this.$parent.listQuery.albumId)
      if (_this.fileList.length > 0) {
        _this.fileList.forEach(element => {
          formData.append('files', element.raw)
          fileSize += element.raw.size / 1024 / 1024
        })
        if (fileSize < 50) {
          // 此时设置按钮不可点击,防止重复提交
          _this.isLoading = true
          const config = {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': 'Bearer ' + store.getters.token
            }
          }
          const url = process.env.VUE_APP_BASE_API + '/album/photo/add'
          this.$axios.post(url, formData, config)
            .then((response) => {
              response = response.data
              if (response != null && response.data != null && response.code === 200) {
                _this.$message({ message: '上传成功', type: 'success', showClose: true })
                _this.isLoading = false
                _this.dialogFormVisible = false
                _this.fileList = []
                _this.$refs.upload.clearFiles()
                _this.$parent.getPhotoListPager()
              } else {
                _this.$message({ message: response.message, type: 'error', showClose: true })
                _this.isLoading = false
              }
            })
        } else {
          _this.$message({ message: '超过文件大小限制', type: 'warning', showClose: true })
          _this.isLoading = false
        }
      } else {
        _this.$message({ message: '请至少选择一个文件', type: 'warning', showClose: true })
        _this.isLoading = false
      }
    },
    handleUpload(file, fileList) {
      this.fileList = fileList
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    // 关闭窗口
    btnCancel_Click() {
      this.dialogFormVisible = false
    }
  }
}
</script>
