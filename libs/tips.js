// 提示与加载工具类
export default class Tips {
  // 通用提示
  static toast(title, icon = 'none', duration = 2000) {
    if (!title) return

    // 根据参数类型取参
    if (typeof icon === 'number') {
      duration = icon
      icon = 'none'
    }

    setTimeout(() => {
      uni.showToast({
        title,
        icon,
        mask: true,
        duration,
      })
    }, 300)

    // 窗口关闭后回调
    if (duration > 0) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, duration)
      })
    }
  }

  // 成功提示
  static success(title, duration = 1000) {
    if (!title) return
    setTimeout(() => {
      uni.showToast({
        title,
        icon: 'success',
        mask: true,
        duration,
      })
    }, 300)

    // 窗口关闭后回调
    if (duration > 0) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, duration)
      })
    }
  }

  // 加载中提示
  static loading(title = '加载中') {
    if (Tips.isLoading) {
      return
    }
    Tips.isLoading = true

    uni.showLoading({
      title,
      // #ifndef MP-ALIPAY
      mask: true,
      // #endif
    })
  }

  // 加载完毕，隐藏提示
  static loaded() {
    if (Tips.isLoading) {
      Tips.isLoading = false
      uni.hideLoading()
    }
  }

  // 提示窗口
  static alert(content, {
    title = '提示',
    confirmText = '确定',
    confirmColor = '#333',
    cancelText = '取消',
    cancelColor = '#999',
    confirm = () => { }
  } = {}) {
    return new Promise(resolve => {
      uni.showModal({
        title,
        content,
        showCancel: !!cancelText,
        confirmText,
        confirmColor,
        cancelText,
        cancelColor,
        success: res => {
          // res.confirm 为 true: 点击了确定按钮；res.cancel 为 false: 点击了取消按钮；
          done(res.confirm)
          resolve(res.confirm)
        },
        fail: res => {
          reject(res)
        },
      })
    })
  }

  // 确认窗口
  static confirm({
    title = '',
    content = '',
    showCancel = true,
    confirmText = '确定',
    confirmColor = '#333',
    cancelText = '取消',
    cancelColor = '#999',
    ok = () => {},
    cancel = () => {},
  } = {}) {
    return new Promise((resolve, reject) => {
      uni.showModal({
        title,
        content,
        showCancel,
        cancelColor,
        cancelText,
        confirmColor,
        confirmText,
        success: res => {
          // res.confirm 为 true: 点击了确定按钮；为 false: 点击了取消按钮；
          if (res.confirm) {
            ok()
          } else {
            cancel()
          }
          resolve(res)
        },
        fail: err => {
          reject(err)
        },
      })
    })
  }

  // 清除/关闭提示容器
  static hideToast() {
    uni.hideToast()
  }
}

// 静态变量，是否加载中
Tips.isLoading = false
