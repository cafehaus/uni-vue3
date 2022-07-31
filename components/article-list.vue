<template>
  <view>
    <view class="article" v-for="(item, index) in articleList" :key="index">
      <!-- #ifdef MP-WEIXIN -->
      <view v-if="index > 0 && (index % item.wxlistAdEvery === 0) && item.wxlistAd == '1' && item.wxlistAdId && showAd">
        <view class="article-ad" v-if="(index / item.wxlistAdEvery) % 2 == 0">
          <ad :unit-id="item.wxVideoAdId" ad-type="video" ad-theme="white" @error="onError"></ad>
        </view>
        <view class="article-ad" v-else>
          <ad :unit-id="item.wxlistAdId" ad-theme="white" @error="onError"></ad>
        </view>
      </view>
      <!-- #endif -->
      <view
        class='article-item'
        @click="goDetail(item.id)"
      >
        <view class="content-box" :class="{'content-box-simple': simple}">
          <view class="title" v-if="item.title">
            <span class="title-txt">{{ item.title.rendered || item.title }}</span>
          </view>
          <view class="des">
            <view class="des-inner">
              <span class="des-item" v-if="item.pageviews">浏览 {{item.pageviews}}</span>
              <span class="des-item" v-if="item.total_comments">评论 {{item.total_comments}}</span>
              <span class="des-item" v-if="item.like_count">点赞 {{item.like_count}}</span>
            </view>
          </view>
        </view>
        <view class="img-box">
          <image :src="item.post_medium_image || item.img || defaultImg" mode="aspectFill" class="cover" />
        </view>
      </view>
    </view>

    <w-empty v-if="empty" />
  </view>
</template>

<script>
  export default {
    name: 'article-list',
    props: {
      articleList: {
        type: Array,
        default: []
      },
      simple: { // 简单模式：只有标题和图片
        type: Boolean,
        default: false
      },
      empty: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        defaultImg: this.$config.defaultImg,
        showAd: true,
      }
    },

    methods: {
      onError(e) {
        if (e.detail.errCode) {
          this.showAd = false
        }
      },

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

  .article-ad
    margin-bottom 16rpx

  .article-item
    display flex
    padding 40rpx
    .content-box
      display flex
      flex-direction column
      justify-content space-between
      margin-right 32rpx
      &.content-box-simple
        justify-content center
      .title
        .title-txt
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
        .des-inner
          .des-item
            &:not(:last-child)
              margin-right 32rpx

    .img-box
      width 240rpx
      height 180rpx
      background #f5f7f7
      margin-left auto
      .cover
        width 240rpx
        height 180rpx
</style>
