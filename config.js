// 设置接口地址
let api = 'https://plus.minapper.com/'

// ================================================
import { versionName } from './manifest'
import wm from './libs/platform'
let env = 'pro'
switch (process.env.NODE_ENV) {
  case 'development':
    env = 'dev'
    break
  case 'production':
    env = 'pro'
    break
}
export default {
  ...wm,
  version: versionName,
  isProd: process.env.NODE_ENV === 'production',
  env,
  api,
  defaultImg: '/static/default.jpg',
}
