import Tips from '/libs/tips'
import * as api from '/common/api'
import { isLogin } from '/libs/user'
import storage from '/libs/storage'

export default {
  namespaced: true,
	state: {
    islogin: isLogin(),
		userInfo: {}
	},
	getters: {},
	mutations: {
    upLoginState(state) {
      state.islogin = isLogin()
      state.userInfo = storage('userInfo')
    },
		setUserInfo(state, data = {}){ // 更新用户信息
			state.userInfo = data
		}
	},
	actions: {
    async getUserInfo({ state, commit }) {
      const res = await api.getUserInfo()
      if (!res.success) {
        Tips.toast(res.message)
        return
      }

      // 格式化数据
      let data = res.data || {}
      commit('setUserInfo', data)
    },
  }
}
