<template>
  <view class="page setting">
    <view class="wrapper">
      <!-- 页面内容 -->
      <view class="excerpt">
        <mp-html
          :content="pageData.post_content"
          @click="wxParseTagATap"
          :copy-link="false"
          :selectable="true"
          :lazy-load="true"
          :markdown="true"
        />
      </view>

      <!-- 赞赏 -->
      <view class="praisePost">
        <view style="text-align: center">
          <button
            class="praise-button"
            formType="submit"
            size="mini"
            @click="onPraise"
          >
            赞赏鼓励
          </button>
        </view>

        <!-- 头像 -->
        <view class="praiseTitle">
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
        <view class="web">
          网站：{{ website }}
          <button
            class="btn-web"
            formType="submit"
            size="mini"
            @click="gotowebpage"
          >
            进入网站
          </button>
        </view>
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
      copyright: app.globalData.copyright,
      website: config.getDomain
    }
  },
  computed: {
    ...mapState('app', ['appInfo', 'systemInfo'])
  },
  onLoad() {
    this.initData()
  },

  methods: {
    initData() {
      // code
    },

    onLoad: function (options) {
      var self = this
      this.setData({copyright: app.globalData.copyright})

      Auth.setUserInfoData(self)
      Auth.checkLogin(self);
      this.fetchData()
      this.getPraiseUser()
      uni.getSystemInfo({
        success: function (t) {
          var system = t.system.indexOf('iOS') != -1 ? 'iOS' : 'Android';
          self.setData({ system: system });
        }
      })

      // 设置系统分享菜单
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
      })
    },

    // 自定义分享朋友圈
    onShareTimeline: function () {
      return {
        title: '关于“' + app.globalData.appName + '”微信小程序'
      }
    },

    onShareAppMessage: function () {
      return {
        title: '关于“' + app.globalData.appName + '”微信小程序',
        path: 'pages/about/about'
      }
    },

    onPullDownRefresh: function () {
      var self = this;
      self.setData({
        display: 'none',
        pageData: {},
      });

      this.fetchData()
      this.getPraiseUser()
      //消除下刷新出现空白矩形的问题。
      wx.stopPullDownRefresh()

    },

    phoneCall: function () {
      uni.makePhoneCall({
        phoneNumber: this.data.pageData.raw_tel
      })
    },
    openMap: function () {
      var self = this

      // #ifdef MP-WEIXIN
      wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success(res) {
          const latitude = parseFloat(self.pageData.raw_latitude)
          const longitude = parseFloat(self.pageData.raw_longitude)
          wx.openLocation({
            latitude,
            longitude,
            scale: 28
          })
        }
      })
      // #endif
    },
    gotowebpage: function () {
      if (this.appInfo.isCompany) {
        uni.navigateTo({
          url: '/pages/common/web?url=' + this.website
        })
      } else {
        this.copyLink(this.website)
      }

    },
    copyLink: function (url) {
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
          let openid = uni.getStorageSync('openid') || ''
          uni.navigateTo({
            url: '../common/pay?flag=1&openid=' + openid + '&postid=' + this.pageData.ID
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
    // a标签跳转和复制链接
    wxParseTagATap(e) {
      let self = this
      let href = e.currentTarget.dataset.src
      let domain = config.getDomain
      let redirectype = e.currentTarget.dataset.redirectype
      let path = e.currentTarget.dataset.path
      // 判断a标签src里是不是插入的文档链接
      let isDoc = /\.(doc|docx|xls|xlsx|ppt|pptx|pdf)$/.test(href)

      if (isDoc) {
        this.openLinkDoc(e)
        return
      }

      if (redirectype) {
        if (redirectype == 'apppage') { //跳转到小程序内部页面
          wx.navigateTo({
            url: path
          })
        } else if (redirectype == 'webpage') //跳转到web-view内嵌的页面
        {
          href = '../webpage/webpage?url=' + href;
          wx.navigateTo({
            url: href
          })
        }
        else if (redirectype == 'miniapp') //跳转其他小程序
        {

            // 根据平台取appid
            let appid = '';
            let _appid =e.currentTarget.dataset.appid;
            if(util._isEmpty(_appid))
            {
              console.log("appid 为空");
              return;
            }
            let appidList = _appid.split(',')
            if(appidList.length<1)
            {
              console.log("appid 错误");
              return;
            }
            let id = appidList.find(m => /^weixin-.*/.test(m)) || ''
            if (!util._isEmpty(_appid)) appid = id.replace('weixin-', '')

            if(!util._isEmpty(appid))
            {
              wx.navigateToMiniProgram({
                appId: appid,
                path: path
              })

            }
            else
            {
              console.log("appid 错误");
              return;
            }
        }
        return
      }

      //可以在这里进行一些路由处理
      if (href.indexOf(domain) == -1) {
        wx.setClipboardData({
          data: href,
          success: function (res) {
            wx.getClipboardData({
              success: function (res) {
                wx.showToast({
                  title: '链接已复制',
                  //icon: 'success',
                  image: '../../images/src/link.png',
                  duration: 2000
                })
              }
            })
          }
        })
      } else {
        var slug = util.GetUrlFileName(href, domain);
        if (slug == 'index') {
          wx.switchTab({
            url: '../index/index'
          })
        } else {
          var getPostSlugRequest = wxRequest.getRequest(Api.getPostBySlug(slug));
          getPostSlugRequest
            .then(res => {
              if (res.statusCode == 200) {
                if (res.data.length != 0) {
                  var postID = res.data[0].id;
                  var openLinkCount = wx.getStorageSync('openLinkCount') || 0;
                  if (openLinkCount > 4) {
                    wx.redirectTo({
                      url: '../detail/detail?id=' + postID
                    })
                  } else {
                    wx.navigateTo({
                      url: '../detail/detail?id=' + postID
                    })
                    openLinkCount++;
                    wx.setStorageSync('openLinkCount', openLinkCount);
                  }
                } else {
                  var minAppType =  app.globalData.wx_enterprise_minapp;
                  var url = '../webpage/webpage'
                  if (minAppType == "1") {
                    url = '../webpage/webpage';
                    wx.navigateTo({
                      url: url + '?url=' + href
                    })
                  } else {
                    self.copyLink(href);
                  }
                }
              }
            })
        }
      }
    },

    // 打开文档
    openLinkDoc(e) {
      let url
      let fileType

      // 如果是a标签href中插入的文档
      let src = e.currentTarget.dataset.src
      let isDoc = /\.(doc|docx|xls|xlsx|ppt|pptx|pdf)$/.test(src)

      if (src && isDoc) {
        url = src
        fileType = /doc|docx|xls|xlsx|ppt|pptx|pdf$/.exec(src)[0]
      } else {
        url = e.currentTarget.dataset.filelink
        fileType = e.currentTarget.dataset.filetype
      }

      uni.downloadFile({
        url: url,
        success: function (res) {
          const filePath = res.tempFilePath
          uni.openDocument({
            filePath: filePath,
            fieldType: fileType
          })
        },
        fail: function (error) {
          console.log('下载文档失败:' + error)
        }
      })
    },

    // 短代码跳转
    wxParseToRedict(e) {
      let type = e.currentTarget.dataset.redirectype
      let path = e.currentTarget.dataset.path
      let url = e.currentTarget.dataset.url
      let appid =e.currentTarget.dataset.appid
      this.$util.goto({
        type,
        path,
        url,
        appid
      })
    },

    async fetchData() {
      const res = await this.$api.getAboutPage()
      uni.setNavigationBarTitle({
        title: res.post_title
      })

      this.pageData = res.data

      // 地图覆盖物
      let r = response.data
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
        this.$tips.tost(res.message || '出错啦')
      }
    }
  },
}
</script>

<style lang="stylus" scoped>
.page
  background #fff
.wrapper
  padding 5rpx
/* 页面正文内容 */
.excerpt
  color #626262
  font-size 32rpx
  line-height 64rpx
  text-align left
.h2
  clear both
  border-width 1px 0
  color #666
  text-align center
  font-size 28rpx
  line-height 64rpx
  font-weight bold
.clearfix
  margin 5px 15px
  display inline-block
.wxParse-a
  color #21759b
.wxParse-p
  margin-top 0.8em
  margin-bottom 0.8em
.wxParse-p image
  margin 0 auto
  width 100% !important
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
.company-info > .web
  display flex
  align-items center
.btn-web
  width 200rpx
  height 60rpx
  border-radius 36rpx
  font-size 30rpx
  color #fd8f45
  background-color #fff
  line-height 56rpx !important
  border 2rpx solid #fd8f45
  margin 0
.btn-web::after
  border none
</style>
