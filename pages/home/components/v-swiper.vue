<template>
  <view class="swiper-box">
    <swiper
      v-if="swiperList.length"
      class="swiper"
      indicator-dots
      interval="10000"
      autoplay
      indicator-color="rgba(0, 0, 0, .1)"
      indicator-active-color="#fd8f45"
    >
      <swiper-item
        v-for="(item, index) in swiperList"
        :key="index"
        @click="goto(item)"
      >
        <image class="img" mode="aspectFill" :src="item.image" />
        <view class="swiper-desc">
          <view class='swiper-des-left'>
            <text class="title">{{ item.title }}</text>
          </view>
          <view class="btn-read">立即阅读</view>
        </view>
      </swiper-item>
    </swiper>
  </view>
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
@import '../../../styles/var'

.swiper-box
  width 100%

.swiper {
  position: relative;
  height: 504rpx;
  background: #fff;
  box-shadow: 0px 22px 50px -24px rgba(0, 0, 0, 0.1);
}

.swiper .img {
  display: block;
  width: 100%;
  height: 324rpx;
}

.swiper .swiper-desc {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 40rpx;
}

.swiper-des-left .title {
  color: #333;
  font-size: 28rpx;
  line-height: 1.6;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.swiper-des-left {
  color: #999;
  letter-spacing: 2px;
  font-size: 22rpx;
  margin: 0 0 28rpx 0;
}

.swiper-des-left {
  width: 64%;
}

.swiper-desc .btn-read {
  background: $base-color;
  color: #fff;
  width: 180rpx;
  height: 60rpx;
  line-height: 60rpx;
  border-radius: 40px;
  letter-spacing: 2px;
  font-size: 20rpx;
  text-align: center;
}
</style>
