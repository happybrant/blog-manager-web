<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <aside class="el-dialog__title">当前相册:{{ albumTitle }}</aside>
      </el-col>
      <el-col :span="12">
        <el-button type="primary" plain icon="el-icon-back" @click="back('add',null)">返回</el-button>
        <el-button type="primary" icon="el-icon-upload" @click="openUploadDialog()">上传</el-button>
      </el-col>
    </el-row>
    <aside class="margin-t20">
      <el-row>
        <el-col v-if="photoList.length == 0">当前相册中无照片</el-col>
        <el-col v-for="(photo, index) in photoList" id="image_col" ref="parent" :key="index" :span="5">
          <el-image
            ref="child"
            class="boxshadow"
            title="查看大图"
            :src="photo.path"
            :preview-src-list="srcList"
            fit="fill"
          />
          <p class="mark" :style="{left: scrollerHeight}" title="删除图片" @click="removePhoto(photo.id)">
            <!-- 标记信息 -->
            <i class="el-icon-delete text" />
          </p>
        </el-col>
      </el-row>
    </aside>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageIndex"
      :limit.sync="listQuery.pageSize"
      layout="total, prev, pager, next, sizes, jumper"
      @pagination="getPhotoListPager"
    />
    <uploadForm ref="uploadForm" />
  </div>
</template>
<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import uploadForm from '@/views/album/upload'

const elementResizeDetectorMaker = require('element-resize-detector')
export default {
  components: { Pagination, uploadForm },
  data() {
    return {
      dialogTitle: '相册详情', // 对话框标题
      dialogFormVisible: false, // 控制窗口是否可见
      scrollerHeight: 0,
      albumTitle: '',
      photoList: [],
      srcList: [],
      total: 100,
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        albumId: ''
      }
    }
  },
  computed: {
    // 滚动区高度
    // (业务需求：手机屏幕高度减去头部标题和底部tabbar的高度，当然这2个高度也是可以动态获取的)

  },
  mounted() {
    this.listQuery.albumId = this.$route.query.id
    this.albumTitle = this.$route.query.name
    // 根据id查找所有的图片
    this.getPhotoListPager()
  },
  methods: {
    back() {
      this.$router.push('/album/index')
    },
    openUploadDialog() {
      this.$refs.uploadForm.show()
    },
    removePhoto(id) {
      const _this = this
      var parameters = {}
      parameters.id = id
      _this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
        .then(() => {
          _this.$store
            .dispatch('album/deletePhoto', parameters)
            .then(function(response) {
              if (response != null && response.code === 200) {
                _this.$message({ message: '操作成功', type: 'success', showClose: true })
                _this.dialogFormVisible = false
                _this.getPhotoListPager()
              } else {
                _this.$message({ message: response == null || response.message == null || response.message === '' ? '操作失败' : response.message, type: 'error', showClose: true })
              }
            })
            .catch(function(error) {
              _this.$message({ message: error.msg || 'Has Error', type: 'error', showClose: true })
            })
        })
        .catch(() => {
          _this.$message({ type: 'info', message: '已取消删除' })
        })
    },
    getPhotoListPager() {
      const _this = this
      _this.$store
        .dispatch('album/getPhotoListPager', _this.listQuery)
        .then(function(response) {
          if (response != null && response.code === 200) {
            _this.photoList = response.data.records
            // 生成srcList,用于大图查看可以切换
            _this.srcList = _this.photoList.map(item => item.path)
            _this.total = response.data.total
            _this.$nextTick(function() {
              _this.resize()
            })
          } else {
            _this.photoList = []
          }
        })
        .catch(function(error) {
          console.log(error)
          _this.$message({ message: error.msg || 'Has Error', type: 'error', showClose: true })
        })
    },
    // 重新设置删除角标的位置
    resize() {
      // 监听元素变化
      const erd = elementResizeDetectorMaker()
      const that = this
      if (that.photoList.length > 0) {
        erd.listenTo(document.getElementById('image_col'), function(element) {
          that.$nextTick(function() {
            this.scrollerHeight = (this.$refs.parent[0].$el.offsetWidth + this.$refs.child[0].$el.offsetWidth) / 2 + 'px'
          })
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep .el-image__preview {
    cursor: zoom-in;
  }
  /* 阴影 */
  .boxshadow {
    position: relative;
    margin: 10px auto;
    box-shadow:4px 2px 6px #333333;
    width: 13vw;
    height: 13vw;
    border-radius: 3px;
  }
 .el-col-5 {
    width:20%;
    position: relative;
  }
  .el-image{
    position: relative;
    display: block;
    overflow: hidden;
  }
  .mark {
    position: absolute;
    top: 10px;
    left:0;
    margin: 0;
    cursor: pointer;
  }
  .mark:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    border-style: solid;
    border-width: 25px;
    z-index: 1;
    border-color: #409EFF #409EFF transparent transparent;
    transform: translateX(-100%);
  }
  .text {
    -moz-transform: rotate(0deg) translateX(-100%) translateZ(0);
    -ms-transform: rotate(0deg) translateX(-100%) translateZ(0);
    -o-transform: rotate(0deg) translateX(-100%) translateZ(0);
    -webkit-transform: rotate(0deg) translateX(-100%) translateZ(0);
    transform: rotate(0deg) translateX(-100%) translateZ(0);
    color: #FFF;
    display: inline-block;
    position: absolute;
    top: 8px;
    /* left: 0; */
    z-index: 1;
    font-size: 15px;
    text-transform: uppercase;
    width: 30px;
    text-align: center;
  }

</style>
