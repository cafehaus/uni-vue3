<template>
  <view class="tags" v-if="tagList.length">
    <view class="header">
      <view class="label">热门标签</view>
      <view class="btn-more" @click="goto(item)">更多</view>
    </view>
    <!-- 标签列表 -->
    <view class="content">
      <view class="tag" :key="index" v-for="(item, index) in tagList">
        <view class="txt" @click="goto(item)">#{{ item.name }}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'v-tag',
  props: {
    tagList: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {}
  },

  methods: {
    // 跳转
    goto(e) {
      if (e && e.id) {
        uni.navigateTo({
          url: `/pages/common/list?id=${e.id}&type=2`,
        })
      } else {
        uni.navigateTo({
          url: '/pages/common/tags',
        })
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
  @import '../../../styles/var'

  .tags
    border-bottom 16rpx solid #f5f7f7
    background #fff
    .content
      display flex
      flex-direction row
      flex-wrap wrap
      margin 0 40rpx
      padding-bottom 16rpx
      .tag
        height 72rpx
        border-radius 36rpx
        background #f5f7f7
        padding 0 36rpx
        margin-right 24rpx
        margin-bottom 24rpx
        .txt
          color #4c4c4c
          font-size 26rpx
          line-height 72rpx
          text-align center
          overflow hidden
          text-overflow ellipsis
          white-space nowrap

    .header
      display flex
      flex-direction row
      justify-content space-between
      align-items center
      height 130rpx
      padding 0 40rpx
      background #fff
      .label
        font-size 34rpx
        color #333
        font-weight 500
      .btn-more
        font-size 26rpx
        font-weight 400
        color #959595
        margin-right 6rpx
</style>
