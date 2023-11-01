<template>
  <div>
    <el-descriptions style="margin-top:5px" :column="2" border>
      <template slot="title">
        <el-button type="primary" @click="openEditRoutingDialog">编辑展示信息</el-button>
      </template>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          展示名
        </template>
        {{ form.name }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-suitcase" />
          职业
        </template>
        {{ form.title }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline" />
          现居地
        </template>
        {{ form.location }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-position" />
          个人路由
        </template>
        {{ form.fullRouting }}
        <el-button v-if="form.fullRouting" style="margin-left:10px" circle icon="el-icon-position" title="跳转到个人博客首页" @click="jump" />
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-bank-card" />
          展示控件
        </template>
        <el-tag v-for="(item,index) in form.controls" :key="index">{{ item }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-picture-outline" />
          个人头像
        </template>
        <el-image v-if="form.avatarUrl" style="vertical-align: middle;width: 50px; height: 50px;" :src="form.avatarUrl" :preview-src-list="coverList" />
      </el-descriptions-item>
    </el-descriptions>
    <EditInfoForm ref="editInfoForm" />
  </div>

</template>

<script>

import EditInfoForm from '@/views/setting/editInfo'

export default {
  name: 'PersonalInfo',
  components: { EditInfoForm },
  data() {
    return {
      form: {
        id: '',
        name: '',
        title: '',
        location: '',
        controls: [],
        avatarUrl: '',
        routing: '',
        fullRouting: '' // 完整路径
      },
      coverList: [],
      frontApi: process.env.VUE_APP_FRONT_API
    }
  },
  mounted() {
    this.getSettingByCurrentUser()
  },
  methods: {

    // 获取当前登录用户的设置
    getSettingByCurrentUser() {
      const _this = this
      _this.$store
        .dispatch('blog/getSettingByCurrentUser')
        .then(function(response) {
          if (
            response != null &&
            response.code === 200 &&
            response.data != null
          ) {
            _this.form = response.data
            _this.form.fullRouting = _this.frontApi + _this.form.routing
            _this.coverList.push(_this.form.avatarUrl)
          }
        })
        .catch(function(error) {
          console.log(error)
          _this.$message({
            message: error.msg || 'Has Error',
            type: 'error',
            showClose: true
          })
        })
    },
    jump() {
      const tempwindow = window.open('_blank')
      tempwindow.location.href = this.frontApi + this.form.routing + '/articles'
    },
    // 打开个人设置修改界面
    openEditRoutingDialog() {
      this.$refs.editInfoForm.show(this.form)
    }
  }
}
</script>
<style scoped>
.el-tag {
  margin-left: 10px;
  margin-top: 10px;
}
</style>
