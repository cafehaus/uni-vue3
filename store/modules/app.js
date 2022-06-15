import Tips from '/libs/tips'
import * as api from '/common/api'

export default {
  namespaced: true,
	state: {
    appInfo: {},
    systemInfo: {},
	},
	getters: {},
	mutations: {
		setAppInfo(state, data = {}) {
			state.appInfo = data
		},
		setSystemInfo(state, data = {}) {
			state.systemInfo = data
		}
	},
	actions: {
    async getAppInfo({ commit }) {
      const res = await api.getAppInfo()
      if (res.code === '0' && res.msg === '请求成功') {
        let data = res.data || {}
        let appInfo = data.appInfo || {}
        let wxInfo = data.weixinInfo || {}
        let bdInfo = data.bdInfo || {}
  
        let info = {
          appName: appInfo.name,
          logo: appInfo.logo,
          downloadUrl: data.downloadfiledomain,
          qrCode: wxInfo.wx_praiseQrCode,
          isCompany: wxInfo.wx_enterprise_minapp === '1',
          bdInfo,
        }
        commit('setAppInfo', info)
      } else {
        Tips.toast(res.msg || '出错啦')
      }
    },

    getSystemInfo({ commit }) {
      uni.getSystemInfo({
        success: res => {
          console.log(res)
          commit('setSystemInfo', res)
        }
      })
    },
  }
}
