// 设置接口地址
let api = 'https://plus.minapper.com/'

// 上传文件大小设置，默认 2M
const uploadSize = 2

import wm from './libs/wm'
export default {
  ...wm,
  api,
  uploadSize
}
