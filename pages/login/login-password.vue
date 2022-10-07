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
          v-model="password"
          type="password"
          class="input"
          placeholder="请输入密码"
        />
      </view>
    </view>
    <p class="btn-register" @click="handleLogin">立即登录</p>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        userName: '',
        password: '',
      }
    },

    onLoad(e) {
      this.redirect = e.redirect || ''
      this.initData()
    },

    methods: {
      initData() {
      },

      async handleLogin() {
        if (!this.userName || !this.password) {
          let msg = !this.userName ? '请输入用户名' : '请输入密码'
          this.$tips.toast(msg)
          return
        }

        let args = {
          username: this.userName,
          password: this.password
        }
        this.$tips.loading('正在登录...')
        const res = await this.$api.userLogin(args)
        this.$tips.loaded()

        if (res.code == 'success') {
          let user = res.userInfo || {}
          // user.openid = res.userid
          // user.userId = res.userId
          let userLevel = user.userlevel || { level: '0', levelName: '订阅者' }
          user.userLevel = userLevel
          user.levelName = userLevel.levelName

          this.$storage('userInfo', user)
          this.onLoginSuccess(user)
        } else {
          this.$tips.toast(res.message)
        }
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
          // uni.redirectTo({ // 此方法不能跳 tabbar 页面
          uni.reLaunch({
            url: decodeURIComponent(this.redirect)
          })
        // } else if (this.$uni.hasPrevPage()) {
        //   this.$uni.refreshtPrevPage()
        //   uni.navigateBack()
        } else {
          console.log('relaunch')
          this.$uni.relaunch('/pages/home/home')
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
