<template>
  <el-main>

    <searchform/>
    <!-- 展示组件 -->

    <el-row>
      <el-col :span="24">
        <multihost echartsid="mutihostcharts"></multihost>
      </el-col>
    </el-row>

  </el-main>
</template>

<style>
  .el-header {
    /* background-color: rgb(0, 128, 100); */
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }

  .el-main {
    width: 100%
  }

  .span {
    font-family: "Helvetica Neue";
  }
</style>

<script>
  import searchform from './searchform'
  import multihost from './multihost'
  // axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

  export default {
    name: 'compare',
    data() {
      return {}
    },
    components: {
      searchform,
      multihost
    },
  };
</script>
