<template>
  <el-dropdown :hide-on-click="false" :show-timeout="100" trigger="click">
    <el-button plain>
      博客标签({{ tag.length }})
      <i class="el-icon-caret-bottom el-icon--right" />
    </el-button>
    <el-dropdown-menu slot="dropdown" class="no-border">
      <el-checkbox-group v-model="tag" style="padding: 5px 15px;">
        <el-checkbox v-for="item in tagOptions" :key="item.id" :label="item.id">
          {{ item.name }}
        </el-checkbox>
      </el-checkbox-group>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  props: {
    value: {
      required: true,
      default: () => [],
      type: Array
    }
  },
  data() {
    return {
      tagOptions: []
    }
  },
  computed: {
    tag: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  mounted() {
    this.getTagList()
  },
  methods: {
    // 查看所有标签
    getTagList() {
      const _this = this
      _this.$store
        .dispatch('blog/getTagList')
        .then(function(response) {
          if (response != null && response.code === 200 && response.data.length > 0) {
            _this.tagOptions = response.data
          } else {
            _this.tagOptions = []
          }
        })
        .catch(function(error) {
          _this.$message({ message: error.msg || 'Has Error', type: 'error', showClose: true })
        })
    }
  }

}
</script>
