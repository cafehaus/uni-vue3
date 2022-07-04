<template>
  <view class="page setting">
    <view class="wrapper">
      <!-- 页面内容 -->
      <view class="excerpt">
        <mp-html :content="pageData.post_content" />
      </view>

      <!-- 赞赏 -->
      <view class="praisePost">
        <!-- #ifndef MP-BAIDU  -->
        <view style="text-align: center">
          <button
            class="praise-button"
            size="mini"
            @click="onPraise"
          >
            赞赏鼓励
          </button>
        </view>
        <!-- #endif  -->

        <!-- 头像 -->
        <view class="praiseTitle" v-if="praiseList.length">
          <view style="margin-top: 15rpx">
            <text>感谢以下赞赏鼓励的朋友们</text>
          </view>
        </view>
        <view class="praiseText">
          <block :key="index" v-for="(item, index) in praiseList">
            <image :src="item" class="gravatarLikeImg"></image>
          </block>
        </view>
      </view>
    </view>

    <!-- 企业信息 -->
    <view class="company" v-if="pageData.raw_qyname">
      <!-- 地图 -->
      <!-- #ifdef MP-WEIXIN -->
      <view class="map" @click="openMap">
        <map
          id="myMap"
          style="width: 100%; height: 420rpx"
          :latitude="pageData.raw_latitude"
          :longitude="pageData.raw_longitude"
          :markers="markers"
          show-location
        ></map>
      </view>
      <!-- #endif -->

      <view class="company-info">
        <text class="name" v-if="pageData.raw_qyname">{{ pageData.raw_qyname }}</text>
        <view @click="openMap" v-if="pageData.raw_address">
          地址
          <text>{{ pageData.raw_address }}</text>
        </view>
        <view bindtap="phoneCall" v-if="pageData.raw_tel">
          电话
          <text>{{ pageData.raw_tel }}</text>
        </view>
        <view v-if="pageData.raw_email">
          邮箱
          <text>{{ pageData.raw_email }}</text>
        </view>
        <view v-if="pageData.raw_workday">
          工作时间
          <text>{{ pageData.raw_workday }}</text>
        </view>

        <!-- 进入网站 -->
        <!-- #ifndef MP-BAIDU  -->
        <view class="web">
          <text class="url">网站：{{ website }}</text>
          <view class="btn-web" @click="goWeb">进入网站</view>
        </view>
        <!-- #endif  -->
      </view>
    </view>

    <!-- 联系客服 -->
    <w-contact />
  </view>
</template>

<script>
import { mapState } from 'vuex'
import mpHtml from '@/components/mp-html/mp-html'

export default {
  components: {
    mpHtml,
  },
  data() {
    return {
      title: '页面内容',
      pageData: {},
      pagesList: {},
      display: 'none',

      praiseList: [],
      markers: [],
      dialog: {
        title: '',
        content: '',
        hidden: true
      },
      userInfo: {},
      isLoginPopup: false,
      openid: "",
      system: "",
      // copyright: app.globalData.copyright,
      // website: config.getDomain,
      copyright: '',
      website: this.$config.api
    }
  },
  computed: {
    ...mapState('app', ['appInfo', 'systemInfo'])
  },
  onLoad() {
    this.initData()

    this.$util.setShareMenu()
  },

  onShareTimeline: function () {
    return {
      title: '关于“' + this.appInfo.appName 
    }
  },

  onShareAppMessage: function () {
    return {
      title: '关于“' + this.appInfo.appName ,
      path: 'pages/common/about'
    }
  },

  methods: {
    initData() {
      this.getData()
      this.getPraiseUser()
    },

    async getData() {
      const res = await this.$api.getAboutPage()
      uni.setNavigationBarTitle({
        title: res.post_title
      })

      this.pageData = res || {}

      // 地图覆盖物
      let r = res || {}
      if (r.raw_latitude && r.raw_longitude) {
        var marker = {}
        var markers = []
        marker.latitude = parseFloat(r.raw_latitude)
        marker.longitude = parseFloat(r.raw_longitude)
        marker.id = 1
        marker.name = res.post_title
        markers.push(marker)
        this.markers = markers
      }
    },

    async getPraiseUser() {
      const res = await this.$api.getPraiseUser()
      if (res.status == '200') {
        let _avatarurls = res.avatarurls || []
        let avatarurls = []
        for (let i = 0; i < _avatarurls.length; i++) {
          let avatarurl = '/static/avatar.png'
          if (_avatarurls[i].avatarurl.indexOf('wx.qlogo.cn') != -1) {
            avatarurl = _avatarurls[i].avatarurl
          }
          avatarurls[i] = avatarurl
        }
        this.praiseList = avatarurls
      } else {
        this.$tips.toast(res.message || '出错啦')
      }
    },

    phoneCall() {
      uni.makePhoneCall({
        phoneNumber: this.pageData.raw_tel
      })
    },

    openMap() {
      // #ifdef MP-WEIXIN
      uni.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success: (res) => {
          const latitude = parseFloat(this.pageData.raw_latitude)
          const longitude = parseFloat(this.pageData.raw_longitude)
          uni.openLocation({
            latitude,
            longitude,
            scale: 28
          })
        }
      })
      // #endif
    },

    goWeb() {
      if (this.appInfo.isCompany) {
        uni.navigateTo({
          url: '/pages/common/web?url=' + this.website
        })
      } else {
        this.copyLink(this.website)
      }
    },

    copyLink(url) {
      uni.setClipboardData({
        data: url,
        success: function (res) {
          uni.getClipboardData({
            success: function (res) {
              this.$tips.toast('接已复制')
            }
          })
        }
      })
    },

    onPraise() {
      // #ifdef MP-WEIXIN
      if (this.appInfo.isCompany && this.systemInfo.osName === 'Android') {
        if (this.$user.isLogin()) {
          let openid = this.$storage('openId') || ''
          uni.navigateTo({
            url: '/pages/common/pay?flag=1&openid=' + openid + '&postid=' + this.pageData.ID
          })
        } else {
          this.$user.login('navigateTo')
        }
      } else {
        uni.previewImage({
          urls: [this.appInfo.qrCode],
        })
      }
      // #endif

      // #ifndef MP-WEIXIN
      uni.previewImage({
        urls: [this.appInfo.qrCode],
      })
      // #endif
    },
  },
}
</script>

<style lang="stylus" scoped>
.page
  background #fff
  padding 20rpx 32rpx
.wrapper
  padding 5rpx
/* 页面正文内容 */
.excerpt
  color #626262
  font-size 32rpx
  line-height 64rpx
  text-align left

/* 赞赏 */
.praisePost
  position relative
  text-align left
  margin-bottom 30rpx
.praiseTitle
  text-align center
  font-weight normal
  line-height 40rpx
  margin-top 50rpx
  margin-bottom 20rpx
  font-size 28rpx
  color #959595 !important
  vertical-align middle
  height 70rpx
  border-radius 30rpx
.praiseText
  text-align center
  margin-left -12rpx
.img-like
  width 50rpx
  height 50rpx
  display inline-block
  text-align center
  margin-right 20rpx
  margin-top 8rpx
.gravatarLikeImg
  margin-top 12rpx
  border-radius 16rpx
  height 64rpx
  width 64rpx
  margin-left 24rpx
.praise-button
  width 240rpx
  height 72rpx
  border-radius 36rpx
  font-size 30rpx
  color #fff
  line-height 72rpx !important
  background-color #fe7373
  margin-top 32rpx
.praise-button::after
  border none
/* 企业信息 */
.company-info
  padding-bottom calc(env(safe-area-inset-bottom) + 20rpx)
.company-info > .name
  display block
  font-size 16px
  font-weight 500
  text-align center
  margin 40rpx 0
.company-info > view
  font-size 15px
  line-height 3
  color #999
  display flex
  justify-content space-between
.company-info > view:not(:last-child)
  border-bottom 1rpx solid #eee
.company-info > view > text
  color #333
/* 进入网站 */
.company-info
  .web
    display flex
    align-items center
    .url
      word-break break-all
      color #999
    .btn-web
      flex-shrink 0
      width 180rpx
      height 60rpx
      border-radius 36rpx
      font-size 30rpx
      color #fd8f45
      text-align center
      background-color #fff
      line-height 56rpx !important
      border 2rpx solid #fd8f45
      margin 0
      &::after
        border none
</style>
