<template>
  <el-select ref="select" v-model="category" placeholder="请选择博客分类" clearable @clear="handleSelectClear" @remove-tag="handleRemoveTag">
    <el-option class="custom-tree" value="">
      <el-tree ref="tree" :data="categoryOptions" node-key="id" :props="defaultProps" highlight-current :expand-on-click-node="false" empty-text="暂无数据" v-on="$listeners" @node-click="handleNodeClick" />
    </el-option>
  </el-select>
</template>
<style scoped>
.custom-tree {
  height: auto;
  padding: 0;
}
.el-select-dropdown__item.selected {
  font-weight: normal;
}
</style>
<script>
export default {
  props: {
    value: {
      required: true,
      default: () => [],
      type: Number
    }
  },
  data() {
    return {
      categoryOptions: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  computed: {
    category: {
      get() {
        if (this.value !== 0) {
          this.$refs.tree.setCurrentKey(this.value)
          return this.getCategoryName(this.value)
        }
        return ''
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  mounted() {
    this.getCategoryList()
  },
  methods: {

    // 获取所有分类
    getCategoryList() {
      const _this = this
      _this.listLoading = true
      _this.$store
        .dispatch('blog/getCategoryList')
        .then(function(response) {
          if (response != null && response.code === 200 && response.data.length > 0) {
            _this.categoryOptions = response.data
          } else {
            _this.categoryOptions = []
          }
          _this.listLoading = false
        })
        .catch(function(error) {
          _this.$message({ message: error.msg || 'Has Error', type: 'error', showClose: true })
          _this.listLoading = false
        })
    },
    getCategoryName(id) {
      for (const category of this.categoryOptions) {
        if (category.id === id) {
          return category.name
        }
        if (category.children != null || category.length > 0) {
          for (const child of category.children) {
            if (child.id === id) {
              return child.name
            }
          }
        }
      }
    },

    hiddenPopper() {
      this.$refs.select.blur()
    },

    // 选择树结构点击事件
    handleNodeClick(data) {
      this.$emit('input', data.id)
      this.hiddenPopper()
    },

    handleSelectClear() {
      this.$emit('input', '')
    },

    handleRemoveTag(value) {
      const fileterValue = this.value.filter(item => item !== value)
      this.$emit('input', fileterValue)
    }
  }
}
</script>
