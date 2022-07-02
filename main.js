import App from './App'
import store from './store'

// 全局挂载
import config from './config'
import uni from './libs/uni'
import storage from './libs/storage'
import tips from './libs/tips'
import util from './libs/util'
import * as user from './libs/user'
import * as api from './common/api'

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  app.config.globalProperties.$config = config
  app.config.globalProperties.$uni = uni
  app.config.globalProperties.$storage = storage
  app.config.globalProperties.$tips = tips
  app.config.globalProperties.$user = user
  app.config.globalProperties.$api = api
  app.config.globalProperties.$util = util

  app.use(store)
  return {
    app
  }
}
// #endif

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
// Vue.prototype.$store = store
Vue.prototype.$config = config
Vue.prototype.$uni = uni
Vue.prototype.$storage = storage
Vue.prototype.$tips = tips
Vue.prototype.$user = user
Vue.prototype.$api = api
Vue.prototype.$util = util

App.mpType = 'app'
const app = new Vue({
  store,
  ...App
})
app.$mount()
// #endif
