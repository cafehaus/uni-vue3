<template>
  <div class="search-box">
    <!-- 最新评论和新手指南 -->
    <view class="top-Nav2">
      <!-- 最新评论 -->
      <view class="top-item2-container">
        <!-- <navigator url='../comments/comments' hover-class="none"> -->
          <view class="top-item2">
            <view class="top-item2-pic">
              <image class="img" src="@/static/comment.jpg" mode="aspectFill"></image>
            </view>
            <view class="top-item2-word">
              <view class="top-item2-title">最新评论</view>
              <view class="top-item2-brief">评论也很好看哟</view>
            </view>
          </view>
        <!-- </navigator> -->
      </view>
      <!-- 新手指南 -->
      <view class="top-item2-container">
        <!-- <navigator url="../about/about" hover-class="none"> -->
          <view class="top-item2">
            <view class="top-item2-pic">
              <image class="img" src="@/static/guide.jpg" mode="aspectFill"></image>
            </view>
            <view class="top-item2-word">
              <view class="top-item2-title">关于我们</view>
              <view class="top-item2-brief">了解我们看这里</view>
            </view>
          </view>
        <!-- </navigator> -->
      </view>
    </view>

    <!-- 搜索框 -->
    <view class="search">
      <span>你感兴趣的内容...</span>
      <i class="iconfont icon-search" />
    </view>
  </div>
</template>

<script>
  export default {
    name: 'v-swiper',
    props: {
      swiperList: {
        type: Array,
        default: () => []
      }
    },

    data() {
      return {}
    },

    methods: {
      // 跳转
      goto(info) {
        let { type, appid, url, path } = info

        if (type === 'apppage') { // 小程序页面         
          uni.navigateTo({
            url: path
          })
        }
        if (type === 'webpage') { // web-view页面
          url = '../webpage/webpage?url=' + url
          uni.navigateTo({
            url
          })
        }
        if (type === 'miniapp') { // 其他小程序
          uni.navigateToMiniProgram({
            appId: appid,
            path
          })
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
// @import '~@/styles/var'
.search-box
  width 100%
/* 文章排行和最新评论 */
.top-Nav2 {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 40rpx 40rpx 0;
}

.top-Nav2 .top-item2-container:first-child {
  margin-right: 8rpx;
}

.top-Nav2 .top-item2-container:last-child {
  margin-left: 8rpx;
}

.top-item2-container {
  width: 100%;
}

.top-item2 {
  position: relative;
}

.top-item2-pic {
  width: 100%;
  height: 160rpx;
}

.top-item2-pic .img {
  width: 100%;
  height: 160rpx;
  border-radius: 8rpx;
  background: #f5f7f7;
}

.top-item2-word {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  text-align: left;
  margin-left: 32rpx;
}

.top-item2-title {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}

.top-item2-brief {
  font-size: 24rpx;
  color: #959595;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  margin-top: 12rpx;
}

.search-box
  border-top 16rpx solid #f5f7f7
  border-bottom 16rpx solid #f5f7f7
  .search
    background #f5f6f7
    padding 30rpx 20rpx
    display flex
    justify-content space-between
    align-items center
    margin 16rpx 40rpx 40rpx
</style>
