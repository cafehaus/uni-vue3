<template>
  <view class="page setting">
    <view class="wrapper">
      <!-- 页面内容 -->
      <view class="excerpt">
        <mp-html
          content="{{ pageData.post_content }}"
          bindlinktap="wxParseTagATap"
          copy-link="{{false}}"
          selectable="{{true}}"
          lazy-load="{{true}}"
          markdown="{{true}}"
        />
      </view>

      <!-- 赞赏 -->
      <view class="praisePost">
        <view style="text-align: center">
          <button
            class="praise-button"
            formType="submit"
            size="mini"
            bindtap="praise"
          >
            赞赏鼓励
          </button>
          <modal
            title="{{dialog.title}}"
            hidden="{{dialog.hidden}}"
            no-cancel
            bindconfirm="confirm"
            >{{ dialog.content }}</modal
          >
        </view>

        <!-- 头像 -->
        <view class="praiseTitle">
          <view style="margin-top: 15rpx">
            <text>感谢以下赞赏鼓励的朋友们</text>
          </view>
        </view>
        <view class="praiseText">
          <block wx:key="id" wx:for="{{praiseList}}">
            <image src="{{item}}" class="gravatarLikeImg"></image>
          </block>
        </view>
      </view>
    </view>

    <!-- 企业信息 -->
    <view class="company" wx:if="{{pageData.raw_qyname}}">
      <!-- 地图 -->
      <view class="map" bindtap="openMap">
        <map
          id="myMap"
          style="width: 100%; height: 420rpx"
          latitude="{{pageData.raw_latitude}}"
          longitude="{{pageData.raw_longitude}}"
          markers="{{markers}}"
          show-location
        ></map>
      </view>

      <view class="company-info">
        <text class="name" wx:if="{{pageData.raw_qyname}}">{{
          pageData.raw_qyname
        }}</text>
        <view bindtap="openMap" wx:if="{{pageData.raw_address}}">
          地址
          <text>{{ pageData.raw_address }}</text>
        </view>
        <view bindtap="phoneCall" wx:if="{{pageData.raw_tel}}">
          电话
          <text>{{ pageData.raw_tel }}</text>
        </view>
        <view wx:if="{{pageData.raw_email}}">
          邮箱
          <text>{{ pageData.raw_email }}</text>
        </view>
        <view wx:if="{{pageData.raw_workday}}">
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
            bindtap="gotowebpage"
          >
            进入网站
          </button>
        </view>
      </view>
    </view>

    <!-- 版权信息 -->
    <view class="copyright" style="display:{{floatDisplay}}">
      <template is="tempCopyright" data="{{copyright}}" />
    </view>

    <!-- 联系客服 -->
    <w-contact />
  </view>
</template>

<script>
export default {
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
      this.fetchData();
      wx.getSystemInfo({
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

    praise: function () {
      var self = this;
      var minAppType = app.globalData.wx_enterprise_minapp;
      var system = self.data.system;
      var postid = self.data.pageData.ID;
      if (minAppType == "1" && system == 'Android') {
        if (self.data.openid) {
          wx.navigateTo({
            url: '../pay/pay?flag=2&openid=' + self.data.openid + '&postid=' + postid
          })
        }
        else {
          Auth.checkSession(self, 'isLoginNow');
        }
      }
      else {

        var src = app.globalData.wx_praiseQrCode;
        wx.previewImage({
          urls: [src],
        });

      }

    },
    onPullDownRefresh: function () {
      var self = this;
      self.setData({
        display: 'none',
        pageData: {},
      

      });

      this.fetchData();
      //消除下刷新出现空白矩形的问题。
      wx.stopPullDownRefresh()

    },

    phoneCall: function () {
      wx.makePhoneCall({
        phoneNumber: this.data.pageData.raw_tel
      })
    },
    openMap: function () {
      var self = this;
      wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success(res) {
          const latitude = parseFloat(self.data.pageData.raw_latitude);
          const longitude = parseFloat(self.data.pageData.raw_longitude);
          wx.openLocation({
            latitude,
            longitude,
            scale: 28
          })
        }
      })

    },
    gotowebpage: function () {
      var self = this;
      var minAppType =  app.globalData.wx_enterprise_minapp;
      var url = '';
      if (minAppType == "1") {
        url = '../webpage/webpage?';
        wx.navigateTo({
          url: url
        })
      }
      else {
        self.copyLink(config.getDomain);
      }

    },
    copyLink: function (url) {
      //this.ShowHideMenu();
      wx.setClipboardData({
        data: url,
        success: function (res) {
          wx.getClipboardData({
            success: function (res) {
              wx.showToast({
                title: '链接已复制',
                image: '../../images/src/link.png',
                duration: 2000
              })
            }
          })
        }
      })
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
      let self = this
      let url
      let fileType

      // 如果是a标签href中插入的文档
      let src = e.currentTarget.dataset.src
      let docType
      let isDoc = /\.(doc|docx|xls|xlsx|ppt|pptx|pdf)$/.test(src)

      if (src && isDoc) {
        url = src
        fileType = /doc|docx|xls|xlsx|ppt|pptx|pdf$/.exec(src)[0]
      } else {
        url = e.currentTarget.dataset.filelink
        fileType = e.currentTarget.dataset.filetype
      }

      wx.downloadFile({
        url: url,
        success: function (res) {
          const filePath = res.tempFilePath
          wx.openDocument({
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
      let redirectype = e.currentTarget.dataset.redirectype
      let path = e.currentTarget.dataset.path
      let url = e.currentTarget.dataset.url
    

      if (redirectype == 'apppage') { //跳转到小程序内部页面         
        wx.navigateTo({
          url: path
        })
      } else if (redirectype == 'webpage') //跳转到web-view内嵌的页面
      {
        url = '../webpage/webpage?url=' + url;
        wx.navigateTo({
          url: url
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
    },
    agreeGetUser: function (e) {
      var userInfo = e.detail.userInfo;
      var self = this;
      if (userInfo) {
        auth.getUsreInfo(e.detail);
        self.setData({ userInfo: userInfo });
      }
      setTimeout(function () {
        self.setData({ isLoginPopup: false })
      }, 1200);
    },
    closeLoginPopup() {
      this.setData({ isLoginPopup: false });
    },
    openLoginPopup() {
      this.setData({ isLoginPopup: true });
    },
    fetchData: function () {
      var self = this;
      var getPageRequest = wxRequest.getRequest(Api.getAboutPage());
      getPageRequest.then(response => {
        wx.setNavigationBarTitle({
          title: response.data.post_title
        })
        console.log(response.data);

        self.setData({
          pageData: response.data,
          display: 'block'
        })

        // 地图覆盖物
        let res = response.data
        if (res.raw_latitude && res.raw_longitude) {
          var marker = {}
          var markers = []
          marker.latitude = parseFloat(res.raw_latitude)
          marker.longitude = parseFloat(res.raw_longitude)
          marker.id = 1
          marker.name = res.post_title
          markers.push(marker)
          self.setData({
            markers: markers
          })
        }


      }).then(res => {
        var getAllPraiseRequest = wxRequest.getRequest(Api.getAllPraiseUrl());
        getAllPraiseRequest.then(response => {

          if (response.data.status == '200') {

            var _avatarurls = response.data.avatarurls;
            var avatarurls = [];
            for (var i = 0; i < _avatarurls.length; i++) {
              var avatarurl = "../../images/src/gravatar.png";
              if (_avatarurls[i].avatarurl.indexOf('wx.qlogo.cn') != -1) {
                avatarurl = _avatarurls[i].avatarurl;
              }
              avatarurls[i] = avatarurl;
            }

            self.setData({
              praiseList: avatarurls
            });

          }
          else {
            console.log(response);
          }


        })

      })
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
