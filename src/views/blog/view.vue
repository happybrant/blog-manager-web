<template>
  <el-dialog :title="dialogTitle" :visible="dialogFormVisible" :modal="dialogFormVisible" :close-on-click-modal="false" custom-class="dl-width-custom-l" :width="'1000px'" @close="btnCancel_Click">
    <div class="body">
      <div class="detail-title-wrap">
        <h1 class="detail-title">
          <span class="d-t js-title">{{ title }}</span>
        </h1>
        <div class="dc-profile clearfix">
          <div class="l">
            <span class="spacer">发布于{{ createTime }}</span>
            <span class="spacer spacer-2">分类：{{ categoryName }}</span>
          </div>
        </div>
      </div>
      <aside>
        <a href="javascript:void(0);">摘要：</a>
        {{ description }}
      </aside>
      <mavon-editor
        class="markdown"
        :value="content"
        :subfield="false"
        :ishljs="true"
        default-open="preview"
        :toolbars-flag="false"
        :editable="false"
        :scroll-style="true"
      />
      <div class="tag-box">
        <div class="tag-wrap clearfix">
          <span
            v-for="tag in tags"
            :key="tag"
            class="tag l"
          >{{ tag }}</span>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" plain class="margin-l10" @click="btnCancel_Click">关 闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { parseTime } from '@/utils/index'

export default {
  data() {
    return {
      dialogTitle: '预览', // 对话框标题
      dialogFormVisible: false, // 控制窗口是否可见
      loading: false, // 控制列表显示加载中
      content: '', // 文章内容
      title: '', // 文章标题
      categoryName: '', // 分类名称
      createTime: '', // 发布时间
      description: '', // 摘要
      tags: []

    }
  },
  methods: {
    show(data) {
      this.dialogFormVisible = true

      if (data != null && data !== undefined) {
        this.content = data.originContent
        this.title = data.title
        this.categoryName = data.categoryName
        this.createTime = this.parseTime(data.createTime)
        this.description = data.description
        this.tags = data.tags.map(x => x.name)
      }
    },
    parseTime(time) {
      return parseTime(time, '{y}-{m}-{d} {h}:{i}')
    },

    // 关闭窗口
    btnCancel_Click() {
      this.dialogFormVisible = false
    }
  }
}
</script>
<style scoped>
.detail-title-wrap{
  margin-bottom: 20px;
}
.detail-title-wrap .detail-title {
    font-size: 32px;
    color: #1c1f21;
    line-height: 40px;
    margin: 8px 0;
    word-wrap: break-word;
    word-break: break-all;
}
.detail-title-wrap .dc-profile {
    font-size: 12px;
    color: #9199a1;
    line-height: 24px;
}
.r {
    float: right;
}
.l {
    float: left;
}
.detail-title-wrap .dc-profile span {
    vertical-align: middle;
}
 .detail-title-wrap .dc-profile .spacer {
    margin-right: 24px;
}

::v-deep .el-dialog__body{
  padding: 10px 30px;
}
.toastui-editor-md-preview {
    overflow: auto;
    padding: 0 15px;
    height: 100%;
}
::v-deep aside{
  font-size: 14px;
  padding: 8px 24px 8px 8px;
}
.tag-box {
    margin-top: 30px;
    width: 100%;
}
.tag-box .tag-wrap {
    display: inline-block;
}
.tag-box .tag {
    display: inline-block;
    margin-right: 12px;
    padding: 4px 12px;
    background: rgba(84,92,99,.1);
    border-radius: 12px;
    font-size: 12px;
    color: #545c63;
    line-height: 16px;
}
</style>
