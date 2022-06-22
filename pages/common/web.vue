<template>
  <web-view :src="url" />
</template>

<script>
  export default {
    data() {
      return {
        url: null,
        title: ''
      }
    },
 
    onLoad(options) {
      if (options.url) {
        let url = decodeURIComponent(options.url)
        if (url.indexOf('*') != -1) {
          url = url.replace("*", "?");
        }
        this.url = url
      } else {
        this.url = this.$config.api
      }

      // 设置系统分享菜单
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
      })
      this.initData()
    },

    // 自定义分享朋友圈
    onShareTimeline: function () {
      return {
        title: '分享"' + app.globalData.appName + '"的文章' + this.data.title,
        query: {
          url: this.data.url
        }
      }
    },

    onShareAppMessage: function (options) {
      var self = this;
      var url = options.webViewUrl
      if (url.indexOf("?") != -1) {
        url = url.replace("?", "*");
      }
      url = 'pages/webpage/webpage?url=' + url;
      return {
        title: '分享"' + app.globalData.appName + '"的文章' + self.data.title,
        path: url
      }
    },

    methods: {
      initData() {
      },
    }
  }
</script>

<style lang="stylus" scoped>
@import '../../styles/var'

</style>
