// uni-app 网络请求封装
import $config from '@/config'
import storage from './storage'
import Tips from './tips'
import { clearLogin, login } from './user'

export default {
  // 配置
  config: {
    baseUrl: $config.api,
    header: {
      Source: $config.platform,
      Version: $config.version,
    },
    data: {},
    method: 'GET',
    timeout: 60000, // 超时 60s，默认 30s
  },

  // 获取通用 header
  getHeader() {
    return {
      ...this.config.header,
      Token: storage('token') || '',
    }
  },

  // 拦截器
  interceptor: {
    // 请求前拦截
    request: config => {
      // app上导航栏的loading动画会跑到页面中间去
      // #ifndef APP-PLUS
      uni.showNavigationBarLoading()
      // #endif
      config.header = {
        ...config.header,
        Token: storage('token') || '',
        clentkey: $config.appType,
      }
    },

    // 请求后拦截
    response: response => {
      // #ifndef APP-PLUS
      uni.hideNavigationBarLoading()
      // #endif
      const {
        statusCode,
        errMsg,
        failed,
        options = {},
        data = {},
      } = response
      // 请求出错
      if (failed) {
        Tips.loaded()
        Tips.toast(`请求失败：[${errMsg}|${statusCode}]`)
        return data
      }

      // 接口异常
      if (statusCode !== 200) {
        Tips.loaded()
        let errmsg = '网络开小差了'
        switch (statusCode) {
          case 403:
            errmsg = '当前操作没有权限'
            break
          case 404:
            errmsg = '请求的资源不见了'
            break
          case 500:
            errmsg = '服务器内部错误'
            break
          case 501:
            errmsg = '服务不支持请求'
            break
          case 502:
            errmsg = '网关错误'
            break
          case 503:
            errmsg = '服务器无法处理请求'
            break
          case 504:
            errmsg = '网络请求超时'
            break
        }
        Tips.toast(`网络异常：[${statusCode}|${errmsg}]`)
        return data
      }

      // 未登录转到登录页
      let nologin = data.code === 'xxx' || data.message === '请登录'
      if (nologin) {
        Tips.loaded()
        clearLogin()
        login()
      }

      return data
    },
  },

  request(options = {}) {
    return new Promise((resolve, reject) => {
      let baseUrl = this.config.baseUrl
      let url = options.url || ''
      let isFullUrl = /^https?:\/\//.test(url)
      if (options.header) {
        this.config.header = {
          ...this.config.header,
          ...options.header,
        }
        delete (options.header)
      }
      options = {
        ...this.config,
        ...options,
        url: isFullUrl ? url : baseUrl + url,
      }
      // 请求前拦截
      this.interceptor.request(options)

      // 请求成功
      options.success = res => {
        res = this.interceptor.response({ options, ...res })
        resolve(res)
      }

      // 请求失败
      options.fail = res => {
        res = this.interceptor.response({ failed: true, options, ...res })
        reject(res)
      }

      // 发送请求
      uni.request(options)
    }).catch(err => {
      uni.hideNavigationBarLoading()
      Tips.loaded()
      Tips.toast(`抱歉，加载出错[${err.message}]，请稍后重试`)
      return err // 返回错误对象
    })
  },

  get(url, data, options = {}) {
    if (data) data.apptype = $config.appType

    options.url = url
    options.data = data
    options.method = 'GET'
    return this.request(options)
  },

  post(url, data, options = {}) {
    if (data) data.apptype = $config.appType

    options.url = url
    options.data = data
    options.method = 'POST'
    return this.request(options)
  },

  put(url, data, options = {}) {
    options.url = url
    options.data = data
    options.method = 'PUT'
    return this.request(options)
  },

  delete(url, data, options = {}) {
    options.url = url
    options.data = data
    options.method = 'DELETE'
    return this.request(options)
  },
}
