<template>
  <div class="app-container">
    <el-row>
      <el-col :span="12">
        <el-button type="primary" icon="el-icon-plus" @click="openEditDialog('add')">添加</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col v-for="(album,index) in albumList" :key="index" class="margin-t20" :span="5" :offset="index % 4 > 0 ? 1 : 0">
        <el-card shadow="always" :body-style="{ padding: '0px' }">
          <img :src="album.imageUrl" class="image" :title="album.description" @click="openEditDialog('edit',album)">
          <div style="padding: 14px;">
            <span>{{ album.name }}</span>
            <div class="bottom clearfix">
              <time class="time">{{ album.createTime }}</time>
              <el-button type="text" class="button">
                <router-link :to="{path:'/album/detail',query:{id:album.id,name:album.name}}" style="text-decoration:none">查看相册</router-link>
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" layout="total, prev, pager, next, sizes, jumper" @pagination="getAlbumListPager" />

    <editForm ref="editForm" />
  </div>
</template>
<style lang="scss" scoped>
  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    height: 280px;
    display: block;
    cursor: pointer;
    transition: all 0.6s;
  }
  img:hover {
    transform: scale(1.1);
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }

  .clearfix:after {
      clear: both
  }
</style>
<script>
import editForm from '@/views/album/edit'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
  components: { editForm, Pagination },

  data() {
    return {
      currentDate: '2022-06-07 12:46:00',
      total: 100,
      albumList: [],
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 8
      }
    }
  },
  mounted() {
    this.getAlbumListPager()
  },
  methods: {
    getAlbumListPager() {
      const _this = this

      _this.$store
        .dispatch('album/getAlbumListPager', _this.listQuery)
        .then(function(response) {
          if (response != null && response.code === 200) {
            _this.albumList = response.data.records
            _this.total = response.data.total
          } else {
            _this.albumList = []
          }
        })
        .catch(function(error) {
          _this.$message({ message: error.msg || 'Has Error', type: 'error', showClose: true })
        })
    },
    // 点击修改按钮
    openEditDialog(action, album) {
      this.$refs.editForm.show(action, album)
    }
  }
}
</script>

