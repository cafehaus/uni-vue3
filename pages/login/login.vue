<template>
  <div class="view login">
    <image class="logo" src="/static/logo.png" mode="aspectFit" />
    <!-- #ifdef MP-WEIXIN || MP-TOUTIAO -->
    <!-- <button v-if="systemInfo.isCompany" class="btn-login" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">授权手机号快捷登录</button> -->
    <p class="btn-login" @click="onLogin">授权登录</p>
    <!-- #endif -->
    <!-- #ifdef MP-BAIDU || MP-QQ || MP-KUAISHOU  -->
    <button class="btn-login" open-type="getUserInfo" @getuserinfo="onLogin">授权登录</button>
    <!-- #endif -->
    <!-- #ifdef MP-ALIPAY -->
    <button class="btn-login" open-type="getAuthorize" @getAuthorize="onLogin" scope="userInfo">授权登录</button>
    <!-- #endif -->

    <!-- #ifdef APP-PLUS  -->
    <p class="btn-login" @click="handleAppLogin">微信小程序授权登录</p>
    <!-- #endif -->

    <!-- #ifndef MP  -->
    <p class="btn-user" @click="goto('login-password')">密码登录</p>
    <!-- #endif -->

    <!-- #ifdef MP  -->
    <p class="btn-box btn-box-center">
      <span class="btn-cancel" @click="goto('back')">暂不登录</span>
    </p>
    <!-- #endif -->
    <!-- #ifndef MP  -->
    <p class="btn-box">
      <span class="btn-register" @click="goto('register')">立即注册</span>
      <span class="btn-cancel" @click="goto('back')">暂不登录</span>
    </p>
    <!-- #endif -->

    <!--  <footer class="footer">
      登录即代表同意：
      <span @click="goto('user')">用户协议</span>、
      <span @click="goto('privacy')">隐私协议</span>
    </footer> -->
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    data() {
      return {
        code: '',
        userInfo: {},
        redirect: '',
      }
    },

    computed: {
      ...mapState('app', ['appInfo', 'systemInfo'])
    },

    onLoad(e) {
      this.redirect = e.redirect || ''
      this.initData()
    },

    onShow()  {
      this.setAppLogin()
    },

    onHide() {
      // #ifdef APP-PLUS
      plus.runtime.arguments = null
      plus.runtime.arguments = '' 
      // #endif
    },

    methods: {
      initData() {
        this.getLoginCode()
      },

      async getPhoneNumber(e) {
        // this.getOpenId()
        const code = e.detail.code
        const res = await this.$api.wxPhoneLogin({
          code
        })
        if (res.success && code) {
          let user = res.user || {}
          let userLevel = user.userLevel || {}
          let userInfo = user

          userInfo.userLevel =  userLevel.level || '0'
          userInfo.levelName = userLevel.levelName || '订阅者'
          userInfo.userId = user.userid
          this.setUserInfo(userInfo)
          this.onLoginSuccess({
            openid: user.userid
          })
        } else {
          this.$tips.toast(res.message || '出错了，请稍后再试')
        }
      },

      async getOpenId() {
        const res = await this.$api.getOpenId({
          js_code: this.code
        })
        console.log(res)
      },

      // 获取登录code
      getLoginCode() {
        // #ifdef MP-WEIXIN || MP-QQ || MP-TOUTIAO || MP-ALIPAY || MP-KUAISHOU
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
        console.log(e)
        // #ifdef MP-WEIXIN || MP-TOUTIAO
        if (this.code) {
          this._wxLogin()
        } else {
          this.$tips.toast('登录失败', 'error')
        }
        // #endif

        // #ifdef MP-BAIDU || MP-QQ || MP-KUAISHOU
        if (this.code) {
          let args = {}
          let data = {}
          args.js_code = this.code

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
          if (this.$config.isKS) {
            apiName = 'loginKS'
          }

          this.$tips.loading('正在登录...')
          const response = await this.$api[apiName](args)
          this.$tips.loaded()

          if (response.status == '200') {
            // data.openid = response.openid
            // let userLevel = {}
            // if (response.userLevel) {
            //   userLevel = response.userLevel
            // } else {
            //   userLevel.level = '0'
            //   userLevel.levelName = '订阅者'
            // }

            // data.userLevel = userLevel
            // data.levelName = userLevel.levelName
            // data.errcode = ''
            // data.userId = response.userId

            // userInfo.userLevel = userLevel
            // userInfo.levelName = userLevel.levelName
            // userInfo.userId = response.userId
            // this.$storage('userInfo', userInfo)
            // this.onLoginSuccess(data)
            let user = response.userInfo || {}
            let userLevel = user.userlevel || { level: '0', levelName: '订阅者' }
            user.userLevel = userLevel
            user.levelName = userLevel.levelName

            this.$storage('userInfo', user)
            this.onLoginSuccess(user)
          }
        }
        // #endif

        // #ifdef MP-ALIPAY
        my.getOpenUserInfo({
          success: user => {
            let res = JSON.parse(user.response)
            let userInfo = res.response
            this.alLogin(userInfo)
          }
        })
        // #endif
      },

      alLogin(userInfo){
        my.getAuthCode({
          scopes: 'auth_base', // 主动授权（弹框）：auth_user，静默授权（不弹框）：auth_base
          success: async (resAuth) => {
            if (resAuth.authCode) {
              let data = {}
              data.userInfo = userInfo
              let args = {}
              args.authCode = resAuth.authCode
              args.nickName = userInfo.nickName || '支付宝企业用户'
              args.nickname = args.nickName
              args.avatarUrl = userInfo.avatar

              this.$tips.loading('正在登录...')
              const res = await this.$api.loginAL(args)
              this.$tips.loaded()
              if (res.status === '200') {
                // data.openid = res.alipayUserid
                // var userLevel = {}
                // if (res.userLevel) {
                //   userLevel = res.userLevel
                // } else {
                //   userLevel.level = '0'
                //   userLevel.levelName = '订阅者'
                // }

                // data.userLevel = userLevel
                // data.levelName = userLevel.levelName
                // data.errcode = ''
                // data.userId = res.userId

                // userInfo.userLevel = userLevel
                // userInfo.levelName = userLevel.levelName
                // userInfo.userId = res.userId
                // this.$storage('userInfo', userInfo)
                // this.onLoginSuccess(data)
                let user = res.userInfo || {}
                let userLevel = user.userlevel || { level: '0', levelName: '订阅者' }
                user.userLevel = userLevel
                user.levelName = userLevel.levelName

                this.$storage('userInfo', user)
                this.onLoginSuccess(user)
              } else {
                this.$tips.toast('登录失败', 'error')
              }
            }
          }
        })
      },

      setUserInfo(userInfo) {
        this.$storage('userInfo', userInfo)
      },

      _wxLogin() {
        let args = {}
        let data = {}
        args.js_code = this.code
        uni['getUserProfile']({
          // #ifdef MP-WEIXIN
          lang: 'zh_CN',
          // #endif
          desc: '登录后信息展示',
          success: async(res) => {
            console.log(res)
            let userInfo = res.userInfo || {}

            userInfo.isLogin = true
            args.avatarUrl = userInfo.avatarUrl
            args.nickname = userInfo.nickName
            data.userInfo = userInfo

            this.$tips.loading('正在登录...')
            let apiName = this.$config.isWX ? 'login' : 'loginTT'
            const response = await this.$api[apiName](args)
            this.$tips.loaded()

            if (response.status == '200') {
              let user = response.userInfo || {}
              let userLevel = user.userLevel
              user.userLevel = userLevel.level
              user.levelName = userLevel.levelName
              this.$storage('userInfo', user)
              this.onLoginSuccess(user)
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
      },

      // 登录成功后
      onLoginSuccess({
        openid: openId,
        session
      }) {
        // const query = this.$Route.query
        // const redirect = query.redirect

        this.$tips.success('登录成功')
        this.$user.setLogin({
          openId,
          token: session
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

      goto(e) {
        // 返回
        if (e === 'back') {
          uni.navigateBack()
          return
        }
        let redirect = this.redirect
        if (!this.redirect && this.$uni.hasPrevPage()) {
          redirect = this.$uni.getPrevPath() || ''
        }

        let path = ''
        if (e === 'register') { // 注册
          path = `/pages/login/register?redirect=${redirect}`
        }
        if (e === 'login-password') { // 密码登录
          path = `/pages/login/login-password?redirect=${redirect}`
        }
        if (e === 'ruser') { // 用户协议
          // path = '/pages/login/register'
        }
        if (e === 'privacy') { // 隐私协议
          // path = '/pages/login/register'
        }

        path && uni.navigateTo({
          url: path
        })
      },

      /**
       * app 跳转微信小程序授权登录
       * 需调用plus.share.getServices获取微信分享服务对象
       */
      handleAppLogin() {
        const path='/pages/me/userprofile'
        plus.share.getServices((s) => {
          let sweixin = {}
          for (let i = 0; i < s.length; i++) {
            let share = s[i]
            if (share.id === 'weixin') {
              sweixin = share
            }
          }
          // 小程序参数，必填
          let WeixinMiniProgramOptions = {
            id: this.appInfo.wxghid,
            path: path, // 可指定打开的页面
            type:0  // 0-正式版； 1-测试版； 2-体验版。 默认值为0。
          }
          if (sweixin) {
            sweixin.launchMiniProgram(WeixinMiniProgramOptions)
          } else {
            plus.nativeUI.alert('当前环境不支持微信操作!')
          }
        }, function(e) {
          console.log('获取分享服务列表失败：' + e.message)
        })
      },

      setAppLogin() {
        // #ifdef APP-PLUS
        if(plus.runtime.arguments) {
          let userInfo = JSON.parse(plus.runtime.arguments);
          if(userInfo) {             
            if(userInfo.errcode == '0') {
              this.$storage('userInfo', userInfo)
              this.onLoginSuccess(userInfo)
            } else {
              this.$tips.toast('授权登录失败')
            }
          }
        }
        // #endif
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../styles/var'

  .login
    background #fff
    padding 0 80rpx
    text-align center
    min-height 100vh
    .logo
      width 160rpx
      height 218rpx
      margin-top 100rpx
    .btn-login
      width 100%
      height 88rpx
      background $base-color
      border-radius 49rpx
      margin 200rpx auto 0
      line-height 88rpx
      color #fff
      text-align center
      display flex
      justify-content center
      align-items center
      border none
      &::after
        border none
    .btn-user
      width 100%
      height 80rpx
      border 1px solid $base-color
      border-radius 49rpx
      margin 30rpx auto 0
      color $base-color
      text-align center
      line-height 80rpx
    .btn-box
      display flex
      justify-content space-between
      margin-top 30rpx
      font-size 12px
      &.btn-box-center
        justify-content center
      .btn-register
        color $base-color
      .btn-cancel
        color $gray

    .footer
      position absolute
      bottom 80rpx
      left 0
      right 0
      font-size 12px
      color $gray
      text-align center
      span
        text-decoration underline
        cursor pointer
</style>
