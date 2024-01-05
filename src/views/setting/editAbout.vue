<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <sticky :z-index="10" :class-name="'sub-navbar ' +publishStatus">
        <el-button v-loading="loading" style="margin-left: 10px" type="success" @click="submitForm(3)">
          发布
        </el-button>
        <el-button style="margin-left: 10px;" type="warning" @click="submitForm(4)">暂存</el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <aside>
            在这里进行编辑可以在博客前端的<a :href="fullRouting" target="_blank">关于我</a>界面进行展示
          </aside>
        </el-row>
        <el-form-item prop="originContent">
          <div class="editor-container">
            <mavon-editor
              ref="md"
              v-model="postForm.originContent"
              :ishljs="true"
              :style="{ height: height}"
              class="markdown"
              @imgAdd="$imgAdd"
              @imgDel="$imgDel"
              @change="$change"
              @fullScreen="toggleScreenHeight"
            />
          </div>
        </el-form-item>

      </div>
    </el-form>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky' // 粘性header组件
import axios from 'axios'

const defaultForm = {
  title: '', // 文章题目
  content: '', // 文章HTML内容
  originContent: '', // 文章原始内容,即markdown内容
  id: undefined
}
export default {
  name: 'MarkdownDemo',
  components: {
    Sticky
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(rule.message))
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        originContent: [
          { validator: validateRequire, message: '文章内容不能为空' }
        ]
      },
      selectedId: '',
      publishStatus: 'draft',
      imgFile: [],
      height: '700px',
      frontApi: process.env.VUE_APP_FRONT_API,
      fullRouting: ''
    }
  },
  computed: {
    lang() {
      return this.$store.getters.language
    }
  },
  mounted() {
    this.getArticleById()
    this.getSettingByCurrentUser()
  },
  methods: {
    // 实时监听内容
    $change(value, render) {
      this.postForm.content = render
      this.postForm.originContent = value
    },
    getArticleById() {
      const _this = this
      var parameters = {}
      _this.$store
        .dispatch('blog/getAboutMeArticle', parameters)
        .then(function(response) {
          if (
            response != null &&
            response.code === 200 &&
            response.data != null
          ) {
            _this.postForm = response.data
            if (_this.postForm.status === 3) {
              _this.publishStatus = 'published'
            }
            _this.selectedId = _this.postForm.id
          } else {
            _this.postForm.originContent = ''
          }
          _this.listLoading = false
        })
        .catch(function(error) {
          _this.$message({
            message: error.msg || 'Has Error',
            type: 'error',
            showClose: true
          })
          _this.listLoading = false
        })
    },
    submitForm(status) {
      const _this = this
      _this.$refs.postForm.validate((valid) => {
        if (valid) {
          _this.loading = true
          _this.postForm.status = status
          let path = 'blog/addArticle'
          if (this.selectedId) {
            path = 'blog/updateArticle'
          }
          _this.$store
            .dispatch(path, _this.postForm)
            .then(function(response) {
              if (response != null && response.code === 200) {
                _this.$notify({
                  title: '成功',
                  message: status === 3 ? '发布文章成功' : '暂存文章成功',
                  type: 'success',
                  duration: 2000
                })
                _this.publishStatus = status === 3 ? 'published' : 'draft'
              } else {
                _this.$notify({
                  title: '失败',
                  message: '保存文章失败',
                  type: 'error',
                  duration: 2000
                })
              }
            })
            .catch(function(error) {
              _this.$notify({
                title: '失败',
                message: '保存文章失败',
                type: 'error',
                duration: 2000
              })
              console.log(error)
            })
          _this.loading = false
        } else {
          return false
        }
      })
    },

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
            _this.fullRouting = _this.frontApi + response.data.routing + '/about'
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

    // 绑定@imgAdd event
    $imgAdd(pos, $file) {
      this.imgFile[pos] = $file
      // 第一步.将图片上传到服务器.
      var formdata = new FormData()
      formdata.append('file', $file)
      axios({
        url: process.env.VUE_APP_BASE_API + '/file/upload',
        method: 'post',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then((response) => {
        const { data } = response
        // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
        /**
         * $vm 指为mavonEditor实例，可以通过如下两种方式获取
         * 1. 通过引入对象获取: `import {mavonEditor} from ...` 等方式引入后，`$vm`为`mavonEditor`
         * 2. 通过$refs获取: html声明ref : `<mavon-editor ref=md ></mavon-editor>，`$vm`为 `this.$refs.md`
         */
        this.$refs.md.$img2Url(pos, data)
      })
    },
    $imgDel(pos) {
      delete this.imgFile[pos]
    },
    toggleScreenHeight() {
      if (this.height === '100%') {
        this.height = '540px'
      } else {
        this.height = '100%'
      }
    }
  }
}
</script>

<style  lang="scss" scoped>
@import '~@/styles/mixin.scss';

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 30px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea ::v-deep {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
.editor-container {
  margin-bottom: 30px;
}
.tag-title {
  margin-bottom: 5px;
}
</style>
