<template>
  <view class="custom-ad">
    <!-- banner图 -->
    <view
      v-if="type === '1'"
      :class="isBorder ? 'custom-ad custom-ad-border' : 'custom-ad'"
      @click="goto"
    >
      <image class="img" mode="aspectFill" :src="info.image" />
    </view>

    <!-- 左图右标题 -->
    <view
      v-if="type === '2'"
      :class="isBorder ? 'custom-ad-left custom-ad-border' : 'custom-ad-left'"
      @click="goto"
    >
      <image class="img" mode="aspectFill" :src="info.image" />
      <view class="title-box">
        <text class="txt">{{ info.title }}</text>
        <view class="btn">{{ btnText }}</view>
      </view>
    </view>

    <!-- 上图下标题 -->
    <view
      v-if="type === '3'"
      :class="isBorder ? 'custom-ad-top custom-ad-border' : 'custom-ad-top'"
      @click="goto"
    >
      <image class="img" mode="aspectFill" :src="info.image" />
      <view class="title-box">
        <text class="txt">{{ info.title }}</text>
        <view class="btn">{{ btnText }}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'custom-ad',
  props: {
    info: {
      type: Object,
      default: () => ({})
    },
    isBorder: {
      type: Boolean,
      default: true
    },
    type: { // 1 banner图 2 左图右标题 3 上图下标题
      type: String,
      default: '1'
    },
    btnText: { 
      type: String,
      default: '查看详情'
    }
  },
  methods: {
    // 跳转
    goto() {
      const { type, url, path } = this.info

      if (type === 'apppage') { // 小程序页面
        uni.navigateTo({
          url: path
        })
      }
      if (type === 'webpage') { // web-view页面
        url = '/pages/common/web?url=' + url
        uni.navigateTo({
          url
        })
      }
    }
  },
}
</script>

<style lang="stylus" scoped>

.custom-ad // banner图
  .img
    display block
    width 100%
    height 214rpx
    position relative

.custom-ad-left // 左图右标题
  display flex
  align-items center
  .img
    display block
    width 70%
    height 214rpx
    position relative
  .title-box
    width 30%
    max-height 214rpx
    padding 20rpx 40rpx
    box-sizing border-box
    display flex
    flex-direction column
    justify-content center
    align-items center
    .txt
      text-overflow -o-ellipsis-lastline
      overflow hidden
      text-overflow ellipsis
      display -webkit-box
      -webkit-line-clamp 2
      -webkit-box-orient vertical
      font-size 13px
      line-height 1.4
      color #333
    .btn
      font-size 12px
      line-height 1
      color #07c160
      border 1px solid #07c160
      border-radius 6rpx
      padding 16rpx
      margin-top 16rpx

.custom-ad-top // 上图下标题
  display flex
  flex-direction column
  justify-content center
  align-items center
  .img
    width 100%
    height 214rpx
    position relative
  .title-box
    width 100%
    padding 40rpx
    box-sizing border-box
    display flex
    justify-content space-between
    align-items center
    background #FFF
    .txt
      font-size 14px
      line-height 1.4
      color #333
      text-overflow -o-ellipsis-lastline
      overflow hidden
      text-overflow ellipsis
      display -webkit-box
      -webkit-line-clamp 2
      -webkit-box-orient vertical
    .btn
      font-size 13px
      line-height 1
      color #FFF
      background #07c160
      border-radius 6rpx
      padding 16rpx
      margin-left 40rpx
      flex-shrink 0

// 公用样式
.custom-ad .img::before,
.custom-ad-left .img::before,
.custom-ad-top .img::before
  content '广告'
  position absolute
  top 10rpx
  left 40rpx
  background rgba(0, 0, 0, 0.4)
  font-size 10px
  color #fff
  line-height 32rpx
  height 32rpx
  padding 0 16rpx
  border-radius 16rpx
.custom-ad-border
  border-bottom 16rpx solid #f5f7f7
</style>
