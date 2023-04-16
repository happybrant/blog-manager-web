<template>
  <el-dialog :title="dialogTitle" :visible="dialogFormVisible" :modal="dialogFormVisible" :close-on-click-modal="false" custom-class="dl-width-custom" :width="'710px'" @close="btnCancel_Click">
    <div class="body">
      <el-form ref="formMain" :model="form" :rules="formRules" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title" placeholder="请填写待办事项标题" maxlength="50" show-word-limit :disabled="form.status != 1" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="任务类型" prop="type">
              <el-radio-group v-model="form.type" :disabled="form.status != 1">
                <el-radio label="1">工作</el-radio>
                <el-radio label="2">个人</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="优先级" prop="level">
              <el-select v-model="form.level" placeholder="请选择" :disabled="form.status != 1">
                <el-option
                  v-for="item in levels"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="任务描述">
              <el-input v-model="form.description" type="textarea" rows="4" placeholder="请填写描述信息" maxlength="500" show-word-limit :disabled="form.status != 1" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="form.status == 2">
          <el-col :span="24">
            <el-form-item label="进展描述" prop="remark">
              <el-input v-model="form.remark" type="textarea" rows="4" placeholder="请填写进展信息" maxlength="500" show-word-limit :disabled="form.status != 2" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="form.status != 1">
          <el-col :span="24">
            <el-form-item label="任务进展">
              <el-timeline v-if="progressList.length > 0" style="margin-top:10px;line-height: 1.5;">
                <el-timeline-item
                  v-for="(activity, index) in progressList"
                  :key="index"
                  type="primary"
                  size="large"
                  icon="el-icon-more"
                  :timestamp="activity.createTime"
                >
                  {{ activity.content }}
                  <a v-if="form.status == 2" style="margin-left:20px;color:#4A9FF9" type="text" @click="deleteProgress(activity.id)">删除</a>
                </el-timeline-item>
              </el-timeline>
              <div v-if="progressList.length <= 0">
                暂无进展
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="form.status != 3" type="primary" :loading="isLoading" @click="btnSaveTask_Click">保 存</el-button>
      <el-button v-if="form.status == 1 && dialogTitle == '编辑任务'" type="warning" :loading="isLoading" @click="btnHandleTask_Click(2)">执 行</el-button>
      <el-button v-if="form.status == 2" type="warning" :loading="isLoading" @click="btnHandleTask_Click(3)">完 成</el-button>
      <el-button v-if="form.status == 1 && dialogTitle == '编辑任务'" plain type="danger" class="margin-l10" @click="btnDelete_Click">删 除</el-button>
      <el-button type="primary" plain class="margin-l10" @click="btnCancel_Click">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getLevelList } from '@/utils/dictionaryutil'
import { parseTime } from '@/utils/index'
export default {
  data() {
    return {
      dialogTitle: '新增任务', // 对话框标题
      dialogFormVisible: false, // 控制窗口是否可见
      loading: false, // 控制列表显示加载中
      disabled: false,
      levels: [], // 任务所有级别
      progressList: [], // 任务进展信息
      deleteProgressId: [], // 删除的进展id
      form: { // 表单对象
        id: '',
        title: '',
        type: '1',
        level: '',
        description: '',
        remark: '',
        status: 1
      },
      formRules: {
        title: [{ required: true, message: '请输入任务标题', trigger: 'onblur' }],
        type: [{ required: true, message: '请选择任务类型', trigger: 'change' }],
        level: [{ required: true, message: '请选择任务优先级', trigger: 'change' }],
        remark: [{ required: true, message: '请填写任务进展信息', trigger: 'onblur' }]
      },
      isLoading: false // 保存按钮是否加载状态
    }
  },
  methods: {
    show(action, data) {
      // 字段初始化
      this.levels = getLevelList()
      this.dialogFormVisible = true
      this.progressList = []
      this.deleteProgressId = []
      if (action === 'addTask') {
        this.dialogTitle = '新增任务'
      } else if (action === 'editTask') {
        this.dialogTitle = '编辑任务'
      } else if (action === 'editProgress') {
        this.dialogTitle = '编辑进度'
      } else if (action === 'checkTask') {
        this.dialogTitle = '查看任务'
      }

      if (data != null && data !== undefined) {
        this.form.id = data.id
        this.form.title = data.title
        this.form.type = data.type + ''
        this.form.level = data.level
        this.form.description = data.description
        this.form.status = data.status
        this.getProgressList()
      }
    },
    parseTime(time) {
      return parseTime(time, '{y}-{m}-{d} {h}:{i}')
    },
    // 获取进度列表
    getProgressList() {
      const _this = this
      var parameters = {}
      parameters.taskId = this.form.id
      _this.$store
        .dispatch('task/getProgressList', parameters)
        .then(function(response) {
          if (response != null && response.code === 200) {
            _this.progressList = response.data
          } else {
            _this.progressList = []
          }
        })
        .catch(function(error) {
          _this.$message({ message: error.msg || 'Has Error', type: 'error', showClose: true })
        })
    },
    // 点击确定按钮
    btnSaveTask_Click() {
      this.$refs.formMain.validate(valid => {
        if (valid) {
          const _this = this
          // 新增任务或者编辑任务时的操作
          if (_this.dialogTitle === '新增任务' || _this.dialogTitle === '编辑任务') {
            const parameters = {}
            if (_this.form.id != null) {
              parameters.id = _this.form.id
            }

            parameters.title = _this.form.title
            parameters.type = _this.form.type
            parameters.level = _this.form.level
            parameters.description = _this.form.description

            let requestMethod = ''
            if (_this.dialogTitle === '新增任务') {
              requestMethod = 'task/addTask'
            } else {
              requestMethod = 'task/updateTask'
            }
            _this.$store
              .dispatch(requestMethod, parameters)
              .then(function(response) {
                if (response != null && response.code === 200) {
                  _this.$message({ message: '操作成功', type: 'success', showClose: true })
                  _this.dialogFormVisible = false
                  _this.$parent.getTaskList()
                } else {
                  _this.$message({ message: response == null || response.message == null || response.message === '' ? '操作失败' : response.message, type: 'error', showClose: true })
                }
              })
              .catch(function(error) {
                _this.$message({ message: error.msg || 'Has Error', type: 'error', showClose: true })
              })
          }
          if (_this.dialogTitle === '编辑进度') {
            _this.updateProgress(_this, true)
          }
        }
      })
    },
    // 处理任务:执行和结束
    btnHandleTask_Click(status) {
      const _this = this
      var parameters = {}
      parameters.id = _this.form.id
      parameters.status = status
      parameters.title = _this.form.title
      parameters.type = _this.form.type
      parameters.level = _this.form.level
      parameters.description = _this.form.description
      if (status === 2) {
        parameters.startTime = parseTime(new Date())
        _this.updateTask(parameters, _this)
      } else {
        parameters.endTime = parseTime(new Date())
        _this.$refs.formMain.validate(valid => {
          if (valid) {
            _this.updateTask(parameters, _this)
            _this.updateProgress(_this)
          }
        })
      }
    },
    // 更新任务
    updateTask(parameters, _this) {
      _this.$store
        .dispatch('task/updateTask', parameters)
        .then(function(response) {
          if (response != null && response.code === 200) {
            _this.$message({ message: '操作成功', type: 'success', showClose: true })
            _this.dialogFormVisible = false
            _this.$parent.getTaskList()
          } else {
            _this.$message({ message: response == null || response.message == null || response.message === '' ? '操作失败' : response.message, type: 'error', showClose: true })
          }
        })
        .catch(function(error) {
          _this.$message({ message: error.msg || 'Has Error', type: 'error', showClose: true })
        })
    },
    // 更新进度
    updateProgress(_this, withTip) {
      const parameters = {}
      parameters.content = _this.form.remark
      parameters.taskId = _this.form.id
      parameters.deleteProgressId = _this.deleteProgressId

      _this.$store
        .dispatch('task/updateProgress', parameters)
        .then(function(response) {
          if (response != null && response.code === 200) {
            if (withTip) {
              _this.$message({ message: '操作成功', type: 'success', showClose: true })
              _this.dialogFormVisible = false
              _this.$parent.getTaskList()
            }
          } else {
            _this.$message({ message: response == null || response.message == null || response.message === '' ? '操作失败' : response.message, type: 'error', showClose: true })
          }
        })
        .catch(function(error) {
          _this.$message({ message: error.msg || 'Has Error', type: 'error', showClose: true })
        })
    },

    // 点击删除按钮
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
            .dispatch('task/deleteTask', parameters)
            .then(function(response) {
              if (response != null && response.code === 200) {
                _this.$message({ message: '操作成功', type: 'success', showClose: true })
                _this.dialogFormVisible = false
                _this.$parent.getTaskList()
              } else {
                _this.$message({ message: response == null || response.message == null || response.message === '' ? '操作失败' : response.message, type: 'error', showClose: true })
              }
            })
            .catch(function(error) {
              _this.$message({ message: error.msg || 'Has Error', type: 'error', showClose: true })
            })
        })
    },
    editProgress(id) {
      var progress = this.progressList.find(item => item.id === id)
      this.form.remark = progress.content
    },
    deleteProgress(id) {
      this.progressList.splice(this.progressList.findIndex(item => item.id === id), 1)
      this.deleteProgressId.push(id)
    },
    // 关闭窗口
    btnCancel_Click() {
      this.dialogFormVisible = false
      this.$refs.formMain.resetFields()
      this.form.id = ''
      this.form.title = ''
      this.form.type = '1'
      this.form.level = ''
      this.form.description = ''
      this.form.remark = ''
      this.form.status = 1
      this.form.deleteProgressId = []
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
::v-deep ul{
  padding-left:0;
}
::v-deep .el-card__body {
    padding: 12px;
}
</style>
