// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import VRouter from 'vue-router';
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import axios from './http'
import router from './router'
import store from './store/store'


Vue.config.productionTip = false;

Vue.use(ElementUI);

Vue.prototype.$bus = new Vue();
Vue.prototype.$apiHost = 'localhost:11111';
Vue.prototype.$defaultShowHost = 'newbie-unknown85822.i.nease.net';
Vue.prototype.$defaultShowNetDev = 'eth0';
Vue.prototype.axios = axios;


new Vue({
  el: '#app',
  router,
  axios,
  store,
  components: {App},
  render: h => h(App)
});

