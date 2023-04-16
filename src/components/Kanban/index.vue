<template>
  <div class="board-column">
    <div class="board-column-header">
      {{ headerText }}
      <el-switch
        v-if="headerText == '已完成'"
        v-model="rangeTemp"
        style="margin-left:40px;font-size:16px"
        active-text="当天"
        inactive-text="全部"
        @change="switchRange"
      />
    </div>

    <draggable
      :list="list"
      v-bind="$attrs"
      class="board-column-content"
      :set-data="setData"
      :move="onMove"
      animation="300"
    >
      <div v-for="element in list" :key="element.id" class="board-item" @click="openEditDialog(element, headerText )">
        <span class="prepend" :style="{background:level(element.level)}">
          <i v-if="element.type == 1" class="el-icon-s-cooperation" />
          <i v-if="element.type == 2" class="el-icon-s-custom" />
        </span>

        {{ element.title }}
      </div>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { parseTime } from '@/utils/index'

export default {
  name: 'DragKanbanDemo',
  components: {
    draggable
  },
  props: {
    headerText: {
      type: String,
      default: 'Header'
    },
    range: {
      type: Boolean,
      default: true
    },
    options: {
      type: Object,
      default() {
        return {}
      }
    },
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      rangeTemp: this.range
    }
  },
  methods: {
    level(val) {
      if (val === 1) {
        return '#f56c6c'
      }
      if (val === 2) {
        return '#e6a23c'
      }
      return '#2ac06d'
    },
    setData(dataTransfer) {
      // to avoid Firefox bug
      // Detail see : https://github.com/RubaXa/Sortable/issues/1012
      dataTransfer.setData('Text', '')
    },
    openEditDialog(progress, type) {
      if (type === '待办') {
        this.$parent.$parent.$parent.openEditDialog('editTask', progress)
      }
      if (type === '进行中') {
        this.$parent.$parent.$parent.openEditDialog('editProgress', progress)
      }
      if (type === '已完成') {
        this.$parent.$parent.$parent.openEditDialog('checkTask', progress)
      }
    },
    // 切换展示全部已完成的任务
    switchRange() {
      if (this.rangeTemp) {
        this.$parent.$parent.$parent.doneList = this.$parent.$parent.$parent.todayDoneList
      } else {
        this.$parent.$parent.$parent.doneList = this.$parent.$parent.$parent.allDoneList
      }
    },
    // move回调方法,不允许右边的任务往左边拖拽
    onMove(e, originalEvent) {
      const originEle = e.draggedContext.element
      // 目标看板
      const siblings = e.to.previousSibling
      if (originEle.status !== 1 && siblings.innerText === '待办') {
        return false
      }
      if (originEle.status !== 2 && siblings.innerText === '进行中') {
        if (originEle.status === 1) {
          // 执行任务
          originEle.status = 2
          this.HandleTask(originEle)
        } else {
          return false
        }
      } else if (originEle.status !== 3 && siblings.innerText.indexOf('已完成') > -1) {
        // 结束任务
        originEle.status = 3
        this.HandleTask(originEle)
      }
      return true
    },
    // 处理任务，执行和结束
    HandleTask(element) {
      const _this = this
      if (element.status === 2) {
        element.startTime = parseTime(new Date())
        element.endTime = null
      } else {
        element.endTime = parseTime(new Date())
      }
      _this.$store
        .dispatch('task/updateTask', element)
        .then(function(response) {
          if (response != null && response.code === 200) {
            if (element.status === 3) {
              _this.addProcess(element.id)
            } else {
              _this.$message({ message: '操作成功', type: 'success', showClose: true })
            }
          } else {
            _this.$message({ message: response == null || response.message == null || response.message === '' ? '操作失败' : response.message, type: 'error', showClose: true })
          }
        })
        .catch(function(error) {
          _this.$message({ message: error.msg || 'Has Error', type: 'error', showClose: true })
        })
    },
    addProcess(taskId) {
      const _this = this
      const parameters = {}
      // 通过拖拽方式完成任务默认加上一条进度，内容为已完成
      parameters.content = '已完成'
      parameters.taskId = taskId
      parameters.deleteProgressId = []

      _this.$store
        .dispatch('task/updateProgress', parameters)
        .then(function(response) {
          if (response != null && response.code === 200) {
            _this.$message({ message: '操作成功', type: 'success', showClose: true })
          } else {
            _this.$message({ message: response == null || response.message == null || response.message === '' ? '操作失败' : response.message, type: 'error', showClose: true })
          }
        })
        .catch(function(error) {
          _this.$message({ message: error.msg || 'Has Error', type: 'error', showClose: true })
        })
    }

  }
}
</script>
<style lang="scss" scoped>
  ::v-deep .board-item {
    border-radius: 5px;
  }
  .board-column {
    min-width: 300px;
    min-height: 100px;
    height: auto;
    overflow: hidden;
    background: #f0f0f0;
    border-radius: 3px;
    .board-column-header {
      height: 50px;
      line-height: 50px;
      overflow: hidden;
      padding: 0 20px;
      text-align: center;
      background: #333;
      color: #fff;
      border-radius: 3px 3px 0 0;
  }

  .board-column-content {
    height: 680px;
    overflow: auto;
    border: 10px solid transparent;
    min-height: 60px;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;

  .board-item {
      cursor: pointer;
      width: 100%;
     // height: 64px;
      margin: 7px 0;
      background-color: #fff;
      text-align: left;
      line-height: 50px;
      box-sizing: border-box;
      box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.2);
    }
    i {
      font-size: 18px;
      line-height: 1;
      color: #fff;
    }
  }
}
::v-deep .el-switch__label.is-active {
    color: #303133;
}
.prepend {
    border-radius: 7px 0 0 7px;
    width: 50px;
    display: inline-block;
    margin: 0  10px auto 0;
    text-align: center;
}
</style>

