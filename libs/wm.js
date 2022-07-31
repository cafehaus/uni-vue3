import { versionName } from '../manifest'
let env = 'pro'
switch (process.env.NODE_ENV) {
  case 'development':
    env = 'dev'
    break
  case 'production':
    env = 'pro'
    break
}

// 历史接口请求要的平台来源参数
export let appType = 'wx'

// 判断来源平台
export let isWX = false
export let isQQ = false
export let isBD = false
export let isTT = false
export let isAL = false
export let isH5 = false
export let isAPP = false

// 通过条件编译设置平台名称
export let platform = ''
// #ifdef APP-PLUS
platform = 'APP-PLUS'
isAPP = true
// #endif
// #ifdef H5
platform = 'H5'
isH5 = true
// #endif
// #ifdef MP-WEIXIN
platform = 'MP-WEIXIN'
isWX = true
// #endif
// #ifdef MP-ALIPAY
platform = 'MP-ALIPAY'
appType = 'alipay'
isAL = true
// #endif
// #ifdef MP-BAIDU
platform = 'MP-BAIDU'
appType = 'bd'
isBD = true
// #endif
// #ifdef MP-TOUTIAO
platform = 'MP-TOUTIAO'
appType = 'tt'
isTT = true
// #endif
// #ifdef MP-LARK
platform = 'MP-LARK'
// #endif
// #ifdef MP-QQ
platform = 'MP-QQ'
appType = 'qq'
isQQ = true
// #endif
// #ifdef MP-KUAISHOU
platform = 'MP-KUAISHOU'
// #endif
// #ifdef MP-JD
platform = 'MP-JD'
// #endif
// #ifdef MP-360
platform = 'MP-360'
// #endif

export default {
  platform,
  appType,
  isH5,
  isAPP,
  isWX,
  isQQ,
  isBD,
  isTT,
  isAL,
  version: versionName,
  isProd: process.env.NODE_ENV === 'production',
  env,
  defaultImg: '/static/default.jpg',
}
