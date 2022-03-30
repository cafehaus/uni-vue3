<template>
  <view class="tags" v-if="tagList.length">
    <view class='common-subtitle'>
      <view class='common-subtitle-left'>热门标签</view>
      <!-- <navigator url="../postags/postags" open-type="navigate" hover-class="none"> -->
        <view class='common-subtitle-right'>更多</view>
      <!-- </navigator> -->
    </view>
    <!-- 标签列表 -->
    <view class='tagsname-container'>
      <view class="tagsname" :key="index" v-for="(item, index) in tagList">
        <!-- <navigator url="/pages/common/list?tagId={{item.id}}" open-type="navigate" hover-class="none"> -->
          <view class='tagsname-name'>#{{ item.name }}</view>
        <!-- </navigator> -->
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'v-swiper',
    props: {
      tagList: {
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

/* 热门标签 */
.tags {
  border-bottom: 16rpx solid #f5f7f7;
  background: #fff;
}

.tagsname-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0 40rpx;
  padding-bottom: 16rpx;
}

.tagsname {
  height: 72rpx;
  border-radius: 36rpx;
  background: #f5f7f7;
  padding: 0 36rpx;
  margin-right: 24rpx;
  margin-bottom: 24rpx;
}

.tagsname-name {
  color: #4c4c4c;
  font-size: 26rpx;
  line-height: 72rpx;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
