<template>
  <view class="channels-page">
    <view class="channels-header">
      <view
        class="channels-user"
        @click="openUserProfile"
      >
        <image
          class="channels-logo"
          :src="info.channelsCover"
          mode="aspectFill"
        />
        <view>
          <view class="channels-name">{{ info.channelsName }}</view>
          <view class="channels-des">{{ info.channelsDesc }}</view>
        </view>
      </view>

      <view class="channels-card-wrap">
        <view
          v-if="info.enableLive === '1' && channelsLiveInfo"
          class="channels-card"
          @click="openChannelsLive"
        >
          <view class="channels-left">
            <text class="iconfont icon-live" />
          </view>
          <view class="channels-right">
            <view class="channels-title">{{ channelsLiveInfo.description }}</view>
            <view v-if="channelsLiveInfo.status === 2" class="channels-des">正在直播中...</view>
            <view v-else-if="channelsLiveInfo.status === 3" class="channels-des">直播已结束</view>
          </view>
        </view>
        <view
          v-if="channelsLiveNoticeInfo && channelsLiveNoticeInfo.status === 0 && channelsLiveNoticeInfo.reservable"
          class="channels-card"
          @click="reserveChannelsLive"
        >
          <view class="channels-left icon">
            <text class="iconfont icon-clock" />
          </view>
          <view class="channels-right">
            <view class="channels-title">直播预约</view>
            <view class="channels-date">{{ channelsLiveNoticeInfo.startTime }}</view>
          </view>
        </view>
      </view>
    </view>

    <view class="channels-content">
      <view class="channels-navbar">
        <view
          class="channels-navbar-item"
          :class="{'channels-navbar-item-on': activeTab === 0}"
          @click="handleTab(0)"
        >
          <text class="channels-navbar-title">视频</text>
        </view>
        <view
          class="channels-navbar-item"
          :class="{'channels-navbar-item-on': activeTab === 1}"
          @click="handleTab(1)"
        >
          <text class="channels-navbar-title">活动</text>
        </view>

        <view class="channels-navbar-slider" :class="'channels-navbar-slider-' + activeTab" />
      </view>

      <!-- 列表 -->
      <view class="channels-list">
        <view
          v-for="(item, index) in list"
          :key="index"
          class="channels-list-item"
          @click="goto(item)"
        >
          <view class="channels-list-content">
            <view class="channels-list-title">
              <text class="txt">{{ item.title }}</text>
            </view>

            <block wx:if="{{activeTab === 0}}">
              <view class="channels-list-des">{{ item.creatdateName }}</view>
              <view class="channels-list-des">
                <text class="txt">浏览 {{ item.pageview || 0}}</text>
                <text class="txt">喜欢 {{ item.like || 0 }}</text>
              </view>
            </block>
            <block wx:else>
              <view class="channels-list-des">{{ item.enddateName }}</view>
              <view class="channels-list-des">
                <text class="txt">参与 {{ item.jionincount || 0 }}次</text>
              </view>
            </block>
          </view>
          <view
            class="channels-list-cover"
            v-if="item.feedId && activeTab === 0"
          >
            <channel-video
              v-if="item.feedId && item.channelsId"
              :feed-id="item.feedId"
              :finder-user-name="item.channelsId"
              :muted="false"
              :autoplay="false"
              object-fit="cover"
            />
          </view>
          <image
            v-if="item.eventId && activeTab === 1"
            :src="item.cover"
            mode="aspectFill"
            class="img-cover-video channels-list-cover"
            @click="goto(item)"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const regDate = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/

export default {
  data() {
    return {
      info: {},
      activeTab: 0,
      list: [],
      channelsLiveInfo: '',
      channelsLiveNoticeInfo: ''
    }
  },
  onLoad() {
    this.init()
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    this.init()
    uni.stopPullDownRefresh()
  },

  methods: {
    init() {
      this.getChannelsInfo()
      this.handleTab(this.activeTab)
    },

    async getChannelsInfo() {
      const res = await this.$api.getChannelsInfo()
      const channelsId = res.channelsId
      this.info = res || {}
      wx.getChannelsLiveInfo({
        finderUserName: channelsId,
        success: (resLive) => {
          this.channelsLiveInfo = resLive
        }
      })

      wx.getChannelsLiveNoticeInfo({
        finderUserName: channelsId,
        success: (resLiveNotice) => {
          let channelsLiveNoticeInfo = resLiveNotice || ''
          const startTime = channelsLiveNoticeInfo.startTime
          channelsLiveNoticeInfo.startTime = this.fmtDate(startTime, 'MM-dd HH:mm')
          this.channelsLiveNoticeInfo = channelsLiveNoticeInfo
        }
      })
    },

    fmtDate(time, format) {
      let t = new Date(time * 1000)
      let tf = function(i) {
        return (i < 10 ? '0' : '') + i
      }
      return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
        switch(a){
          case 'yyyy':
            return tf(t.getFullYear())
            break
          case 'MM':
            return tf(t.getMonth() + 1)
            break
          case 'mm':
            return tf(t.getMinutes())
            break
          case 'dd':
            return tf(t.getDate())
            break
          case 'HH':
            return tf(t.getHours())
            break
          case 'ss':
            return tf(t.getSeconds())
            break
        }
      })
    },

    async getChannelsActivity() {
      this.$tips.loading()
      const res = await this.$api.getChannelsActivity()
      this.$tips.loaded()
      let list = res || []
      this.list = list.map(m => {
        if (m.creatdate) {
          m.creatdateName = regDate.test(m.creatdate)
            ?
            m.creatdate.replace(regDate, '$2-$3 $4:$5')
            :
            m.creatdate
        }

        return m
      })
    },

    async getChannelsEvent() {
      this.$tips.loading()
      const res = await this.$api.getChannelsEvent()
      this.$tips.loaded()
      let list = res || []
      this.list = list.map(m => {
        if (m.enddate) {
          m.enddateName = regDate.test(m.enddate)
            ?
            m.enddate.replace(regDate, '$2-$3 $4:$5')
            :
            m.enddate
        }

        return m
      })
    },

    handleTab(activeTab) {
      let dataName = activeTab === 0 ? 'getChannelsActivity' : 'getChannelsEvent'
      this[dataName]()
      this.activeTab = activeTab
    },

    //预约直播
    reserveChannelsLive() {
      wx.reserveChannelsLive({
        noticeId: this.channelsLiveNoticeInfo.noticeId
      })
    },

    // 跳转视频号直播
    redictChannelsLive() {      
      wx.openChannelsLive({
        finderUserName: this.info.channelsId
      })
    },
    
    // 跳转视频号主页
    openUserProfile() {
      wx.openChannelsUserProfile({
        finderUserName: this.info.channelsId
      })
    },

    goto(e) {
      let channelsId = e.channelsId
      let feedId = e.feedId
      let eventId = e.eventId

      // 视频
      if (this.activeTab === 0) {
        uni.openChannelsActivity({
          finderUserName: channelsId,
          feedId: feedId
        })
      }
      // 活动
      if (this.activeTab === 1) {
        uni.openChannelsEvent({
          finderUserName: channelsId,
          eventId: eventId
        })
      }
    },
  }
}
</script>

<style lang="stylus" scoped>
@import '../../styles/var'
.channels-page {
  background: #f2f4f5;
  min-height: 100vh;
  padding-bottom: 32rpx;
  box-sizing: border-box;
}

.channels-header {
    position: relative;
    overflow: hidden;
    padding: 32rpx 32rpx 0;
}

.channels-header::before {
  content: '';
  position: absolute;
  bottom: -180rpx;
  left: -160rpx;
  z-index: -1;
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  border: 120rpx solid #f7f7f7;
}

.channels-header::after {
  content: '';
  position: absolute;
  top: -300rpx;
  right: -200rpx;
  z-index: -1;
  width: 300rpx;
  height: 300rpx;
  border-radius: 50%;
  border: 160rpx solid #f7f7f7;
}

.channels-header .channels-user {
    display: flex;
    align-items: center;
}

.channels-header .channels-user .channels-logo {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    border: 8rpx solid #FFF;
    box-shadow: 4px 16px 30px -8px rgba(139, 161, 185, 0.6);
    margin-right: 40rpx;
}

.channels-header .channels-user .channels-name {
    font-size: 36rpx;
    font-weight: 500;
}

.channels-header .channels-user .channels-des {
    font-size: 28rpx;
    color: #999;
    margin-top: 4rpx;
}

.channels-card-wrap {
  margin-top: 60rpx;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
}

.channels-card {
  width: 331rpx;
  display: flex;
  margin: 24rpx 0;
  padding: 32rpx;
  box-sizing: border-box;
  border-radius: 24rpx;
  background: #fff;
}

.channels-card .channels-left {
  flex-shrink: 0;
  width: 50rpx;
  height: 50rpx;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg,#40d196, #64d5d9);
  margin-right: 16rpx;
}

.channels-card .channels-left.icon {
  background: linear-gradient(135deg,#37acfc, #38d3ef);
}

.channels-card .channels-left .iconfont {
  font-size: 30rpx;
  color: #FFF;
  line-height: 1;
}

.channels-card .channels-right .channels-title {
  font-size: 24rpx;
  font-weight: 500;
  color: #333;
}

.channels-card .channels-right {
  font-size: 24rpx;
  color:  #999;
}

.channels-content {
  margin: 0 32rpx;
  border-radius: 24rpx;
  background-color: #FFF;
  overflow: hidden;
}

/* 选项卡 */
.channels-navbar {
  height: 80rpx;
  padding: 10rpx 0;
  display: flex;
  box-shadow: 0px 4px 8px #f7f7f7;
  background: #fff;
  position: relative;
  border-bottom: 1rpx solid #EEE;
}

.channels-navbar .channels-navbar-item {
  width: 80rpx;
  padding: 20rpx 32rpx;
  text-align: center;
  color: #666;
}

.channels-navbar .channels-navbar-item.channels-navbar-item-on {
  font-size: 32rpx;
  color: #333;
}

.channels-navbar .channels-navbar-item.channels-navbar-item-on .channels-navbar-title {
  font-weight: 500;
}

.channels-navbar .channels-navbar-slider {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 40rpx;
  transition: all .3s;
}

.channels-navbar .channels-navbar-slider::before {
    content: '';
    width: 48rpx;
    height: 4rpx;
    background-color: #333;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
}

.channels-navbar .channels-navbar-slider-0 {
    transform: translateX(56rpx);
}

.channels-navbar .channels-navbar-slider-1 {
    transform: translateX(200rpx);
}

/* 左图模式 */
.channels-list {
    background: #f5f7f7;
}

.channels-list-item {
  position: relative;
  padding: 32rpx;
  overflow: hidden;
  background-color: #fff;
}

.channels-list-cover {
  position: absolute;
  right: 32rpx;
  top: 32rpx;
  width: 240rpx;
  height: 180rpx;
  /* margin-top: -90rpx; */
  border-radius: 12rpx;
  background: #f5f7f7;
}

.channels-list-cover channel-video {
  width: 240rpx;
  height: 180rpx;
}

.img-cover-video:after {
  content: '\e666';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: "iconfont" !important;
  font-weight: normal;
  font-size: 64rpx;
  color: #FFF;
}

.channels-list-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 180rpx;
  margin-right: 270rpx;
}

.channels-list-title {
  margin-bottom: 20rpx;
}

.channels-list-title .txt {
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 30rpx;
  line-height: 1.4;
  font-weight: 500;
  color: #333;
}

.channels-list-des {
  margin-right: 40rpx;
  color: #959595;
  font-size: 24rpx;
}

.channels-list-des .txt:not(:last-child) {
  margin-right: 32rpx;
}
</style>
