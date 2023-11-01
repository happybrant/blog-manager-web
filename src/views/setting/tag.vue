<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <div class="title">
        <span>标签列表</span>
      </div>
    </div>
    <el-tag v-for="tag in dynamicTags" :key="tag" closable :disable-transitions="false" @close="deleteTag(tag)">
      {{ tag }}
    </el-tag>
    <el-input v-if="inputVisible" ref="saveTagInput" v-model="inputValue" class="input-new-tag" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" />
    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 标签</el-button>
  </el-card>
</template>

<script>

export default {
  name: 'Tag',
  data() {
    return {
      dynamicTags: [],
      tagList: [],
      inputVisible: false,
      inputValue: ''
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
          if (
            response != null &&
            response.code === 200 &&
            response.data.length > 0
          ) {
            _this.tagList = response.data
            _this.dynamicTags = response.data.map((x) => x.name)
          } else {
            _this.dynamicTags = []
          }
        })
        .catch(function(error) {
          _this.$message({
            message: error.msg || 'Has Error',
            type: 'error',
            showClose: true
          })
        })
    },
    // 新增标签
    addTag(name) {
      const _this = this
      const parameters = {}
      parameters.name = name
      _this.$store
        .dispatch('blog/addTag', parameters)
        .then(function(response) {
          if (
            response != null &&
            response.code === 200 &&
            response.data.length > 0
          ) {
            _this.$message({
              message: '操作成功',
              type: 'success',
              showClose: true
            })
          } else {
            _this.$message({
              message: '操作失败',
              type: 'error',
              showClose: true
            })
          }
        })
        .catch(function(error) {
          _this.$message({
            message: error.msg || 'Has Error',
            type: 'error',
            showClose: true
          })
        })
    },

    // 执行删除操作
    deleteTag(tag) {
      const _this = this
      const parameters = {}
      const id = this.tagList.find((x) => x.name === tag).id
      parameters.id = id
      _this
        .$confirm('此操作将永久删除该数据，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          _this.$store
            .dispatch('blog/deleteTag', parameters)
            .then(function(response) {
              if (
                response != null &&
                response.code === 200 &&
                response.data.length > 0
              ) {
                _this.dynamicTags.splice(_this.dynamicTags.indexOf(tag), 1)

                _this.$message({
                  message: '操作成功',
                  type: 'success',
                  showClose: true
                })
              } else {
                _this.$message({
                  message: '操作失败',
                  type: 'error',
                  showClose: true
                })
              }
            })
            .catch(function(error) {
              _this.$message({
                message: error.msg || 'Has Error',
                type: 'error',
                showClose: true
              })
            })
        })
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
        this.addTag(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    }
  }
}
</script>

<style scoped>
::v-deep .sortable-ghost {
  opacity: 0.8;
  color: #fff !important;
  background: #42b983 !important;
}
</style>

<style lang="scss" scoped>
.icon-star {
  margin-right: 2px;
}
.drag-handler {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.show-d {
  margin-top: 15px;
}

.el-tag {
  margin-left: 10px;
  margin-top: 10px;
}
.button-new-tag {
  margin-top: 10px;
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.title {
  font-size: 20px;
  display: flex;
  -webkit-align-items: center;
  align-items: center;
  position: relative;
}
.btn-wrap {
  position: absolute;
  right: 0;
}

</style>
