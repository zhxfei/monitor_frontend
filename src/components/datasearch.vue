
<template>
<div>
    <el-container style="height: 100%; border: 0px">
          <el-aside width="200px">
            <el-menu :default-openeds="['1']">
              <el-submenu index="1">
                <template slot="title"><i class="el-icon-menu"></i>Dashboard</template>
                <el-menu-item-group>
                  <el-menu-item index="1-1"><a href="/overview">机器概况</a></el-menu-item>
                  <a href="/datasearch"><el-menu-item index="1-2">数据展示</el-menu-item></a>
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </el-aside>

    <el-container>
      <el-header style="text-align: left; font-size: 20px">
          <i class="el-icon-setting" style="margin-right: 15px"></i>
        <span>Ease Monitor</span>
      </el-header>


      <el-main>
        <!-- form组件 -->
        <hostform></hostform>
        <!-- echarts组件 -->
        <itemshow></itemshow>

      </el-main>
     </el-container>  
    </el-container>
</div>
  
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
    font-family: "Helvetica Neue",
  }
</style>

<script>
  import hostform from './searchform'
  import itemshow from './historysearch'
  // axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
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