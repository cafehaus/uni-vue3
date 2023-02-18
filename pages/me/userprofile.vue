<template>
  <view class="page">
    <text class="tip">此功能需要获取微信小程序授权，<br>请点击下方按钮授权。</text>
    <view class="btn" @click="onLogin">确认授权</view>
    <view class="shade" @click="hideModal" v-if="showModal"></view>
    <view class="container">
      <view class="modal" v-if="showModal">
        <view class="title">{{ modalTitle }}</view>
        <view class="content">{{ modalContent }}</view>
        <button open-type="launchApp" :app-parameter="userInfo" @binderror="launchAppError" class="btn-back" plain="true"
          @click="clickBtn">返回{{minapperName}}App</button>
      </view>
    </view>
  </view>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    data() {
      return {
        userInfo: {},
        showModal: false,
        modalTitle: '',
        modalContent: '',
        minapperName: '',
        code: ''
      }
    },
    computed: {
      ...mapState('app', ['appInfo', 'systemInfo'])
    },
    onLoad(e) {
      this.initData()
    },

    methods: {
      initData() {
        this.getLoginCode();
        let appName = this.appInfo.appName
        this.minapperName = appName
      },
      // 获取登录code
      getLoginCode() {
        //#ifdef MP-WEIXIN
        uni.login({
          success: (r) => {
            if (r.code) {
              this.code = r.code
            }
          }
        })
        // #endif

      },
      async onLogin(e) {
        // #ifdef MP-WEIXIN
        if (this.code) {
          let args = {}
          let data = {}
          let user = {}
          args.js_code = this.code
          uni['getUserProfile']({
            // #ifdef MP-WEIXIN
            lang: 'zh_CN',
            // #endif
            desc: '登录后信息展示',
            success: async (res) => {
              //console.log(res)
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
                user = response.userInfo || {}
                let userLevel = user.userLevel
                user.userLevel = userLevel.level
                user.levelName = userLevel.levelName
                user.errcode = '0';              
                this.showModal = true
                this.modalTitle = '授权成功'
                this.modalContent = '获取用户信息成功，点击下方按钮返回'
                this.userInfo = JSON.stringify(user);
                console.log(JSON.stringify(user))
              }
            },
            fail: err => {
              uni.hideLoading()
              this.showModal = true,
              this.modalTitle = '授权失败',
              this.modalContent = '获取用户信息失败，点击下方按钮返回'
              user.errcode = '1';
              this.userInfo = JSON.stringify(user);
              console.log(JSON.stringify(user))

            }
          })
        } else {
          this.$tips.toast('登录失败', 'error')          
        }
        // #endif

      },
      launchAppError(e) {
        console.log(e.detail.errMsg)
      },
      clickBtn() {
        this.showModal=false;
      },
      //隐藏弹窗
      hideModal() {
        this.showModal=false;
      },
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../styles/var'
  .page
    height 100%
    padding 200rpx 80rpx
    text-align center
    .tip
      font-size 32rpx
      color $black
      line-height 2
    .btn
      margin-top 160rpx
      width 100%
      height 100rpx
      background $base-color
      border-radius 50rpx
      font-size 32rpx
      font-weight bold
      color #FFF
      text-align center
      line-height 100rpx
    .btn-back
      // margin-top 160rpx
      width 80%
      height 80rpx
      background $base-color
      border-radius 50rpx
      font-size 32rpx
      font-weight bold
      color #FFF
      text-align center
      line-height 80rpx
      border none
      justify-content center
      margin 30rpx auto 0
    .shade
      width 100%
      height 100%
      position fixed
      top 0
      left 0
      background #000000
      opacity 0.5
      overflow hidden
      z-index 9000
      color #ffffff
    .modal
      width 640rpx
      overflow hidden
      position fixed
      top 50%
      left 50%
      transform translate(-50%, -50%)
      z-index 9999
      background #f9f9f9
      border-radius 10rpx
      padding 30rpx
    .modal.title
      padding 32rpx 24rpx 0
      min-height 40rpx
      color #000000
      text-align center
    .modal.content
      padding 16rpx 24rpx 0
      font-size 30rpx
      color #666666
      text-align center
    .modal.btn
      color #576B95
      width 100%
      height 100rpx
      margin-top 32rpx
      border hidden
      border-top 1px solid rgba(113, 119, 129, 0.2)
      border-radius 0%
      font-size 25rprx
      font-weight 550
</style>
