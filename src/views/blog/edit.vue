<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <sticky :z-index="10" :class-name="'sub-navbar ' + publishStatus">
        <CategoryDropdown v-model="postForm.categoryId" required />
        <TagDropdown v-model="postForm.tagIds" style="margin-left: 10px;" />
        <el-button type="primary" style="margin-left: 10px;" @click="openUploadDialog">封面
          <i v-if="postForm.coverUrl" class="el-icon-success el-icon--right" title="已上传" />
          <i v-else class="el-icon-warning el-icon--right" title="未上传" />
        </el-button>
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm(1)">
          发布
        </el-button>
        <el-button v-loading="loading" type="warning" @click="submitForm(2)">
          保存草稿
        </el-button>
        <el-button v-if="selectedId" style="margin-left: 10px;" type="primary" @click="reset()">新建</el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>

          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.title" :maxlength="100" name="name" required>
                标题
              </MDinput>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item style="margin-bottom: 40px;" label-width="50px" label="摘要:">
          <el-input v-model="postForm.description" :rows="1" type="textarea" class="article-textarea" autosize placeholder="请输入内容" />
          <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}个字</span>
        </el-form-item>
        <el-form-item prop="originContent" style="margin-bottom: 30px;">
          <div class="editor-container">
            <!-- <markdown-editor ref="markdownEditor" v-model="postForm.originContent" height="600px" /> -->
            <mavon-editor
              ref="md"
              v-model="postForm.originContent"
              :ishljs="true"
              style="min-height:500px"
              class="markdown"
              @imgAdd="$imgAdd"
              @imgDel="$imgDel"
              @change="$change"
            />
          </div>
        </el-form-item>

      </div>
    </el-form>
    <CoverUpload ref="coverUpload" />
  </div>
</template>

<script>
import axios from 'axios'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件

import {
  CategoryDropdown,
  TagDropdown,
  CoverUpload
} from './components'

const defaultForm = {
  title: '', // 文章题目
  content: '', // 文章HTML内容
  description: '',
  originContent: '', // 文章原始内容,即markdown内容
  coverUrl: '', // 封面图片
  id: undefined,
  tagIds: [],
  categoryId: 0
}

export default {
  name: 'MarkdownDemo',
  components: {
    CoverUpload,
    MDinput,
    Sticky,
    CategoryDropdown,
    TagDropdown
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
        title: [{ validator: validateRequire, message: '请输入博客标题' }],
        originContent: [{ validator: validateRequire, message: '博客内容不能为空' }]
      },
      selectedId: '',
      publishStatus: 'draft',
      imgFile: []
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.description.length
    },
    lang() {
      return this.$store.getters.language
    }
  },
  mounted() {
    this.selectedId = this.$route.query.id
    if (this.selectedId) {
      this.getArticleById()
      this.publishStatus = 'published'
    }
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
      parameters.id = _this.selectedId
      _this.$store
        .dispatch('blog/getArticleById', parameters)
        .then(function(response) {
          if (response != null && response.code === 200 && response.data != null) {
            _this.postForm = response.data
            _this.postForm.tagIds = response.data.tags.map(item => item.id)
          } else {
            _this.postForm = null
          }
          _this.listLoading = false
        })
        .catch(function(error) {
          _this.$message({ message: error.msg || 'Has Error', type: 'error', showClose: true })
          _this.listLoading = false
        })
    },
    submitForm(status) {
      const _this = this
      _this.$refs.postForm.validate((valid) => {
        if (valid) {
          if (_this.postForm.categoryId === 0) {
            _this.$message({ message: '请选择博客分类', type: 'warning', showClose: true })
            return
          }
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
                  message: status === 1 ? '发布文章成功' : '暂存文章成功',
                  type: 'success',
                  duration: 2000
                })
                _this.postForm = Object.assign({}, defaultForm)
                _this.selectedId = ''
                _this.$router.push('/blog/edit')
                _this.publishStatus = 'draft'
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
    reset() {
      this.postForm = Object.assign({}, defaultForm)
      this.selectedId = ''
      this.publishStatus = 'draft'
      this.$router.push('/blog/edit')
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
    openUploadDialog() {
      this.$refs.coverUpload.show(this.postForm.coverUrl)
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
::v-deep label{
  font-weight: 700;
}
</style>
