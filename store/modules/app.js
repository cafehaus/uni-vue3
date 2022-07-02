import Tips from '@/libs/tips'
import config from '@/config'
import * as api from '@/common/api'

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
          commit('setSystemInfo', res)
        }
      })
    },

    // 获取插屏广告
    async getCpAd(context, pagetype) {
      // #ifdef MP-WEIXIN || MP-QQ
      let key = config.appType || 'wx'
      const res = await api.getInterstitialAd()
      let enableAd = false

      switch(pagetype) {
        case 'list':
          enableAd = res[`enable_${key}_list_interstitial_ad`] === '1'
          break;
        case 'home':
          enableAd = res[`enable_${key}_index_interstitial_ad`] === '1'
          break;
        case 'detail':
          enableAd = res[`enable_${key}_detail_interstitial_ad`] === '1'
          break;
        case 'cate':
          enableAd = res[`enable_${key}_topic_interstitial_ad`] === '1'
          break;
        case 'list':
          enableAd = res[`enable_${key}_list_interstitial_ad`] === '1'
          break;
        case 'hot':
          enableAd = res[`enable_${key}_hot_interstitial_ad`] === '1'
          break;
        case 'comment':
          enableAd = res[`enable_${key}_comments_interstitial_ad`] === '1'
          break;
        case 'live':
          enableAd = res[`enable_${key}_live_interstitial_ad`] === '1'
          break;
      }

      if(enableAd) {
        if (res.status !== '200') return
        let interstitialAd = wx.createInterstitialAd({
          adUnitId: res[`${key}_interstitial_ad_id`]
        })
        // 监听插屏错误事件
        interstitialAd.onError((err) => {
          console.error(err)
        })
        // 显示广告
        if (interstitialAd) {
          interstitialAd.show().catch((err) => {
            console.error(err)
          })
        }
      }
      // #endif
    }
  }
}
