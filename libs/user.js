import storage from './storage'
import store from '@/store'

// 用户是否登录
export function isLogin() {
  return !!storage('openid')
}

// 转到登录页
export function login(redirect = '', type = 'redirectTo') {
  let pages = getCurrentPages()
  let route = pages[pages.length - 1].route
  if (route !== 'pages/login/login') {
    uni[type]({
      url: `/pages/login/login?redirect=${redirect}`,
    })
  }
}

// 设置登录态
export function setLogin({ token, expires = 7 }) {
  storage('openid', token)
  store.commit('user/upLoginState')
}

// 清除登录态
export function clearLogin() {
  storage('openid', '')
  store.commit('user/upLoginState')
}

// 退出登录
export function logout(callback = () => {}) {
  clearLogin()
  callback()
}
