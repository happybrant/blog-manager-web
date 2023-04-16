<template>
  <div class="app-container">
    <el-row>
      <el-col :span="12">
        <el-button type="primary" icon="el-icon-plus" @click="openEditDialog('addTask')">添加</el-button>
      </el-col>
    </el-row>
    <el-row class="margin-t20">
      <el-col :span="8">
        <Kanban :key="1" :list="todoList" :group="group" class="kanban todo" header-text="待办" />
      </el-col>
      <el-col :span="8" style="padding-left:20px">
        <Kanban :key="2" :list="workingList" :group="group" class="kanban working" header-text="进行中" />
      </el-col>
      <el-col :span="8" style="padding-left:20px">
        <Kanban :key="3" :list="doneList" :group="group" class="kanban done" header-text="已完成" />
      </el-col>
    </el-row>
    <EditForm ref="editForm" />
  </div>
</template>
<script>
import Kanban from '@/components/Kanban'
import EditForm from '@/views/task/edit'
export default {
  name: 'DragKanbanDemo',
  components: {
    EditForm,
    Kanban
  },
  data() {
    return {
      group: 'mission',
      taskList: [], // 所有的任务
      todoList: [], // 待办的任务
      workingList: [], // 正在执行的任务
      doneList: [], // 已完成的任务
      allDoneList: [], // 所有的已完成的任务
      todayDoneList: [] // 今日已完成的任务，默认展示今日的
    }
  },
  mounted() {
    this.getTaskList()
  },
  methods: {
    getTaskList() {
      const _this = this
      _this.$store
        .dispatch('task/getTaskList')
        .then(function(response) {
          if (response != null && response.code === 200) {
            _this.taskList = response.data
            _this.todoList = _this.taskList.filter(item => item.status === 1)
            _this.workingList = _this.taskList.filter(item => item.status === 2)
            // 所有的已完成的任务
            _this.allDoneList = _this.taskList.filter(item => item.status === 3)
            // 今日已完成的任务，默认展示今日的
            _this.todayDoneList = _this.allDoneList.filter(item => new Date(item.endTime).toLocaleDateString() === new Date().toLocaleDateString())
            _this.doneList = _this.todayDoneList
          } else {
            _this.taskList = []
          }
        })
        .catch(function(error) {
          _this.$message({ message: error.msg || 'Has Error', type: 'error', showClose: true })
        })
    },
    // 点击新增按钮
    openEditDialog(action, task) {
      this.$refs.editForm.show(action, task)
    }
  }
}
</script>
<style lang="scss">
.board {
  width: 1000px;
  margin-left: 20px;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: flex-start;
}
.kanban {
  &.todo {
    .board-column-header {
      background: #4A9FF9;
    }
  }
  &.working {
    .board-column-header {
      background: #f9944a;
    }
  }
  &.done {
    .board-column-header {
      background: #2ac06d;
    }
  }
}
</style>

