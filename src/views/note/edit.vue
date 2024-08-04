<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" class="form-container">
      <sticky :z-index="10" :class-name="'sub-navbar ' + publishStatus">
        <!-- <CategoryDropdown v-model="postForm.categoryId" required />
        <TagDropdown v-model="postForm.tagIds" style="margin-left: 10px;" /> -->
        <el-select v-model="postForm.categoryId" placeholder="请选择笔记分类">
          <el-option
            v-for="item in categoryList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="manualSave">
          立即保存
        </el-button>
        <el-button v-if="selectedId" style="margin-left: 10px;" type="primary" @click="reset()">新建</el-button>
      </sticky>

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

        <el-form-item prop="originContent" style="margin-bottom: 0px;">
          <div class="editor-container">
            <el-tag class="tag-title">
              笔记内容:
            </el-tag>
            <span v-if="tip" class="status-text">
              <i class="el-icon-circle-check" />
              <span style="margin-left:3px" v-text="tip" />
            </span>
            <div style="float:right">
              <el-switch
                v-model="postForm.topFlag"
                active-text="置顶"
                inactive-text="不置顶"
              />
            </div>

            <mavon-editor
              ref="md"
              v-model="postForm.originContent"
              :ishljs="true"
              :style="style"
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
    <EditCategoryForm ref="editCategoryForm" />
  </div>
</template>

<script>
import MDinput from '@/components/MDinput'
// 粘性header组件
import Sticky from '@/components/Sticky'
import EditCategoryForm from '@/views/setting/editCategory'
import axios from 'axios'

const defaultForm = {
  title: '', // 文章题目
  content: '', // 文章HTML内容
  originContent: '', // 文章原始内容,即markdown内容
  id: undefined,
  categoryId: '',
  topFlag: false
}
export default {
  name: 'MarkdownDemo',
  components: {
    MDinput, Sticky, EditCategoryForm },
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
      style: {
        'height': '60vh',
        'padding-bottom': '20px'
      },

      timeID: null,
      tip: '',
      categoryList: [],
      topFlag: false
    }
  },
  computed: {
    lang() {
      return this.$store.getters.language
    }
  },
  watch: {
    'postForm.title': {
      immediate: false,
      handler: function(newVal, oldVal) {
        // 5秒种后自动保存
        if (this.postForm.title !== '' || this.postForm.content !== '') {
          this.autoSave()
        }
      }
    },
    'postForm.content': {
      immediate: false,
      handler: function(newVal, oldVal) {
        // 5秒种后自动保存
        if (this.postForm.title !== '' || this.postForm.content !== '') {
          this.autoSave()
        }
      }
    }
  },
  mounted() {
    this.selectedId = this.$route.query.id
    if (this.selectedId) {
      this.publishStatus = 'published'
      this.getNoteById()
    }
    this.getCategoryList()
  },
  beforeDestroy() {
    // 移除可能残余的定时器
    clearTimeout(this.timeID)
  },
  methods: {
    // 自动保存
    autoSave() {
      if (this.timeID) {
        clearTimeout(this.timeID) //   清除定时器
      }
      this.timeID = setTimeout(() => { //   定时器
        this.tip = '自动保存中...'
        this.submitForm()
      }, 5000) //   操作结束后5秒  发送axios请求
    },
    // 手动保存
    manualSave() {
      if (this.timeID) {
        clearTimeout(this.timeID) //   清除定时器
      }
      if (this.postForm.title === '' && this.postForm.content === '') {
        this.$message({ message: '标题和内容不能全部为空', type: 'warning', showClose: true })
        return
      }
      this.tip = '保存中...'
      this.submitForm('manualSave')
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
          _this.$nextTick(() => {
            clearTimeout(_this.timeID)
          })
        })
        .catch(function(error) {
          _this.$message({ message: error.msg || 'Has Error', type: 'error', showClose: true })
        })
    },
    getCategoryList() {
      const _this = this
      _this.$store
        .dispatch('note/getNoteCategoryList')
        .then(function(response) {
          if (
            response != null &&
            response.code === 200 &&
            response.data.length > 0
          ) {
            _this.categoryList = response.data
          } else {
            _this.categoryList = []
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
    submitForm(type) {
      const _this = this
      if (_this.postForm.title === '') {
        _this.postForm.title = '无标题笔记'
      }
      if (_this.postForm.categoryId === '') {
        // 设置为默认分类
        _this.category = _this.categoryList.find(item => item.code === 'default')
        _this.postForm.categoryId = _this.category.id
      }
      _this.loading = true
      let path = 'note/addNote'
      if (_this.selectedId) {
        path = 'note/updateNote'
        // 清空更新时间，避免影响后台更新
        _this.postForm.lastUpdateTime = null
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
            _this.publishStatus = 'published'
            _this.$nextTick(() => {
              clearTimeout(_this.timeID)
            })
            if (type === 'manualSave') {
              _this.$notify({
                title: '成功',
                message: '笔记手动保存成功',
                type: 'success',
                duration: 2000
              })
            }
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
      this.tip = ''
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
      if (this.style.height === '100%') {
        this.style.height = '60vh'
      } else {
        this.style.height = '100%'
      }
    },
    openEditCategoryDialog() {
      this.$refs.editCategoryForm.show()
    }
  }
}
</script>

<style  lang="scss" scoped>
@import '~@/styles/mixin.scss';

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 30px 20px 30px;

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
