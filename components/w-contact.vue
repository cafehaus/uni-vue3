<template>
  <view class="contact-service" :style="'bottom:' + bottom">
    <button class="contact" open-type="contact" hover-class="none">
      <text class="iconfont icon-contact-girl" />
    </button>
  </view>
</template>

<script>
export default {
  name: 'w-contact',
  props: {
    bottom: {
      // 距离底部的距离
      type: String,
      default: '60rpx',
    },
  },
}
</script>

<style lang="stylus" scoped>
.contact-service
  position fixed
  bottom 60rpx
  right 20rpx
  z-index 999
  width 88rpx
  height 88rpx
  display flex
  justify-content center
  align-items center
  background linear-gradient(135deg, #fda945, #fd8f45)
  border-radius 50%
  box-shadow 2rpx 4rpx 10rpx rgba(0, 0, 0, 0.1)
  overflow hidden
  margin-bottom env(safe-area-inset-bottom)
  button
    background transparent
    padding 0
    margin 0
    &::after
    border none
  .iconfont
    color #FFF
    font-size 54rpx
</style>
