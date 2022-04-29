import Vue from 'vue'
import App from './App'
import store from './store'
import config from './config'
import filters from './filters'
import uni from './libs/uni'
// import http from './libs/http'
import storage from './libs/storage'
import * as user from './libs/user'
// import * as util from './libs/util'
import * as api from './common/api'
import Tips from './libs/tips'
import uView from 'uview-ui'

Vue.config.productionTip = false
Vue.prototype.$store = store // uni-app 中需要挂载 Vuex
Vue.prototype.$uni = uni
Vue.prototype.$wx = uni
Vue.prototype.$config = config
Vue.prototype.$assets = config.assets
// Vue.prototype.$http = http
Vue.prototype.$storage = storage
Vue.prototype.$api = api
// Vue.prototype.$util = util
Vue.prototype.$user = user
Vue.prototype.$tips = Tips
// Vue.prototype.$bus = new Vue()

Vue.use(uView) // 配置 UI 框架
filters(Vue) // 注册全局过滤器

App.mpType = 'app'

const app = new Vue({
  store,
  ...App,
})
app.$mount()
