/**
 * Created by superman on 17/2/16.
 */
import Vuex from 'vuex'
import Vue from 'vue'
import * as types from './types'
import axios from 'axios'

Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    user: {},
    token: null,
  },
  mutations: {
    [types.LOGIN]: (state, data) => {
      localStorage.token = data;
      state.token = data;
      axios.get('http://localhost:11111/monitor/v1/current_user')
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
    }
  }
})
