<template>
  <view class="nice-column" v-if="navList.length>0">
    <view class="subtitle">
      <view class="subtitle-left">精选栏目</view>
      <view class="subtitle-right">滑动查看</view>
    </view>

    <scroll-view scroll-x>
      <view class="top-Nav">
        <view
          v-for="(item, index) in navList"
          :key="index"
          class="top-item"
          @click="goto(item)"
        >
          <view>
            <image v-if="item.image" class="img" mode="aspectFill" :src="item.image" />
            <image v-else class="img" mode="aspectFill" :src="defaultImg" />
          </view>
          <view>
            <text class="title">{{ item.title }}</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: "nice-column",
  props: {
    navList: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      defaultImg: this.$config.defaultImg
    }
  },

  methods: {
    // 跳转
    goto(info) {
      this.$util.goto(info);
    },
  },
};
</script>

<style lang="stylus" scoped>
.nice-column
  width 100%
  .top-Nav
    display flex
    padding 0 40rpx 40rpx
    background #fff
    .top-item
      margin-right 16rpx
      text-align center
      .img
        width 156rpx
        height 156rpx
        border-radius 6rpx
        background #f5f7f7
      .title
        line-height 26rpx
        font-size 26rpx
        color #333
  .subtitle
    display flex
    flex-direction row
    justify-content space-between
    align-items center
    height 130rpx
    padding 0 40rpx
    background #fff
    &-left
      font-size 34rpx
      color #333
      font-weight 500
    &-right
      font-size 26rpx
      font-weight 400
      color #959595
      margin-right 6rpx
</style>
