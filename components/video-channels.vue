<template>
  <view
    v-if="isShow"
    class="video-channels"
    @click="goto"
  >
    <view class="video-channels-img">
      <text class="iconfont icon-channels" />
    </view>
    <view class="video-channels-info">
      <view class="tittle">视频号</view>
      <view class="des">关注我的视频和直播</view>
    </view>
    <view class="video-channels-btn">进入</view>
  </view>
</template>

<script>
import store from '@/store'
import { mapState } from 'vuex'
export default {
  name: 'video-channels',
  data() {
    return {}
  },
  computed: {
    ...mapState('app', ['appInfo', 'systemInfo']),
    isShow() {
      const config = this.$config || {}
      const plugins = config.plugins || []
      const channelenableapp =this.appInfo.channelenableapp;
      let isFlog=false
      if(config.platform === 'MP-WEIXIN')
      {
        isFlog= true
      }
      else if(config.platform === 'APP-PLUS' && channelenableapp==='1')
      {
        isFlog= true
      }      
      return isFlog && plugins.includes('video-channels')
    },
  },
  methods: {

    goto() {
      let url ='/pages/common/channels'
      //#ifdef MP-WEIXIN
      uni.navigateTo({
        url: url
      })
      // #endif

      //#ifdef APP-PLUS
      const state = store.state || {}
      const app = state.app || {}
      const appInfo = app.appInfo || {}
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
          id:appInfo.wxghid,
          path:url, // 可指定打开的页面
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
      // #endif
    }
  },
}
</script>

<style lang="stylus" scoped>
.video-channels
  padding 40rpx 30rpx
  border-radius 8rpx
  background linear-gradient(to right,#f5cda3, #eabbb1)
  display flex
  align-items center
  justify-content space-between
  margin 40rpx 40rpx 0
  position relative
  overflow hidden
  &::before
    content ''
    position absolute
    top 50%
    left -100rpx
    width 200rpx
    height 200rpx
    background rgba(255,255,255, .1)
    transform translateY(-50%) rotate(45deg)
    z-index 1
  &::after
    content ''
    position absolute
    top 50%
    left -60rpx
    width 120rpx
    height 120rpx
    background rgba(255,255,255, .05)
    transform translateY(-50%) rotate(45deg)
    z-index 1
  .video-channels-img
    display flex
    align-items center
    justify-content center
    width 100rpx
    height 100rpx
    border-radius 50%
    background #fff
    flex-shrink 0
    position relative
    z-index 2
    .iconfont
      font-size 60rpx
      color #ffb566
      line-height 1
  .video-channels-info
    margin 0 20rpx
    flex 1
    color #FFF
    line-height 1
    position relative
    z-index 2
    .tittle
      font-size 36rpx
      font-weight bold
    .des
      font-size 24rpx
      margin-top 16rpx
  .video-channels-btn
    height 60rpx
    padding 0 40rpx
    border-radius 40rpx
    border 1px solid #fff
    font-size 13px
    color #fff
    line-height 60rpx
</style>
