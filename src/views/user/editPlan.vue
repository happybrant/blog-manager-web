<template>
  <el-dialog :title="dialogTitle" :visible="dialogFormVisible" :modal="dialogFormVisible" :close-on-click-modal="false" custom-class="dl-width-custom" :width="'710px'" @close="btnCancel_Click">
    <div class="body">
      <el-form ref="formMain" :model="form" :rules="formRules" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="功能名称" prop="username">
              <el-input v-model="form.name" placeholder="请填写用户名" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="功能描述" prop="displayName">
              <mavon-editor
                ref="md"
                v-model="form.description"
                :ishljs="true"
                style="400px"
                class="markdown"
              />
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
    return {
      dialogTitle: '新增用户', // 对话框标题
      dialogFormVisible: false, // 控制窗口是否可见
      loading: false, // 控制列表显示加载中
      form: {
        name: '',
        description: ''
      }

    }
  },
  methods: {
    show(action, data) {
      // 字段初始化
      this.dialogFormVisible = true
    },
    // 点击确定按钮
    btnSave_Click() {},

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
::v-deep .el-upload-list__item-actions:hover span {
    display: inline-block;
}
.el-upload-list__item-actions:after {
    display: inline-block;
    content: "";
    height: 100%;
    vertical-align: middle;
}
</style>
