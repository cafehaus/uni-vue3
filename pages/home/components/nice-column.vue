<template>
  <view class="nice-column">
    <view class="common-subtitle">
      <view class="common-subtitle-left">精选栏目</view>
      <view class="common-subtitle-right">滑动查看</view>
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
            <image class="img" mode="aspectFill" :src="item.image || $config.defaultImg" />
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
    return {};
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

.top-Nav-box {
  border-bottom: 16rpx solid #f5f7f7;
}

.top-Nav {
  display: flex;
  padding: 0 40rpx 40rpx;
  background: #fff;
  // justify-content: space-between;
}

.top-item {
  margin-right: 16rpx;
  text-align: center;
}

.top-item .img {
  width: 156rpx;
  height: 156rpx;
  border-radius: 6rpx;
  background: #f5f7f7;
}

.top-item .title {
  line-height: 26rpx;
  font-size: 26rpx;
  color: #333;
}

/* 模块标题样式 */
.common-subtitle {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 130rpx;
  padding: 0 40rpx;
  background: #fff;
}

.common-subtitle-left {
  font-size: 34rpx;
  color: #333;
  font-weight: 500;
}

.common-subtitle-right {
  font-size: 26rpx;
  font-weight: 400;
  color: #959595;
  margin-right: 6rpx;
}
</style>
