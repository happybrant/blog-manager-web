<template>
  <div class="app-container main-conent-screen">
    <div class="screen-header">
      <el-row>
        <el-col>
          <el-button type="primary" icon="el-icon-plus" @click="openEditDialog('add',null)">新增</el-button>
          <el-button type="warning" icon="el-icon-delete" @click="deleteUser()">删除</el-button>
          <el-radio-group v-model="stateType" class="margin-l10" @change="getUserListPager">
            <el-radio-button label="全部" />
            <el-radio-button label="有效" />
            <el-radio-button label="禁用" />
          </el-radio-group>
          <el-radio-group v-model="type" class="margin-l10" @change="getUserListPager">
            <el-radio-button label="全部" />
            <el-radio-button label="管理员" />
            <el-radio-button label="普通用户" />
          </el-radio-group>
          <el-date-picker
            v-model="listQuery.createTime"
            class="margin-l10"
            align="right"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions"
            @change="getUserListPager"
          />
          <el-input v-model="listQuery.name" class="margin-l10" style="width:15%;" placeholder="请输入用户名或者显示名搜索">
            <i slot="suffix" class="el-input__icon el-icon-search cursor-pointer" @click="getUserListPager" />
          </el-input>
        </el-col>
        <el-col />
      </el-row>
    </div>
    <el-table ref="tableList" v-loading="listLoading" :data="userList" border fit highlight-current-row style="width: 100%">
      <el-table-column type="selection" width="60" align="center" />
      <el-table-column align="center" label="序号" width="65" type="index" :index="indexAdd" />

      <el-table-column width="120px" align="center" label="用户名">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="显示名">
        <template slot-scope="scope">
          <span>{{ scope.row.displayName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="邮箱">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="200">
        <template slot-scope="{row}">
          <el-switch
            :value="row.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="启用"
            inactive-text="禁用"
            :active-value="1"
            :inactive-value="2"
            @input="updateStatus(row)"
          />
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="类型" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.type == 1?'success':'info'">
            {{ row.type == 1 ? '管理员':'普通用户' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime,'{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="220">
        <template slot-scope="{row}">
          <el-button-group>
            <el-button type="primary" icon="el-icon-edit" title="编辑" @click="openEditDialog('edit',row)" />
            <el-button type="warning" icon="el-icon-refresh-right" title="重置密码" @click="resetPwd(row)" />
            <el-button type="danger" icon="el-icon-delete" title="删除" @click="deleteUser(row)" />
          </el-button-group>
          <!-- <el-button type="primary" size="small" icon="el-icon-edit" @click="openEditDialog('edit',row)">编辑</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getUserListPager" />
    <EditForm ref="editForm" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { parseTime } from '@/utils/index'
import EditForm from '@/views/user/edit'

export default {
  name: 'UserList',
  components: { Pagination, EditForm },

  data() {
    return {
      userList: null,
      total: 0,
      listLoading: true,
      stateType: '全部',
      type: '全部',
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        status: null,
        name: '',
        type: null
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      categoryOptions: []
    }
  },
  created() {
    this.getUserListPager()
  },
  methods: {
    indexAdd(index) {
      return index + 1 + (this.listQuery.pageIndex - 1) * this.listQuery.pageSize
    },
    parseTime(time, format) {
      return parseTime(time, format)
    },

    // 查看所有用户
    getUserListPager() {
      const _this = this
      _this.listLoading = true
      _this.listQuery.status = _this.stateType === '全部' ? null : (_this.stateType === '发布' ? 1 : 2)
      _this.listQuery.type = _this.type === '全部' ? null : (_this.type === '管理员' ? 1 : 2)

      _this.$store
        .dispatch('user/getUserListPager', _this.listQuery)
        .then(function(response) {
          if (response != null && response.code === 200 && response.data.records != null) {
            _this.userList = response.data.records
            _this.total = response.data.total
          } else {
            _this.userList = []
          }
        })
        .catch(function(error) {
          console.log(error)
          _this.$message({ message: error.msg || 'Has Error', type: 'error', showClose: true })
        })
      _this.listLoading = false
    },
    // 打开新增、编辑界面
    openEditDialog(action, row) {
      this.$refs.editForm.show(action, row)
    },
    // 点击删除按钮
    deleteUser(row) {
      let rows = []
      if (row == null) {
        rows = this.$refs.tableList.selection
      } else {
        rows.push(row)
      }

      if (rows.length === 0) {
        this.$alert('请选择需要删除的行', '提示', { type: 'warning' })
      } else {
        var list = []
        for (var i = 0; i < rows.length; i++) {
          list.push(rows[i].id)
        }
        const _this = this
        _this.isLoading = true

        _this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
          .then(() => {
            _this.$store
              .dispatch('user/deleteUser', list)
              .then(function(response) {
                if (response != null && response.code === 200 && response.data.length > 0) {
                  _this.$message({ message: '操作成功', type: 'success', showClose: true })
                  _this.getUserListPager()
                }
              })
              .catch(function(error) {
                _this.$message({ message: error.msg || 'Has Error', type: 'error', showClose: true })
                _this.isLoading = false
              })
          })
          .catch(() => { this.$message({ type: 'info', message: '已取消删除' }); _this.isLoading = false })
      }
    },
    // 修改用户状态
    updateStatus(row) {
      const _this = this
      _this.$confirm('确定' + (row.status === 1 ? '禁用' : '启用') + '该用户?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
        .then(() => {
          row.status = row.status === 1 ? 2 : 1
          _this.$store
            .dispatch('user/updateUser', row)
            .then(function(response) {
              if (response != null && response.code === 200) {
                _this.$message({ message: '操作成功', type: 'success', showClose: true })
                _this.dialogFormVisible = false
              } else {
                _this.$message({ message: response == null || response.message == null || response.message === '' ? '操作失败' : response.message, type: 'error', showClose: true })
              }
            })
            .catch(function(error) {
              console.log(error)
              _this.$message({ message: error.msg || 'Has Error', type: 'error', showClose: true })
            })
        })
        .catch(() => { this.$message({ type: 'info', message: '已取消' }); _this.isLoading = false })
    },

    // 重置密码
    resetPwd(row) {
      const _this = this
      _this.$confirm('此操作将重置该用户的登陆密码, 是否继续?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
        .then(() => {
          const parameters = {}
          parameters.id = row.id
          _this.$store
            .dispatch('user/resetPwd', parameters)
            .then(function(response) {
              if (response != null && response.code === 200) {
                _this.$message({ message: '操作成功', type: 'success', showClose: true })
                _this.dialogFormVisible = false
              } else {
                _this.$message({ message: response == null || response.message == null || response.message === '' ? '操作失败' : response.message, type: 'error', showClose: true })
              }
            })
            .catch(function(error) {
              console.log(error)
              _this.$message({ message: error.msg || 'Has Error', type: 'error', showClose: true })
            })
        })
        .catch(() => { this.$message({ type: 'info', message: '已取消' }); _this.isLoading = false })
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
