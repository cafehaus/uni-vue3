<template>
  <div class="view login">
    <image class="logo" src="/static/logo.png" mode="aspectFill" />
    <p class="btn-login" @click="onLogin">微信授权登录</p>
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

      onLogin() {
        this.checkAgreeGetUser()
      },

      checkAgreeGetUser() {
        if (this.code) {
          this.agreeGetUser().then(res => {
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
          uni.showToast({
            title: '登录失败',
            mask: false,
            duration: 1000
          })
        }
      },

      agreeGetUser() {
        return new Promise((resolve, reject) => {
          let args = {}
          let data = {}
          args.js_code = this.code
          uni.showLoading({
            title: "正在登录...",
            mask: true
          })
          uni.getUserProfile({
            lang: 'zh_CN',
            desc: '登录后信息展示',
            success: async(res) => {
              let userInfo = res.userInfo || {}

              userInfo.isLogin = true
              args.avatarUrl = userInfo.avatarUrl
              args.nickname = userInfo.nickName
              data.userInfo = userInfo
              // var url = Api.getOpenidUrl();
              const response = await this.$api.login(args)
              uni.hideLoading()
              console.log(response)
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

              //获取openid
              // postOpenidRequest.then(response => {
              //   if (response.status == '200') {
              //     data.openid = response.openid
              //     var userLevel = {}
              //     if (response.userLevel) {
              //       userLevel = response.userLevel
              //     } else {
              //       userLevel.level = '0'
              //       userLevel.levelName = '订阅者'
              //     }

              //     data.userLevel = userLevel
              //     data.errcode = ''
              //     data.userId = response.userId
              //     resolve(data)
              //     this.onLoginSuccess()
              //   } else {
              //     reject(response)
              //   }
              // }).catch(error => {
              //   console.log('error: ' + error)
              //   reject(error)
              // })
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

      // 获取微信登录code
      getWxCode() {
        uni.login({
          success: (r) => {
            if (r.code) {
              this.code = r.code
            }
          }
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
      width 300rpx
      height @width
      margin-top 100rpx
    .btn-login
      width 480rpx
      height 88rpx
      // background linear-gradient(90deg,rgba(255,170,77,1) 0%,rgba(255,40,75,1) 100%)
      background $base-color
      // box-shadow 0px 10px 30px 0px rgba(240,110,50,0.3)
      border-radius 49rpx
      margin 100rpx auto 0
      line-height 88rpx
      color #fff
      text-align center
    .btn-cancel
      width 480rpx
      height 88rpx
      border 1px solid $base-color
      border-radius 49rpx
      margin 40rpx auto 0
      color $base-color
      text-align center
      line-height 88rpx

</style>
