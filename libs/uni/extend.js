// uni-app api 封装
import config from '/config'
import Tips from '../tips'
import http from '../http'
import { clearLogin, login } from '../user'

// 空函数
export function noop() {}

// 将 callback 形式的 API 转换成支持 Promise 的形式
export function promisify(api) {
  return (options, ...params) => {
    return new Promise((resolve, reject) => {
      api({ ...options, success: resolve, fail: reject }, ...params)
    })
  }
}

// 动态设置标题
export function setTitle(title) {
  if (!title) return
  uni.setNavigationBarTitle({ title })
}

// 重新启动至
export function relaunch(url = '/pages/home/home') {
  uni.reLaunch({ url })
}

// 获取页面实例数组
export function getPages() {
  return getCurrentPages()
}

// 获取当前页面
export function getPage() {
  const pages = getCurrentPages()
  return pages[pages.length - 1] || {}
}

// 获取当前页面路径
export function getPath() {
  const page = getPage()
  return page.route ? '/' + page.route : ''
}

// 获取上一页面实例
export function getPrevPage() {
  const pages = getCurrentPages()
  return pages[pages.length - 2] || {}
}

// 获取上一页面路径
export function getPrevPath() {
  const prevPage = getPrevPage()
  return prevPage.route ? '/' + prevPage.route : ''
}

// 是否有上一面
export function hasPrevPage() {
  return getCurrentPages().length > 1
}

// 刷新上一页面数据
export function refreshtPrevPage(data = {}) {
  // TODO: 测试发现 onLoad 执行后 computed 值还没更新，所以要延迟一下执行 NND
  const prevPage = getPrevPage()
  // const fn = prevPage[method] // 须前置获取方法：todo 还是会出现未定义
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        prevPage.onLoad && prevPage.onLoad(data)
        resolve(data)
      } catch (r) {
        console.warn('刷新上一页面数据出错：' + r)
        reject(r)
      }
    }, 500)
  })
}

// 执行上一页面方法
export function prevPageCall(method = 'onLoad', data = {}) {
  const prevPage = getPrevPage()
  if (typeof prevPage[method] === 'function') {
    prevPage[method](data)
  } else {
    console.warn('未找到上一面函数：' + method)
  }
}

// 获取当前路径参数
export function getQuery() {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  return currentPage.options
}

// 检测用户权限设置，name：要检测的权限值
export function checkWxSetting(name = 'scope.userLocation') {
  return new Promise((resolve, reject) => {
    uni.getSetting({
      success(res) {
        resolve(res.authSetting[name]) // 已授权值为 true
      },
      fail(res) {
        reject(res)
      },
    })
  })
}

// 获取授权
export function getAuth(scope = 'scope.userLocation') {
  return new Promise(resolve => {
    uni.authorize({
      scope,
      success(res) {
        res.status = 'ok'
        resolve(res)
      },
      fail(res) {
        res.status = 'fail'
        resolve(res)
      },
    })
  })
}

// 打开授权页面
export function openSetting(scope = 'scope.userLocation') {
  return new Promise(resolve => {
    uni.openSetting({
      success(res) {
        if (res.authSetting[scope]) {
          res.status = 'ok'
          resolve(res)
        } else {
          res.status = 'fail'
          resolve(res)
        }
      },
    })
  })
}

// 跳转到另一个小程序
export function navtoMp(opt) {
  uni.navigateToMiniProgram(opt)
}

// 新版更新提示
export function updateTips(content = '新版本已经发布啦，是否重启更新？') {
  const updateManager = uni.getUpdateManager()
  updateManager.onUpdateReady(() => {
    uni.showModal({
      title: '更新提示',
      content,
      success(res) {
        if (res.confirm) {
          updateManager.applyUpdate() // 调用 applyUpdate 应用新版本并重启
        }
      },
    })
  })
}

// 保存图片到相册
export function saveImgToAlbum(filePath) {
  return new Promise((resolve, reject) => {
    uni.saveImageToPhotosAlbum({
      filePath,
      success(res) {
        resolve(res)
      },
      fail(res) {
        console.warn('保存图片失败：', res.errMsg)
        reject(res)
      },
    })
  })
}

// 保存图片
export async function saveImg(tempFilePath) {
  const isAuth = await checkWxSetting('scope.userLocation')// 已授权
  if (isAuth) {
    return saveImgToAlbum(tempFilePath)
  } else {
    await getAuth('scope.writePhotosAlbum')
    return saveImgToAlbum(tempFilePath)
  }
}

// 简化图片预览接口
export function previewImg(urls, index = 0) {
  urls = Array.isArray(urls) ? urls : [urls]
  uni.previewImage({ current: urls[index], urls })
}

// 上传文件
export function upload(url, { data = {}, name = 'file', filePath }) {
  return new Promise((resolve, reject) => {
    let isFullUrl = /^https?:\/\//.test(url)
    uni.uploadFile({
      url: isFullUrl ? url : config.api + url,
      header: http.getHeader(),
      formData: data, // 添加通用参数
      name, // 文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
      filePath,
      success: res => {
        res = res.data ? JSON.parse(res.data) : {}
        resolve(res)
      },
      fail: res => {
        Tips.loaded()
        resolve(res)
      },
    })
  })
}

// 批量上传文件
export function uploadFiles({ url = 'fileUpload/uploadFile', name = 'image', filePaths }) {
  let uploadArr = filePaths.map(filePath => uploadPlus(url, { filePath })) // 组成 Promis 数组，准备进行并行上传
  return Promise.all(uploadArr)
}

// 获取图片：canvas 绘制图片不支持跨域图片
// 所以先使用 getImageInfo 将网络图片返回图片的本地路径
export const getImgInfo = promisify(uni.getImageInfo)

// 当前画布指定区域的内容导出生成指定大小的图片
export const canvasToTempFile = promisify(uni.canvasToTempFilePath)

// base64 转图片
export async function base64ToSrc(base64Data) {
  const fs = uni.getFileSystemManager() // 文件管理器
  const wxWriteFile = promisify(fs.writeFile)
  const name = 'tmp_base64' // 文件名
  const [, suffix = 'png', bodyData] = /^data:image\/(\w+);base64,(.*)/.exec(base64Data) || []
  const filePath = `${uni.env.USER_DATA_PATH}/${name + Date.now()}.${suffix}`
  await wxWriteFile({
    filePath,
    data: uni.base64ToArrayBuffer(bodyData),
    encoding: 'binary',
  })
  return filePath
}
