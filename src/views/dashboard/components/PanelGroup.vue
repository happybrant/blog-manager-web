<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('mix')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="blog" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            草稿
          </div>
          <count-to :start-val="0" :end-val="draftBlogCount" :duration="2600" class="card-panel-num" />
        </div>
        <div class="card-panel-vertical">
          <div class="card-panel-text">
            |
          </div>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            已发布
          </div>
          <count-to :start-val="0" :end-val="publishedBlogCount" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('tasks')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="task" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            已完成
          </div>
          <count-to :start-val="0" :end-val="doneTaskCount" :duration="3000" class="card-panel-num" />
        </div>
        <div class="card-panel-vertical">
          <div class="card-panel-text">
            |
          </div>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            进行中
          </div>
          <count-to :start-val="0" :end-val="workingTaskCount" :duration="3000" class="card-panel-num" />
        </div>
        <div class="card-panel-vertical">
          <div class="card-panel-text">
            |
          </div>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            未开始
          </div>
          <count-to :start-val="0" :end-val="todoTaskCount" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('mix')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="form" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            笔记数量
          </div>
          <count-to :start-val="0" :end-val="noteCount" :duration="3200" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('mix')">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="album" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            相册数量
          </div>
          <count-to :start-val="0" :end-val="albumCount" :duration="3600" class="card-panel-num" />
        </div>
        <div class="card-panel-vertical">
          <div class="card-panel-text">
            |
          </div>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            照片数量
          </div>
          <count-to :start-val="0" :end-val="photoCount" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  props: {
    groupData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      publishedBlogCount: this.groupData.publishedBlogCount,
      draftBlogCount: this.groupData.draftBlogCount,
      todoTaskCount: this.groupData.todoTaskCount,
      workingTaskCount: this.groupData.workingTaskCount,
      doneTaskCount: this.groupData.doneTaskCount,
      noteCount: this.groupData.noteCount,
      albumCount: this.groupData.albumCount,
      photoCount: this.groupData.photoCount

    }
  },
  watch: {
    groupData: {
      deep: true,
      handler(val) {
        this.publishedBlogCount = val.publishedBlogCount
        this.draftBlogCount = val.draftBlogCount
        this.todoTaskCount = val.todoTaskCount
        this.workingTaskCount = val.workingTaskCount
        this.doneTaskCount = val.doneTaskCount
        this.noteCount = val.noteCount
        this.albumCount = val.albumCount
        this.photoCount = val.photoCount
      }
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    border-radius: 8px;
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px 10px ;
      text-align: center;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }

    .card-panel-vertical {
      float: right;
      font-weight: bold;
      margin-top: 26px;
      text-align: center;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
