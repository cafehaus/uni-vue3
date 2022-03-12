import App from './App'
import { createSSRApp } from 'vue'
import store from './store'

// 全局挂载
import config from './config'
import uni from './libs/uni'
import storage from './libs/storage'
import tips from './libs/tips'
import * as user from './libs/user'
import * as api from './common/api'

export function createApp() {
  const app = createSSRApp(App)
  app.config.globalProperties.$config = config
  app.config.globalProperties.$uni = uni
  app.config.globalProperties.$storage = storage
  app.config.globalProperties.$tips = tips
  app.config.globalProperties.$user = user
  app.config.globalProperties.$api = api

  app.use(store)
  return {
    app
  }
}
