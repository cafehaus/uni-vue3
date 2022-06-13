<template>
  <view class="w-empty">
    <image v-if="isImage" class="image" :src="icon" mode="widthFix" />
    <i v-else :class="icon" class="iconfont" />
    <p class="txt"><slot>{{ text }}</slot></p>
    <view class="footer"><slot name="footer" /></view>
  </view>
</template>

<script>
  export default {
    name: 'w-empty',
    props: {
      icon: {
        type: String,
        default: 'icon-empty',
      },
      text: {
        type: String,
        default: '空空如也',
      },
    },
    computed: {
      isImage() {
        return this.icon.includes('/')
      },
    },
  }
</script>

<style lang="stylus" scoped>
  .w-empty
    display flex
    flex-direction column
    justify-content center
    align-items center
    padding 100rpx 0 0
    height 100%
    .iconfont
      font-size 140rpx
      color #ccc
    .image
      width 600rpx
    .txt
      color #999
      font-size 30rpx
      text-align center
      margin-top 20rpx
    .footer
      align-self stretch
      display flex
      justify-content center
      align-items center
      padding 20rpx 30rpx
</style>
