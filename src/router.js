/**
 * Created by superman on 17/2/16.
 */

import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store/store'
import * as types from './store/types'

import datasearch from './components/datasearch'
import overview from './components/overview'
import compare from './components/compare'
import datamanage from './components/datamanage'
import usermanage from './components/usermanage'
import login from './components/login'

Vue.use(VueRouter)



const routes = [
    {
      path: '/',
      redirect: overview
    },
    {
      path: '/overview',
      name: 'overview',
      meta: {
        requireAuth: true,
      },
      component: overview
    },
    {
      path: '/datasearch',
      name: 'datasearch',
      meta: {
        requireAuth: true,
      },
      component: datasearch
    },
    {
      path: '/compare',
      name: 'compare',
      meta: {
        requireAuth: true,
      },
      component: compare
    },
    {
      path: '/datamanage',
      name: 'datamanage',
      meta: {
        requireAuth: true,
      },
      component: datamanage
    },
    {
      path: '/usermanage',
      name: 'usermanage',
      component: usermanage,
      meta: {
        requireAuth: true,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: login
    }];


// 页面刷新时，重新赋值token
if (window.localStorage.getItem('token')) {
  store.commit(types.LOGIN, window.localStorage.getItem('token'))
}

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(r => r.meta.requireAuth)) {
    console.log(store.state.token)
    if (store.state.token) {
      next();
    }
    else {
      next({
        path: '/login',
        query: {redirect: to.fullPath}
      })
    }
  }
  else {
    next();
  }
})

export default router;
