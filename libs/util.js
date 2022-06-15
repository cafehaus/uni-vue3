
// 时间格式化
// format(new Date(), 'yyyy-M-d h:m:s.S')      => 2006-7-2 8:9:4.18
// format(new Date(), 'yyyy-MM-dd hh:mm:ss.S') => 2006-07-02 08:09:04.423
// format(new Date(), 'yyyy-MM-dd hh:mm:ss')   => 2006-07-02 08:09:04
export function fmtDate(date = new Date(), fmt = 'yyyy-MM-dd') {
  if (!date) return date
  // if (typeof date === 'string') date = fixDate(date)
  const time = new Date(date)
  if (!isDate(time)) return date
  let o = {
    'M+': time.getMonth() + 1, // 月
    'd+': time.getDate(), // 日
    'h+': time.getHours(), // 小时
    'm+': time.getMinutes(), // 分
    's+': time.getSeconds(), // 秒
    'q+': Math.floor((time.getMonth() + 3) / 3), // 季度
    S: time.getMilliseconds(), // 毫秒
  }

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  console.log(fmt)

  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }

  return fmt
}

// 格式化时间为苹果系统可兼容的格式
// 日期时间不能是这种格式的 2022-03-04T15:34:06
export function fixDate(date) {
  if (typeof date === 'string') {
    return date.replace(/-/g, '/').replace(/(\+\d{2})(\d{2})$/, '$1:$2')
  }
  return date
}

export function isDate(v) {
  return Object.prototype.toString.call(v) === '[object Date]'
}

export function goto(v) {
  let { type, appid, url, path } = v

  if (type === 'apppage' && path) { // 小程序页面
    // 兼容老版本的跳转路径
    path = path.replace('/pages/detail/detail', '/pages/common/detail')
    path = path.replace('/pages/postags/postags', '/pages/common/tags')
    path = path.replace('/pages/list/list?categoryID=', '/pages/common/list?id=')

    uni.navigateTo({
      url: path
    })
  }
  if (type === 'webpage' && url) { // web-view页面
    url = '/pages/common/web?url=' + url
    uni.navigateTo({
      url
    })
  }
  // #ifdef MP
  if (type === 'miniapp' && appid) { // 其他小程序
    uni.navigateToMiniProgram({
      appId: appid,
      path
    })
  }
  // #endif
}

export default {
  fmtDate,
  goto
}
