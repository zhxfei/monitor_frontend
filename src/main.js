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

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(VRouter);

Vue.prototype.$bus = new Vue();
Vue.prototype.$bus1 = new Vue();

let router = new VRouter({
  mode: 'history',
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
  ]
})

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  render: h => h(App)
})

