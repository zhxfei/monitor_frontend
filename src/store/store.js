/**
 * Created by superman on 17/2/16.
 */
import Vuex from 'vuex'
import Vue from 'vue'
import * as types from './types'
import axios from 'axios'
import conf from '../config'

Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    user: {},
    token: null,
    usersTable: [],
    hostsTable: [],
    strategyAll: [],
    alerterAll: [],
  },
  mutations: {
    [types.LOGIN]: (state, data) => {
      localStorage.token = data;
      state.token = data;
      axios.get("http://" + conf.apiHost  + "/monitor/v1/current_user", {
        headers: {"Authorization": `token ${state.token}`}
      })
        .then((res) => {
          state.user = res.data
          localStorage.user = JSON.stringify(res.data)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    [types.LOGOUT]: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.token = null
      state.user = {}
    },
    [types.USER]: (state, data) => {
      state.user = data
    },
    [types.USERS]: (state) => {
      axios
        .get("http://" + conf.apiHost  + "/monitor/v1/users", {
          headers: {"Authorization": `token ${state.token}`}
        })
        .then((res) => {
          state.usersTable = res.data
        })
        .catch((err) => {
          console.log(err)
        })
    },
    [types.STRATEGY]: (state) => {
      axios
        .get("http://" + conf.apiHost  + "/monitor/v1/strategies", {
          headers: {"Authorization": `token ${state.token}`}
        })
        .then((res) => {
          state.strategyAll = res.data
        })
        .catch((err) => {
          console.log(err)
        })
    },
    [types.ALERTER]: (state) => {
      axios
        .get("http://" + conf.apiHost  + "/monitor/v1/alerts", {
          headers: {"Authorization": `token ${state.token}`}
        })
        .then((res) => {
          state.alerterAll = res.data
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
})
