<template>
  <view class="content">
    <image class="logo" src="/static/logo.png" />
    <view>
      <text class="title">{{ title }}</text>
    </view>
    <h3>uview 组件试用</h3>
    <u-tag text="标签"type="success"></u-tag>
    <u-button type="primary" text="确定"></u-button>
    <u-number-box :min="1" :max="100"></u-number-box>
    <u-notice-bar text="该组件用于滚动通告场景，有多种模式可供选择"></u-notice-bar>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        title: 'Hello',
      }
    },
    onLoad() {

    },
    methods: {

    },
  }
</script>

<style lang="stylus" scoped>
.content
	display flex
	flex-direction column
	align-items center
	justify-content center
	.logo
		height 200rpx
		width 200rpx
		margin 200rpx auto 50rpx auto
	.text-area
		display flex
		justify-content center
	.title
		font-size 36rpx
		color #8f8f94
</style>
