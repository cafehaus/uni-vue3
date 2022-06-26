<template>
  <div class="view login">
    <image class="logo" src="/static/logo.png" mode="aspectFit" />
    <!-- #ifdef MP-WEIXIN -->
    <p class="btn-login" @click="onLogin">授权登录</p>
    <!-- #endif -->
    <!-- #ifdef MP-BAIDU || MP-QQ || MP-TOUTIAO || MP-ALIPAY -->
    <button class="btn-login" open-type="getUserInfo" @getuserinfo="onLogin">授权登录</button>
    <!-- #endif -->
    <p class="btn-cancel" @click="goBack">暂不登录</p>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        code: '',
        userInfo: {},
        redirect: '',
      }
    },

    onLoad(e) {
      this.redirect = e.redirect
      this.initData()
    },

    methods: {
      initData() {
        this.getWxCode()
      },

      // 获取微信登录code
      getWxCode() {
        // #ifdef MP-WEIXIN || MP-QQ || MP-TOUTIAO || MP-ALIPAY
        uni.login({
          success: (r) => {
            if (r.code) {
              this.code = r.code
            }
          }
        })
        // #endif

        // #ifdef MP-BAIDU
        if(swan.canIUse('getLoginCode')){
          swan.getLoginCode({
            success: resCode => {
              if(resCode.errCode=='10004') {
                this.$tips.toast('用户没有登录百度app', 'error')
                return
              }
              this.code = resCode.code
            }
          })
        } else {
          //在低版本基础库中'swan.getLoginCode'不可用
          console.log('"swan.getLoginCode"不可用,请升级基础库版本')
        }
        // #endif
      },

      async onLogin(e) {
        // #ifdef MP-WEIXIN
        if (this.code) {
          this._wxLogin().then(res => {
            if (res.errcode == '') {
              uni.setStorageSync('userInfo', res.userInfo)
              uni.setStorageSync('openid', res.openid)
              uni.setStorageSync('userLevel', res.userLevel)
              uni.setStorageSync('userId', res.userId)
            } else {
              console.log('用户拒绝了授权')
            }
          })
        } else {
          this.$tips.toast('登录失败', 'error')
        }
        // #endif

        // #ifdef MP-BAIDU || MP-QQ || MP-TOUTIAO || MP-ALIPAY
        if (this.code) {
          let args = {}
          let data = {}
          args.js_code = this.code
          uni.showLoading({
            title: '正在登录...',
            mask: true
          })

          let detail = e.detail || {}
          let userInfo = detail.userInfo || {}

          userInfo.isLogin = true
          args.avatarUrl = userInfo.avatarUrl
          args.nickname = userInfo.nickName
          data.userInfo = userInfo

          // #ifdef MP-BAIDU
          args.iv = detail.iv
          args.encryptedData = detail.encryptedData
          // #endif

          let apiName = 'login'
          if (this.$config.isQQ) {
            apiName = 'loginQQ'
          }
          if (this.$config.isBD) {
            apiName = 'loginBD'
          }
          if (this.$config.isTT) {
            apiName = 'loginTT'
          }
          const response = await this.$api[apiName](args)
          uni.hideLoading()

          if (response.status == '200') {
            data.openid = response.openid
            let userLevel = {}
            if (response.userLevel) {
              userLevel = response.userLevel
            } else {
              userLevel.level = '0'
              userLevel.levelName = '订阅者'
            }

            data.userLevel = userLevel
            data.levelName = userLevel.levelName
            data.errcode = ''
            data.userId = response.userId

            userInfo.userLevel = userLevel
            userInfo.levelName = userLevel.levelName
            userInfo.userId = response.userId
            this.$storage('userInfo', userInfo)
            this.onLoginSuccess(data)
          }
        }
        // #endif
      },

      checkAgreeGetUser() {
        // #ifdef MP-WEIXIN || MP-QQ || MP-TOUTIAO || MP-ALIPAY
        if (this.code) {
          this._wxLogin().then(res => {
            if (res.errcode == '') {
              uni.setStorageSync('userInfo', res.userInfo)
              uni.setStorageSync('openid', res.openid)
              uni.setStorageSync('userLevel', res.userLevel)
              uni.setStorageSync('userId', res.userId)
            } else {
              console.log('用户拒绝了授权')
            }
          })
        } else {
          this.$tips.toast('登录失败', 'error')
        }
        // #endif

        // #ifdef MP-BAIDU
        this.bdLogin()
        // #endif
      },

      bdLogin() {
        if(swan.canIUse('getLoginCode')){
          swan.getLoginCode({
            success: resCode => {
              if(resCode.errCode=='10004') {
                this.$tips.toast('用户没有登录百度app', 'error')
                return
              }
              this.code = resCode.code
              if (this.code) {
                this._wxLogin().then(res => {
                  if (res.errcode == '') {
                    uni.setStorageSync('userInfo', res.userInfo)
                    uni.setStorageSync('openid', res.openid)
                    uni.setStorageSync('userLevel', res.userLevel)
                    uni.setStorageSync('userId', res.userId)
                  } else {
                    console.log('用户拒绝了授权')
                  }
                })
              } else {
                this.$tips.toast('登录失败', 'error')
              }
            }
          })
        } else {
          //在低版本基础库中'swan.getLoginCode'不可用
          console.log('"swan.getLoginCode"不可用,请升级基础库版本')
        }
      },

      _wxLogin() {
        return new Promise((resolve, reject) => {
          let args = {}
          let data = {}
          args.js_code = this.code
          uni.showLoading({
            title: '正在登录...',
            mask: true
          })
          let func = this.$config.isWX ? 'getUserProfile' : 'getUserInfo'
          uni[func]({
            lang: 'zh_CN',
            desc: '登录后信息展示',
            success: async(res) => {
              let userInfo = res.userInfo || {}

              userInfo.isLogin = true
              args.avatarUrl = userInfo.avatarUrl
              args.nickname = userInfo.nickName
              data.userInfo = userInfo

              const response = await this.$api.login(args)
              uni.hideLoading()

              if (response.status == '200') {
                data.openid = response.openid
                var userLevel = {}
                if (response.userLevel) {
                  userLevel = response.userLevel
                } else {
                  userLevel.level = '0'
                  userLevel.levelName = '订阅者'
                }

                data.userLevel = userLevel
                data.levelName = userLevel.levelName
                data.errcode = ''
                data.userId = response.userId

                userInfo.userLevel = userLevel
                userInfo.levelName = userLevel.levelName
                userInfo.userId = response.userId
                this.$storage('userInfo', userInfo)
                this.onLoginSuccess(data)

                resolve(data)
              } else {
                reject(response)
              }
            },
            fail: err => {
              uni.hideLoading()
              if (err.errMsg == 'getUserProfile:fail auth deny') {
                args.errcode = 'getUserProfile:fail auth deny'
                args.userInfo = {
                  isLogin: false
                }
                args.userSession = ''
                resolve(args)
              }
            }
          })
        })
      },

      async getUserInfo() {
        uni.getUserInfo({
          success: async (res) => {
            this.$storage('userInfo', res.userInfo)

            // 微信登录
            if (this.code) {
              // 获取登录信息
              this.$tips.loading()
              const resLogin = await this.$api.login({
                js_code: this.code,
                iv: res.iv,
                encryptedData: res.encryptedData,
                userInfo: res.userInfo
              })
              this.$tips.loaded()

              // 登录失败
              if (resLogin.code === 'error') {
                this.$tips.toast(resLogin.message)
                return
              }

              this.onLoginSuccess(resLogin.raw_session)
            }
          }
        })

      },

      // 登录成功后
      onLoginSuccess({
        openid: openId
      }) {
        // const query = this.$Route.query
        // const redirect = query.redirect

        this.$tips.success('登录成功')
        this.$user.setLogin({
          openId
        })

        if (this.redirect) {
          uni.redirectTo({
            url: decodeURIComponent(this.redirect)
          })
        } else if (this.$uni.hasPrevPage()) {
          this.$uni.refreshtPrevPage()
          uni.navigateBack()
        } else {
          this.$uni.relaunch(query.relaunch || '/pages/home/home')
        }
      },

      // 返回
      goBack() {
        uni.navigateBack()
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../styles/var'

  .login
    background #fff
    text-align center
    .logo
      width 200rpx
      // height 218rpx
      margin-top 60rpx
    .btn-login
      width 480rpx
      height 88rpx
      background $base-color
      margin 200rpx auto 0
      line-height 88rpx
      color #fff
      text-align center
      display flex
      justify-content center
      align-items center
      &::after
        border none
    .btn-cancel
      width 480rpx
      height 80rpx
      border 1px solid $base-color
      // border-radius 49rpx
      margin 40rpx auto 0
      color $base-color
      text-align center
      line-height 80rpx

</style>
