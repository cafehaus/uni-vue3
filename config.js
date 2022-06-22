import { versionName } from './manifest'

// 环境变量和接口域名
let env = 'pro'
let api = 'https://plus.minapper.com/'

// switch (process.env.NODE_ENV) { // 开发环境
//   case 'development':
//     api = 'http://dev-www.xxx.com/api/'
//     env = 'dev'
//     break
// }
// 历史接口请求要的平台来源参数
export let appType = 'wx'

// 通过条件编译设置平台名称
export let platform = ''
// #ifdef APP-PLUS
platform = 'APP-PLUS'
// #endif
// #ifdef H5
platform = 'H5'
// #endif
// #ifdef MP-WEIXIN
platform = 'MP-WEIXIN'
// #endif
// #ifdef MP-ALIPAY
platform = 'MP-ALIPAY'
appType = 'alipay'
// #endif
// #ifdef MP-BAIDU
platform = 'MP-BAIDU'
appType = 'bd'
// #endif
// #ifdef MP-TOUTIAO
platform = 'MP-TOUTIAO'
appType = 'tt'
// #endif
// #ifdef MP-LARK
platform = 'MP-LARK'
// #endif
// #ifdef MP-QQ
platform = 'MP-QQ'
appType = 'qq'
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

// 接口通用请求参数
export const params = {
  version: versionName,
  platform,
}

export default {
  version: versionName,
  platform,
  appType,
  isProd: process.env.NODE_ENV === 'production',
  env,
  api,
  defaultImg: '/static/default.jpg', // 默认封面图
}
