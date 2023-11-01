<template>
  <div class="app-container main-conent-screen">
    <el-row :gutter="24">
      <el-col :span="8" class="list">
        <el-card style="height: 850px; overflow:auto">
          <div slot="header" class="clearfix">
            <el-button type="primary">添加计划</el-button>
            <el-button type="success">下一步</el-button>
          </div>

          <el-steps direction="vertical" :active="1" :space="100">
            <el-step title="步骤 1" />
            <el-step title="步骤 2" />
            <el-step title="步骤 3" description="这是一段很长很长很长的描述性文字" />
            <el-step title="步骤 3" description="这是一段很长很长很长的描述性文字" />
            <el-step title="步骤 3" description="这是一段很长很长很长的描述性文字" />
            <el-step title="步骤 3" description="这是一段很长很长很长的描述性文字" />
            <el-step title="步骤 3" description="这是一段很长很长很长的描述性文字" />

          </el-steps>
        </el-card>

      </el-col>
      <el-col :span="16" class="detail">
        <el-card class="box-card" style="height: 850px; overflow:auto">
          <div slot="header" class="clearfix">
            <el-button type="primary" @click="addPlan">添加计划</el-button>
            <el-button type="success">下一步</el-button>
          </div>
          <el-steps :active="1">
            <el-step title="步骤 1" description="这是一段很长很长很长的描述性文字这是一段很长很长很长的描述性文字这是一段很长很长很长的描述性文字这是一段很长很长很长的描述性文字" />
            <el-step title="步骤 2" description="这是一段很长很长很长的描述性文字" />
            <el-step title="步骤 3" description="这段就没那么长了" />
            <el-step title="步骤 1" description="这是一段很长很长很长的描述性文字这是一段很长很长很长的描述性文字这是一段很长很长很长的描述性文字这是一段很长很长很长的描述性文字" />
            <el-step title="步骤 2" description="这是一段很长很长很长的描述性文字" />
            <el-step title="步骤 3" description="这段就没那么长了" />
          </el-steps>
          <el-divider />
          <el-descriptions title="步骤信息" class="step-detail">
            <el-descriptions-item label="步骤名称">kooriookami</el-descriptions-item>
            <el-descriptions-item label="状态">进行中</el-descriptions-item>
            <el-descriptions-item label="完成时间">苏州市</el-descriptions-item>
            <!-- <el-descriptions-item label="备注">
              <el-tag size="small">学校</el-tag>
            </el-descriptions-item> -->
            <el-descriptions-item label="详情">这是一段很长很长很长的描述性文字这是一段很长很长很长的描述性文字这是一段很长很长很长的描述性文字这是一段很长很长很长的描述性文字
              这是一段很长很长很长的描述性文字这是一段很长很长很长的描述性文字这是一段很长很长很长的描述性文字这是一段很长很长很长的描述性文字
              这是一段很长很长很长的描述性文字这是一段很长很长很长的描述性文字这是一段很长很长很长的描述性文字这是一段很长很长很长的描述性文字
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
    <EditForm ref="editForm" />
  </div>
</template>

<script>
import EditForm from '@/views/user/editPlan'
export default {
  name: 'PlanList',
  components: { EditForm },

  data() {
    return {
      'name': ''
    }
  },
  methods: {
    addPlan() {
      this.$refs.editForm.show()
    }

  }
}
</script>

<style  lang="scss" scoped>
.step-detail {
  margin-top: 10px;
}
</style>
