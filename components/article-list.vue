<template>
  <view class="article">
    <view
      class='article-item'
      v-for="(item, index) in articleList"
      :key="index"
      @click="goDetail(item.id)"
    >
      <view class="content-box">
        <view class="title">
          <span>{{ item.title.rendered || item.title }}</span>
        </view>
        <view class="des">
          <view class="des-inner">
            <span>浏览 {{item.pageviews}}</span>
            <span>评论 {{item.total_comments}}</span>
            <span>点赞 {{item.like_count}}</span>
          </view>
        </view>
      </view>
      <view class="img-box">
        <img :src="item.post_medium_image || $config.defaultImg" mode="aspectFill" class="cover" />
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'article-list',
    props: {
      articleList: {
        type: Array,
        default: []
      }
    },

    data() {
      return {}
    },

    onLoad() {
      // this.initData()
    },

    methods: {
      // initData() {},

      // 去文章详情
      goDetail(id) {
        uni.navigateTo({
          url: `/pages/common/detail?id=${id}`
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../styles/var'

  .article-item
    display flex
    padding 40rpx
    .content-box
      display flex
      flex-direction column
      justify-content space-between
      margin-right 32rpx
      .title span
        text-overflow -o-ellipsis-lastline
        overflow hidden
        text-overflow ellipsis
        display -webkit-box
        -webkit-line-clamp 2
        -webkit-box-orient vertical
        font-size 32rpx
        line-height 1.5
        font-weight 500
        color #333
      .des
        color #959595
        font-size 24rpx
        .des-inner span:not(:last-child)
          margin-right 32rpx

    .img-box
      width 240rpx
      height 180rpx
      background #f5f7f7
      margin-left auto
      img
        width 240rpx
        height 180rpx
</style>
