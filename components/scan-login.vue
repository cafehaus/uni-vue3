<template>
  <view v-if="isShow" class="scan-login" @click="handleScanLogin">
    <view>{{ text }}</view>
  </view>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: 'scan-login',
    props: {
      text: {
        type: String,
        default: '扫码登录',
      },
    },
    data() {
      return {}
    },
    computed: {
      ...mapState('user', ['isLogin']),
      isShow() {
        const config = this.$config || {}
        const plugins = config.plugins || []
        const isWx = config.platform === 'MP-WEIXIN'
        return isWx && plugins.includes('scan-login')
      },
    },
    methods: {
      handleScanLogin() {
        // #ifdef MP-WEIXIN
        if (!this.isLogin) {
          this.$user.login('navigateTo')
          return
        }
        uni.scanCode({
          onlyFromCamera: true,
          scanType: ['qrCode'],
          success: async (res) => {
            const qrcode = res.result
            if (qrcode.length != 16) {
              this.$tips.toast('无效的二维码')
              return
            }

            const user = this.$storage('userInfo') || {}
            /**
             * 接口 seesionid 要取 openid
             */
            const openId = user.openid
            const resScan = await this.$api.scanLogin({
              sessionid: openId,
              qrcode: qrcode,
              action: 'scan'
            })
            if (resScan.success) {
              uni.showModal({
                title: '提示',
                content: '确定使用当前账号登录网站吗?',
                success: async (res) => {
                  if (res.confirm) {
                    const resConfirm = await this.$api.scanLogin({
                      sessionid: openId,
                      qrcode: qrcode,
                      action: 'confirm'
                    })
                    if (resConfirm.success) {
                      this.$tips.toast('扫码登录成功')
                    }
                  }
                }
              })
            }
          }
        })
        // #endif
      }
    }
  }
</script>

<style lang="stylus" scoped>
.scan-login
  height 100rpx
  line-height 100rpx
  font-size 14px
  color #333
  position relative
  &::after
    content ''
    display inline-block
    border solid #c4c4c4
    border-width 0 2px 2px 0
    padding 3px
    position absolute
    right 0
    top 50%
    transform translateY(-50%) rotate(-45deg)
    -webkit-transform translateY(-50%) rotate(-45deg)
</style>
