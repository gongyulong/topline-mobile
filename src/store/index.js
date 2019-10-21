import Vue from 'vue'
import Vuex from 'vuex'
import { setUserLocal, getUserLocal } from '@/utils/userlocal.js'

Vue.use(Vuex)

export default new Vuex.Store({
  // 统一管理项目中的共用数据
  state: {
    user: getUserLocal()
  },
  // 修改 state 中的数据
  mutations: {
    setUser: function (state, user) {
      // 赋值给 state 中的 user
      state.user = user
      // 存储到 localstorage 中
      setUserLocal(user)
    }
  }
})
