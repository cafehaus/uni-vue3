import storage from './storage'
import store from '@/store'

// 用户是否登录
export function isLogin() {
  return !!storage('openId')
}

// 转到登录页
export function login(type = 'redirectTo', redirect = '') {
  let pages = getCurrentPages()
  let route = pages[pages.length - 1].route
  if (route !== 'pages/login/login') {
    uni[type]({
      url: `/pages/login/login?redirect=${redirect}`,
    })
  }
}

// 设置登录态
export function setLogin({ openId, expires = 7 }) {
  storage('openId', openId)
  store.commit('user/upLoginState')
}

// 清除登录态
export function clearLogin() {
  storage('openId', '')
  storage('userInfo', '')
  store.commit('user/upLoginState')
}

// 退出登录
export function logout(callback = () => {}) {
  clearLogin()
  callback()
}
