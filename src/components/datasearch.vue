
<template>

      <el-main>
        <!-- form组件 -->
        <hostform></hostform>
        <!-- echarts组件 -->
        <itemshow></itemshow>

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
  .span{
    font-family: "Helvetica Neue";
  }
</style>

<script>
  import hostform from './searchform'
  import itemshow from './historysearch'

  export default {
    name: 'datasearch',
    data() {
      return {

      }
    },
    components: {
      itemshow,
      hostform
    },
  };
</script>
