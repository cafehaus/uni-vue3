<template>
  <div class="search-box" :class="{'search-box-home': from === 'home'}">
    <!-- 最新评论和新手指南 -->
    <view v-if="from === 'home'" class="nav">
      <view class="nav-item" @click="goto('/pages/common/comment')">
        <image class="img" src="@/static/comment.jpg" mode="aspectFill" />
        <view class="info">
          <view class="title">最新评论</view>
          <view class="des">评论也很好看哟</view>
        </view>
      </view>

      <view class="nav-item" @click="goto('/pages/me/about')">
        <image class="img" src="@/static/guide.jpg" mode="aspectFill" />
        <view class="info">
          <view class="title">关于我们</view>
          <view class="des">了解我们看这里</view>
        </view>
      </view>
    </view>

    <!-- 搜索框 -->
    <view class="search">
      <input :value="value" placeholder="你感兴趣的内容..." />
      <i class="iconfont icon-search" @click="goto('/pages/common/search')" />
    </view>
  </div>
</template>

<script>
  export default {
    name: 'VSearch',
    props: {
      from: { // 页面
        type: String,
        default: ''
      },
      value: {
        type: String,
        default: '',
      },
    },

    data() {
      return {
        searchKey: ''
      }
    },

    methods: {
      // 跳转
      goto(url) {
        if (this.from === 'home') {
          if (url === '/pages/common/search') {
            url = url + '?search=' + this.searchKey
          }
          uni.navigateTo({
            url
          })
        } else {
          this.$emit('search')
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>

.search-box
  width 100%
  &.search-box-home
    border-top 16rpx solid #f5f7f7
    border-bottom 16rpx solid #f5f7f7
  .search
    background #f5f6f7
    padding 30rpx 20rpx
    display flex
    justify-content space-between
    align-items center
    margin 16rpx 40rpx 40rpx

  .nav
    display flex
    flex-direction row
    justify-content space-between
    padding 40rpx 40rpx 0
    .nav-item
      width 100%
      position relative
      &:first-child
        margin-right 8rpx
      &:last-child
        margin-left 8rpx
      .img
        width 100%
        height 160rpx
        border-radius 8rpx
        background #f5f7f7

      .info
        position absolute
        top 50%
        left 0
        transform translateY(-50%)
        text-align left
        margin-left 32rpx
        .title
          font-size 30rpx
          color #333
          font-weight 500
          multi-nowrap(1)
        .des
          font-size 24rpx
          color #959595
          margin-top 12rpx
          multi-nowrap(1)
</style>
