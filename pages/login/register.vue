<template>
  <div class="view login">
    <image class="logo" src="/static/logo.png" mode="aspectFit" />

    <view class="form">
      <view class="form-item">
        <input
          v-model="userName"
          class="input"
          placeholder="请输入用户名"
        />
      </view>
      <view class="form-item">
        <input
          v-model="phone"
          class="input"
          placeholder="请输入手机号"
        />
      </view>
      <view class="form-item">
        <input
          v-model="password"
          class="input"
          placeholder="请输入密码"
        />
      </view>
    </view>
    <p class="btn-register" @click="handleRegister">立即注册</p>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        userName: '',
        phone: '',
        password: '',
      }
    },

    onLoad(e) {
      this.redirect = e.redirect
      this.initData()
    },

    methods: {
      initData() {
      },

      async handleRegister() {
        const err = this.validate()
        if (err) {
          this.$tips.toast(err, 'none', 5000)
          return
        }

        let args = {
          username: this.userName,
          phone: this.phone,
          password: this.password
        }
        this.$tips.loading('正在注册...')
        const res = await this.$api.register(args)
        this.$tips.loaded()

        if (res.code == 'success') {
          this.handleLogin()
        } else {
          this.$tips.toast(res.message)
        }
      },

      validate() {
        let err = ''
        if (!this.userName) {
          err = '请输入用户名'
        } else {
          let reg = /^[a-zA-Z][a-zA-Z0-9_]{4,19}$/
          if (!reg.test(this.userName)) {
            err = '用户名必须以字母开头，只能包含数字、字母、下划线等5-20个字符'
          }
        }

        if (!this.phone) {
          err = '请输入手机号'
        } else {
          if (!/^1[3-9]\d{9}$/.test(this.phone)) {
            err = '手机号格式不正确'
          }
        }

        if (!this.password) {
          err = '请输入密码'
        } else {
          let reg = /^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,20}$/
          if (!reg.test(this.password)) {
            err = '密码6-20位字符，需包括数字与英文字母'
          }
        }

        return err
      },

      async handleLogin() {
        let args = {
          username: this.userName,
          password: this.password
        }
        // this.$tips.loading('正在登录...')
        const res = await this.$api.passwordLogin(args)
        this.$tips.loaded()

        if (res.status == '200') {
          let user = res.user || {}
          user.openid = res.userid
          user.userId = response.userid
          let userLevel = res.userlevel || { level: '0', levelName: '订阅者' }
          user.userLevel = userLevel
          user.levelName = userLevel.levelName

          this.$storage('userInfo', user)
          this.onLoginSuccess(user)
        }
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

          let preRoute = this.$uni.getPrevPath()
          let delta = preRoute === 'pages/login/login' ? 2 : 1
          uni.navigateBack({
            delta
          })
        } else {
          this.$uni.relaunch(query.relaunch || '/pages/home/home')
        }
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
    .logo
      width 160rpx
      height 218rpx
      margin-top 100rpx
    .form
      padding 40rpx 0
      &-item
        border 1rpx solid #eee
        margin-top 20rpx
        padding 20rpx
        text-align left
    .btn-register
      width 100%
      height 88rpx
      background $base-color
      border-radius 49rpx
      // margin 200rpx auto 0
      line-height 88rpx
      color #fff
      text-align center
      display flex
      justify-content center
      align-items center
      &::after
        border none
    // .btn-register
    //   width 100%
    //   height 80rpx
    //   border 1px solid $base-color
    //   border-radius 49rpx
    //   margin 30rpx auto 0
    //   color $base-color
    //   text-align center
    //   line-height 80rpx
    // .btn-cancel
    //   font-size 13px
    //   color #bbb
    //   line-height 100rpx

</style>
