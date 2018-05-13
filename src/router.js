/**
 * Created by superman on 17/2/16.
 */

import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store/store'
import * as types from './store/types'

import datasearch from './views/datasearch'
import overview from './views/overview'
import compare from './views/compare'
import datamanage from './views/datamanage'
import usermanage from './views/usermanage'
import login from './views/login'
import police from './views/police'

Vue.use(VueRouter)


const routes = [
  {
    path: '/',
    redirect: datasearch
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
    path: '/police',
    name: 'police',
    component: police,
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
  // let data = window.localStorage.getItem('user')
  // console.log(data)
  // if (typeof data === 'string') {
  //   store.commit(types.USER, JSON.parse(data))
  // }
  store.commit(types.LOGIN, window.localStorage.getItem('token'))
}

if (window.localStorage.getItem('user')) {
  let userData = JSON.parse(window.localStorage.getItem('user'))
  store.commit(types.USER, userData)
}

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(r => r.meta.requireAuth)) {
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
