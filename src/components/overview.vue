<template>
  <el-main>

    <toggleform/>
    <!-- 展示组件 -->
    <systemview/>

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
  import toggleform from './toggleform'
  import systemview from './systemview'
  // axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

  export default {
    name: 'overview',
    data() {
      return {}
    },
    components: {
      toggleform,
      systemview
    },
  };
</script>
