// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VRouter from 'vue-router';
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'

import datasearch from './components/datasearch'
import overview from './components/overview'
import compare from './components/compare'
import datamanage from './components/datamanage'
import usermanage from './components/usermanage'
import login from './components/login'

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(VRouter);

Vue.prototype.$bus = new Vue();
Vue.prototype.$apiHost = 'localhost:11111';
Vue.prototype.$defaultShowHost = 'newbie-unknown85822.i.nease.net';
Vue.prototype.$defaultShowNetDev = 'eth0';

let router = new VRouter({
  // mode: 'history',
  routes: [
    {
      path: '/',
      redirect: overview
    },
    {
      path: '/overview',
      name: 'overview',
      component: overview
    },
    {
      path: '/datasearch',
      name: 'datasearch',
      component: datasearch
    },
    {
      path: '/compare',
      name: 'compare',
      component: compare
    },
    {
      path: '/datamanage',
      name: 'datamanage',
      component: datamanage
    },
    {
      path: '/usermanage',
      name: 'usermanage',
      component: usermanage
    },
    {
      path: '/login',
      name: 'login',
      component: login
    }]
});

new Vue({
  el: '#app',
  router,
  components: {App},
  render: h => h(App)
});

