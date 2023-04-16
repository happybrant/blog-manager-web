<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" class="form-container">

      <div class="createPost-main-container">
        <el-row>
          <aside>
            Markdown 是一种轻量级标记语言，它允许人们使用易读易写的纯文本格式编写文档，Markdown文件的后缀名便是".md"
            <a
              href="https://markdown.com.cn/"
              target="_blank"
            >Document</a>
          </aside>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.title" :maxlength="100" name="name">
                标题
              </MDinput>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item prop="originContent" style="margin-bottom: 30px;">
          <div class="editor-container">
            <el-tag class="tag-title">
              笔记内容:
            </el-tag>
            <span v-if="tip" class="status-text">
              <i class="el-icon-circle-check" />
              <span style="margin-left:3px" v-text="tip" />
            </span>
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
import MDinput from '@/components/MDinput'
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
    MDinput },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      selectedId: '',
      publishStatus: 'draft',
      imgFile: [],
      height: '540px',
      timeID: null,
      tip: ''
    }
  },
  computed: {
    lang() {
      return this.$store.getters.language
    }
  },
  watch: {
    postForm: {
      deep: true,
      immediate: false,
      handler: function(val, oldVal) {
        // 5秒种后自动保存
        this.autoSave()
      }
    }
  },
  mounted() {
    this.selectedId = this.$route.query.id
    if (this.selectedId) {
      this.publishStatus = 'published'
      this.getNoteById()
    }
  },
  beforeDestroy() {
    // 移除可能残余的定时器
    clearTimeout(this.timeID)
  },
  methods: {
    autoSave(val, oldVal) {
      if (this.timeID) {
        clearTimeout(this.timeID) //   清除定时器
      }
      this.timeID = setTimeout(() => { //   定时器
        this.submitForm()
      }, 5000) //   操作结束后5秒  发送axios请求
    },
    // 实时监听内容
    $change(value, render) {
      this.postForm.content = render
      this.postForm.originContent = value
    },
    getNoteById() {
      const _this = this
      var parameters = {}
      parameters.id = _this.selectedId
      _this.$store
        .dispatch('note/getNoteById', parameters)
        .then(function(response) {
          if (response != null && response.code === 200 && response.data != null) {
            _this.postForm = response.data
            _this.tip = '上次保存于' + response.data.lastUpdateTime.substr(0, 16)
          } else {
            _this.postForm = null
          }
          _this.listLoading = false
          _this.$nextTick(() => {
            clearTimeout(_this.timeID)
          })
        })
        .catch(function(error) {
          _this.$message({ message: error.msg || 'Has Error', type: 'error', showClose: true })
          _this.listLoading = false
        })
    },
    submitForm() {
      const _this = this
      _this.tip = '自动保存中...'
      if (_this.postForm.title === '') {
        _this.postForm.title = '无标题笔记'
      }
      _this.loading = true
      let path = 'note/addNote'
      if (_this.selectedId) {
        path = 'note/updateNote'
      }
      _this.$store
        .dispatch(path, _this.postForm)
        .then(function(response) {
          if (response != null && response.code === 200) {
            setTimeout(() => {
              _this.tip = '已保存'
            }, 1000)
            if (!_this.selectedId) {
              _this.selectedId = response.data
              _this.postForm.id = response.data
            }

            _this.$nextTick(() => {
              clearTimeout(_this.timeID)
            })
          } else {
            _this.$notify({
              title: '失败',
              message: '保存笔记失败',
              type: 'error',
              duration: 2000
            })
          }
        })
        .catch(function(error) {
          _this.$notify({
            title: '失败',
            message: '保存笔记失败',
            type: 'error',
            duration: 2000
          })
          console.log(error)
        })
      _this.loading = false
    },
    reset() {
      this.postForm = Object.assign({}, defaultForm)
      this.selectedId = ''
      this.publishStatus = 'draft'
      this.$router.push('/note/edit')
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
.status-text {
  margin-left:10px;
  color: #a9b2c2;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
