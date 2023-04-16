<template>
  <div class="indexlayout-right-footer">
    <div class="footer-copyright">Copyright © 2022 江南入直</div>
  </div>
</template>
<script>
export default {
  name: 'Footer'
}
</script>
<style lang="scss">
.indexlayout-right-footer {
  padding: 0;
  height: 30px;
  line-height: 30px;
  overflow: hidden;
  text-align: center;
  font-size: 14px;
  color: #999;
  background: #fff;
  .footer-links {
    margin-bottom: 10px;
    a {
      margin-right: 30px;
      color: #808695;
      text-decoration: none;
      &:last-child {
        margin-right: 0;
      }
      &:hover {
        color: #515a6e;
      }
    }
  }
}
.dl-width-custom {
  width: 60%;
  .body {
    max-height: 520px;
    min-height: 200px;
    overflow-y: auto;
    padding-left: 10px;
    padding-right: 10px;
  }
}
.dl-width-custom-l {
  width: 80%;
  margin-top: 50px !important;
  .body {
    max-height: 680px;
    min-height: 200px;
    overflow-y: auto;
    padding-left: 10px;
    padding-right: 10px;
  }
}
.el-table {
  width: 100%;
  .el-table__header-wrapper table,
  .el-table__body-wrapper table {
    width: 100% !important;
  }
  .el-table__body,
  .el-table__footer,
  .el-table__header {
    table-layout: auto;
  }
}
</style>
