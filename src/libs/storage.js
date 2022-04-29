// 数据存储（注意此方式存储经过了 JSON 解析，会还原原数据类型）
export function storage(key, data, expires = null) {
  if (typeof data === 'undefined') { // 读取
    try {
      return JSON.parse(uni.getStorageSync(key))
    } catch (e) {
      return uni.getStorageSync(key)
    }
  } else if (data === null || data === '') { // 删除
    return uni.removeStorageSync(key)
  } else { // 写入
    try {
      return uni.setStorageSync(key, JSON.stringify(data))
    } catch (e) {
      console.warn(`数据存储失败：${e}`)
    }
  }
}

export function removeStorage(key) {
  return uni.removeStorageSync(key)
}

export function clsearStorage() {
  return uni.clearStorageSync()
}

export default storage
