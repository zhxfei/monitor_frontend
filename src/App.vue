<template>
  <div id="app">
    <el-container style="height: 100%; border: 0px">
          <el-aside width="200px">
            <el-menu
              :default-openeds="['1', '2']">

              <el-submenu index="1">
                <template slot="title"><i class="el-icon-view"></i><span class="subTitle">数据报表</span></template>
                <el-menu-item-group>
                  <el-menu-item index="1-1"><router-link to="/overview">机器指标概览</router-link></el-menu-item>
                  <el-menu-item index="1-2"><router-link to="/datasearch">历史数据查询</router-link></el-menu-item>
                  <el-menu-item index="1-3"><router-link to="/compare">机器指标对比</router-link></el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="2">
                <template slot="title"><i class="el-icon-edit-outline"></i><span class="subTitle">报表配置</span></template>
                <el-menu-item-group>
                  <el-menu-item index="2-1"><router-link to="/datamanage">数据管理</router-link></el-menu-item>
                  <el-menu-item index="2-2"><router-link to="/usermanage">用户管理</router-link></el-menu-item>

                </el-menu-item-group>
              </el-submenu>

            </el-menu>
          </el-aside>

    <el-container id="main-container">
      <el-header style="text-align: left; font-size: 20px">
          <i class="el-icon-setting" style="margin-right: 15px"></i>
        <span>Ease Monitor</span>
        <br>

      </el-header>

          <transition>
            <keep-alive>

              <router-view></router-view>

            </keep-alive>
          </transition>

     </el-container>
    </el-container>
  </div>

</template>

<script>
import overview from './components/overview'
import datasearch from './components/datasearch'

export default {
  name: 'App',
  data(){
      return {

      }
  },
  components: {
    overview,
    datasearch
  },
  methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}

#main-container {
  height: 100%;
}

a {
  text-decoration: none;
  color: #2c3e50;

}
.subTitle {
  font-weight: bold
}
</style>
