// 设置接口地址
let api = 'https://blog.minapper.com/'

// 上传文件大小设置，默认 2M
const uploadSize = 2

// 付费插件：扫码登录插件-scan-login 视频号插件-video-channels
const plugins = ['scan-login', 'video-channels']

import wm from './libs/wm'
export default {
  ...wm,
  api,
  uploadSize,
  plugins
}
