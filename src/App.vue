<template>
  <div id="app">
    <el-container style="height: 100%; border: 0px">
          <el-aside width="200px">
            <el-menu
              :default-openeds="['1', '2', '3']">

              <el-submenu index="1">
                <template slot="title"><i class="el-icon-view"></i><span class="subTitle">数据报表</span></template>
                <el-menu-item-group>
                  <el-menu-item index="1-1"><router-link to="/overview">机器指标概览</router-link></el-menu-item>
                  <el-menu-item index="1-2"><router-link to="/datasearch">历史数据查询</router-link></el-menu-item>
                  <el-menu-item index="1-3"><router-link to="/compare">指标对比</router-link></el-menu-item>
                </el-menu-item-group>
              </el-submenu>

              <el-submenu index="2">
                <template slot="title"><i class="el-icon-tickets"></i><span class="subTitle">策略管理</span></template>

                <el-menu-item-group>
                  <el-menu-item index="3-1"><router-link to="/police">模板配置</router-link></el-menu-item>
                </el-menu-item-group>

                <el-menu-item-group>
                  <el-menu-item index="3-1"><router-link to="/police">告警配置</router-link></el-menu-item>
                </el-menu-item-group>

                <el-menu-item-group>
                  <el-menu-item index="3-1"><router-link to="/police">策略配置</router-link></el-menu-item>
                </el-menu-item-group>

              </el-submenu>


              <el-submenu index="3">
                <template slot="title"><i class="el-icon-share"></i><span class="subTitle">Admin</span></template>

                <el-menu-item-group>
                  <el-menu-item index="4-1"><router-link to="/usermanage">用户管理</router-link></el-menu-item>

                </el-menu-item-group>

                <el-menu-item-group>
                  <el-menu-item index="4-2"><router-link to="/datamanage">数据管理</router-link></el-menu-item>
                </el-menu-item-group>

              </el-submenu>


            </el-menu>
          </el-aside>

    <el-container id="main-container">

      <el-header style="text-align: left; font-size: 20px">

        <el-col :span="6" :offset="0">
          <i class="el-icon-setting" style="margin-right: 15px"></i>
          <span>Ease Monitor</span>

        </el-col>


        <el-col :span="1" :offset="17">
          <el-dropdown>
              <span class="el-icon-caret-bottom" v-if="isLogin" style="font-size: 15px">{{username}}
              </span>
            <span class="el-dropdown-link" v-else v-text="'Login'">
              <i class="el-icon-arrow-down el-icon--right"></i>
              <a  href="javascript:;" class="logout" @click="login">login</a>
              </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><a href="javascript:;" class="logout" @click="logout" v-if="isLogin">logout</a></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>


        </el-col>
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
import overview from './views/overview'
import datasearch from './views/datasearch'
import * as types from './store/types'

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
      },
      logout() {
        this.$store.commit(types.LOGOUT);
        this.$router.push('login')
      },
      login() {
        this.$router.push('login')
      }

  },
  computed: {
    isLogin (){
      return this.$store.state.token !== null
    },
    username (){
      return this.$store.state.user.username
    }
  },
  watch: {
    // isLogin
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
