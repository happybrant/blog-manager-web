<template>
  <el-autocomplete
    v-model="search"
    :trigger-on-focus="false"
    placeholder="请输入检索内容"
    class="nav-algolia-search"
    popper-class="algolia-search"
    :fetch-suggestions="querySearch"
  >
    <template slot-scope="{ item }">
      <p class="algolia-search-title" v-html="item.title" />
      <p v-if="item.content" class="algolia-search-content" v-html="item.content" />
    </template>
  </el-autocomplete>
</template>
<script>
export default {
  data() {
    return {
      project: [{ id: 1,
        title: '<span>table</span><span class="algolia-search-separator" /><span>表尾合计行</span>',
        content: '若<span class="algolia-highlight">表格</span>展示的是各类数字，可以在表尾显示各列的合计。'
      }, { id: 2,
        title: '<span>table</span><span class="algolia-search-separator" /><span>筛选</span>',
        content: ' 对<span class="algolia-highlight">表格</span>进行筛选，可快速查找到自己想看的数据。'
      }, { id: 3,
        title: ' <span>table</span><span class="algolia-search-separator" /><span>排序</span>',
        content: '  对<span class="algolia-highlight">表格</span>进行排序，可快速查找或对比数据。'
      }, { id: 4,
        title: ' <span>table</span><span class="algolia-search-separator" /><span>排序</span>'
      }],
      search: ''
    }
  },
  methods: {
    // 过滤项目和class
    async querySearch(queryString, cb) {
      if (queryString && queryString.length > 0) {
        this.search = queryString
        try {
          const data = this.project // search定义在data里
          // 赋值给建议列表，渲染到页面
          var list = data
          // 如果list.length等于0，则代表没有匹配到结果。手动给list添加一条提示信息
          // if (list.length === '0') {
          //   list.push({
          //     id: '-1',
          //     value: '无匹配结果'
          //   })
          //   // 调用 callback 返回建议列表的数据
          //   cb(list)
          // } else {
          //   list = list.map(item => {
          //     return {
          //       value: `${item.projectName}`,
          //       id: `${item.id}`
          //     }
          //   })
          //   // 调用 callback 返回建议列表的数据
          //   cb(list)
          // }
          console.log(list)
          cb(list)
        } catch (error) {
          console.log(error)
        }
      }
    }
  }
}
</script>
<style lang="scss">
 .algolia-search {
    width: 407px!important;
}
 .algolia-search li {
    border-bottom: 1px solid #ebebeb;
}
.algolia-search .algolia-search-title {
    font-size: 14px;
    margin: 6px 0;
    line-height: 1.8;
}
.algolia-search .algolia-search-separator {
    padding: 0 6px;
}
.algolia-search .algolia-search-content {
    font-size: 12px;
    margin: 6px 0;
    line-height: 2.4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.algolia-search .algolia-highlight {
    color: #409eff;
    font-weight: 700;
}

.algolia-search li:last-child {
    border-bottom: none;
}
.nav-algolia-search {
    width: 225px;
    line-height: 60px;
    display: inline-block;
    list-style: none;
    position: relative;
    cursor: pointer;
  }
  .nav-algolia-search .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
  .nav-algolia-search .el-input {
    font-size: 13px;
  }
</style>
