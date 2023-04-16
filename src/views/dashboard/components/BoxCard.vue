<template>
  <el-card class="box-card-component">
    <div style="position:relative;">
      <mallki class-name="mallki-text" text="博客标签占比" />
      <div style="margin-top:20px;height:240px;overflow-y:auto;">

        <div v-for="item in statisticsData" :key="item.key" class="progress-item">
          <span>{{ item.key }}</span>
          <el-progress v-if="item.value == '100'" :percentage="item.value" status="success" />
          <el-progress v-else :percentage="item.value" />
        </div>
      </div>
    </div></el-card>
</template>

<script>
import { mapGetters } from 'vuex'
import Mallki from '@/components/TextHoverEffect/Mallki'

export default {
  components: { Mallki },
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    }
  },
  props: {
    boxData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      statisticsData: []
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  },
  watch: {
    boxData: {
      deep: true,
      handler(val) {
        this.boxData = val
        this.initBox()
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initBox()
    })
  },
  methods: {
    initBox() {
      const keys = Object.keys(this.boxData)
      const values = Object.values(this.boxData)
      for (let i = 0; i < keys.length; i++) {
        const obj = { 'key': keys[i], 'value': values[i] }
        this.statisticsData.push(obj)
      }
    }
  }
}
</script>

<style lang="scss" >
.box-card-component{
  .el-card__header {
    padding: 0px!important;
  }
}
</style>
<style lang="scss" scoped>
.box-card-component {
  .box-card-header {
    position: relative;
    height: 220px;
    img {
      width: 100%;
      height: 100%;
      transition: all 0.2s linear;
      &:hover {
        transform: scale(1.1, 1.1);
        filter: contrast(130%);
      }
    }
  }
  .mallki-text {
    top: 0px;
    font-size: 20px;
    font-weight: bold;
  }
  .panThumb {
    z-index: 100;
    height: 70px!important;
    width: 70px!important;
    position: absolute!important;
    top: -45px;
    left: 0px;
    border: 5px solid #ffffff;
    background-color: #fff;
    margin: auto;
    box-shadow: none!important;
    ::v-deep .pan-info {
      box-shadow: none!important;
    }
  }
  .progress-item {
    margin-bottom: 10px;
    font-size: 14px;
  }
  @media only screen and (max-width: 1510px){
    .mallki-text{
      display: none;
    }
  }
}
</style>
