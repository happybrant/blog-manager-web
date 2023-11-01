<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="8" class="list">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-input v-model="listQuery.title" placeholder="请输入搜索内容" @keypress.native="getNoteListPager">
              <i slot="prefix" class="el-input__icon el-icon-search cursor-pointer" />
            </el-input>
          </div>
          <section style="height:570px;overflow:auto">
            <ul v-if="noteList.length > 0" class="note-list">
              <li
                v-for="(item,index) of noteList"
                :key="index"
                :class="{selected:isActive === index}"
                @click="openNote(index, item)"
              >
                <label>
                  <div class="file-icon-wrap">
                    <span class="file-icon">
                      <svg-icon v-if="item.topFlag" icon-class="top" />
                      <svg-icon icon-class="file-markdown-fill" />
                    </span>
                  </div>
                  <span class="file-name-wrap" v-html="item.title " />
                  <span class="file-date">
                    {{ parseTime(item.createTime) }}
                  </span>
                  <el-dropdown trigger="click">
                    <span class="el-dropdown-link file-more">
                      <i class="el-icon-arrow-down el-icon--right" />
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <router-link :to="{path:'/note/edit'}" style="text-decoration:none">
                        <el-dropdown-item>新建</el-dropdown-item>
                      </router-link>
                      <router-link :to="{path:'/note/edit',query:{id:item.id}}" style="text-decoration:none">
                        <el-dropdown-item>编辑</el-dropdown-item>
                      </router-link>
                      <el-dropdown-item @click.native="btnTop_Click(item.id, item.topFlag)">{{ item.topFlag?'取消置顶':'置顶' }}</el-dropdown-item>
                      <el-dropdown-item divided @click.native="btnDelete_Click(item.id)">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </label>
              </li>
            </ul>
            <el-empty v-else description="暂无数据" />

          </section>
          <pagination v-show="total > 0" layout="total, prev, pager, next" :pager-count="5" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getNoteListPager" />
        </el-card>
      </el-col>
      <el-col :span="16" class="detail">
        <el-card v-if="noteList.length > 0" class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <div class="title">
              <span v-html="selectedTitle" />
              <div class="btn-wrap">
                <router-link :to="{path:'/note/edit',query:{id:selectedId}}" style="text-decoration:none">
                  <el-button type="primary" icon="el-icon-edit">
                    编辑
                  </el-button>
                </router-link>
              </div>
            </div>
          </div>
          <mavon-editor
            class="mavonEditor"
            :value="selectedContent"
            :subfield="false"
            default-open="preview"
            :toolbars-flag="true"
            :editable="false"
            :scroll-style="true"
            :box-shadow="false"
            :toolbars="toolbarsObj"
            :style="{ height: height}"
            @fullScreen="toggleScreenHeight"
          />
        </el-card>
        <el-empty v-else description="暂无数据" />
      </el-col>
    </el-row>
  </div>

</template>

<script>
import { parseTime } from '@/utils/index'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import 'mavon-editor/dist/css/index.css'
export default {

  name: 'NoteList',
  components: { Pagination },
  data() {
    return {
      noteList: [],
      total: 0,
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        title: ''
      },
      isActive: 0,
      selectedId: '',
      selectedContent: '',
      selectedTitle: '',
      toolbarsObj: {
        navigation: true, // 导航
        fullscreen: true, // 全屏编辑
        readmodel: true // 沉浸式阅读
      },
      height: '714px' // 初始化高度
    }
  },
  mounted() {
    this.getNoteListPager()
  },
  methods: {

    parseTime(time) {
      return parseTime(time, '{y}-{m}-{d} {h}:{i}')
    },
    openNote(i, note) {
      this.isActive = i
      this.selectedId = note.id
      this.selectedTitle = note.title
      this.selectedContent = note.originContent
    },
    getNoteListPager() {
      const _this = this
      const path = _this.$route.path
      const index = path.lastIndexOf('/')
      const code = path.substr(index + 1)
      _this.listQuery.code = code
      _this.listLoading = true
      _this.$store
        .dispatch('note/getNoteListPager', _this.listQuery)
        .then(function(response) {
          if (response != null && response.code === 200 && response.data.records.length > 0) {
            _this.noteList = response.data.records
            _this.total = response.data.total
            _this.selectedId = _this.noteList[0].id
            _this.selectedTitle = _this.noteList[0].title
            _this.selectedContent = _this.noteList[0].originContent
          } else {
            _this.noteList = []
            _this.total = 0
          }
          _this.listLoading = false
        })
        .catch(function(error) {
          _this.$message({ message: error.msg || 'Has Error', type: 'error', showClose: true })
          _this.listLoading = false
        })
    },
    // 点击删除按钮
    btnDelete_Click(id) {
      const _this = this
      var parameters = {}
      parameters.id = id
      _this
        .$confirm('此操作将永久删除该数据，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          _this.$store
            .dispatch('note/deleteNote', parameters)
            .then(function(response) {
              if (response != null && response.code === 200) {
                _this.$message({ message: '操作成功', type: 'success', showClose: true })
                _this.getNoteListPager()
              } else {
                _this.$message({ message: response == null || response.message == null || response.message === '' ? '操作失败' : response.message, type: 'error', showClose: true })
              }
            })
            .catch(function(error) {
              _this.$message({ message: error.msg || 'Has Error', type: 'error', showClose: true })
            })
        })
    },
    // 置顶操作
    btnTop_Click(id, topFlag) {
      const _this = this
      var parameters = {}
      parameters.id = id
      parameters.topFlag = !topFlag
      _this.$store
        .dispatch('note/updateNote', parameters)
        .then(function(response) {
          console.log(response)
          if (response != null && response.code === 200) {
            _this.listQuery.pageIndex = 1
            _this.getNoteListPager()
            _this.$message({ message: '操作成功', type: 'success', showClose: true })
          } else {
            _this.$message({ message: response == null || response.message == null ||
            response.message === '' ? '操作失败' : response.message, type: 'error', showClose: true })
          }
        })
        .catch(function(error) {
          _this.$message({ message: error.msg || 'Has Error', type: 'error', showClose: true })
        })
    },
    toggleScreenHeight() {
      if (this.height === '100%') {
        this.height = '714px'
      } else {
        this.height = '100%'
      }
    }
  }
}
</script>

<style scoped>
.mavonEditor {
  width: 100%;
  height: 100%;
}
 ::v-deep .el-input__inner {
    border-radius: 24px;
}
::v-deep .el-card__header {
    padding: 18px 14px;
}
.note-list {
    margin: 0;
    padding: 0;
    list-style: none;
}
.note-list li {
    position: relative;
    font-size: 14px;
    font-weight: 500;
    border-bottom: 1px solid #ededed;
    cursor: pointer;
}
li:hover:not(.selected) {
    background: #f4f6f7;
}
li.selected {
    border-top: 1px solid #ffffff;
    border-radius: 4px;
    background-color: #f4f6f7;
}
.note-list li label {
    word-break: break-all;
    padding: 15px 15px 15px 15px;
    display: flex;
    line-height: 1;
    font-size: 14px;
    -webkit-transition: color .4s;
    transition: color .4s;
    height: 50px;
    -webkit-align-items: center;
    align-items: center;
    position: relative;
}
::v-deep .list .el-card__body {
    padding: 10px;
}
::v-deep .detail .el-card__body {
    padding: 0 0 20px 0;
}
.file-name-wrap {
    flex: 1;
    -webkit-flex: 1;
    -webkit-align-items: center;
    align-items: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.file-date {
    margin-left: 10px;
    display: inline-block;
    color: #c0c8d6;
    white-space: nowrap;
}
.file-more {
    display: none;
    cursor: pointer;
    padding: 2px;
    border-radius: 4px;
}
li:hover .file-more {
    display: block;
}
li:hover .file-date {
    display: none;
}
.file-icon-wrap {
    position: relative;
}
.file-icon{
    margin-right: 8px;
    font-size: 16px;
}
.title{
  font-size: 20px;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
    position: relative;
}
.btn-wrap{
    display: flex;
    -webkit-align-items: center;
    align-items: center;
    -webkit-flex-shrink: 0;
    flex-shrink: 0;
    position: absolute;
    z-index: 50;
    right: 0;
}
.list-empty {
  height:500px;
  text-align: center;
  line-height: 500px;
  font-size: 20px;
  color: #999;
}
.empty {
   height:650px;
  text-align: center;
  line-height: 650px;
  font-size: 20px;
  color: #999;
}
</style>
