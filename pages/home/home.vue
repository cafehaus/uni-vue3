<template>
  <view class="page">
    <!-- 轮播 -->
    <VSwiper :swiper-list="swiperList" />

    <!-- 精选栏目 -->
    <NiceColumn :nav-list="navList" />

    <!-- 搜索 -->
    <VSearch v-if="showSearch" from="home" />

    <!-- 标签 -->
    <VTag v-if="showTag" :tag-list="tagList" />

    <!-- 自定义广告 -->
    <CustomAd v-if="!isKS" from="home" />

    <!-- 视频号 -->
    <!-- #ifdef  MP-WEIXIN || APP-PLUS -->
    <VideoChannels />
    <!-- #endif -->

    <!-- 文章列表 -->
    <ArticleList :article-list="articleList" />
  </view>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import ArticleList from '@/components/article-list'
import CustomAd from '@/components/custom-ad'
import VideoChannels from '@/components/video-channels'
import VSwiper from './components/v-swiper'
import NiceColumn from './components/nice-column'
import VSearch from './components/v-search'
import VTag from './components/v-tag'

export default {
  components: {
    ArticleList,
    CustomAd,
    VideoChannels,
    VSwiper,
    NiceColumn,
    VSearch,
    VTag,
  },
  data() {
    return {
      swiperList: [],
      navList: [],
      tagList: [],

      articleList: [],
      page: {
        index: 1,
        size: 5,
      },
      isLastPage: false,
      isPullDown: false,
    }
  },
  computed: {
    ...mapState('user', ['isLogin', 'userInfo']),
    ...mapState('app', ['appInfo']),
    isKS() { // 快手
      return this.$config.isKS
    },
    showSearch() {
      let ksInfo = this.appInfo.ksInfo || {}
      return !this.isKS || (this.isKS && ksInfo.enableseach === '1')
    },
    showTag() {
      let ksInfo = this.appInfo.ksInfo || {}
      return !this.isKS || (this.isKS && ksInfo.enablehometag === '1')
    },
  },
  onLoad() {
    this.initData()

    // 插屏广告
    this.getCpAd('home')
    this.$util.setShareMenu()
  },
  onShow() {
    // #ifdef MP-BAIDU
    this.getBaiduSeo()
    // #endif
  },

  onShareTimeline: function () {
    return {
      title: this.appInfo.appName
    }
  },

  onShareAppMessage: function () {
    return {
      title: '分享“' + this.appInfo.appName + '”小程序',
      path: 'pages/home/home'
    }
  },

  onPullDownRefresh() {
    this.articleList = []
    this.page.index = 1
    this.isPullDown = true
    this.isLastPage = false

    this.getArticleList()
  },

  onReachBottom() {
    if (this.isLastPage) {
      this.$tips.toast('已经是最后一页了')
      return
    }

    this.page.index++
    this.getArticleList()
  },
  methods: {
    ...mapMutations('user', ['setUserInfo']),
    ...mapActions('user', ['getUserInfo']),
    ...mapActions('app', ['getCpAd']),

    initData() {
      this.getOptionsExpand()
      this.getTagList()
      this.getArticleList()
    },

    // 轮播/精选
    async getOptionsExpand() {
      const res = await this.$api.getOptionsExpand()
      let appType = this.$config.appType === 'ks' ? 'kuaishou' : this.$config.appType
      let swiperKey = appType + '_swipe_nav'
      let navKey = appType + '_selected_nav'
      let swiperList = res.expand.swipe_nav || [] || []
      let navList = res.expand.selected_nav || []

      if (this.$config.isH5 || this.isKS) {
        this.swiperList = swiperList.filter(m => (m.type === 'apppage' && m.path !== '/pages/live/live') || (m.type === 'webpage'))
        this.navList = navList.filter(m => (m.type === 'apppage' && m.path !== '/pages/live/live') || (m.type === 'webpage'))
      } else {
        this.swiperList = swiperList
        this.navList = navList
      }
    },

    // 标签
    async getTagList() {
      const res = await this.$api.getTagList({
        per_page: 7,
        page: 1,
        orderby: 'count',
        order: 'desc',
      })
      this.tagList = res || []
    },

    // 百度 seo
    async getBaiduSeo() {
      const res = await this.$api.getBaiduSeo()
      if (res.status === '200') {
        this.$util.setPageInfo({
          title:  res.bd_home_title,
          keywords: res.bd_home_keywords,
          description: res.bd_home_description,
          image: res.bd_home_img
        })
      }
    },

    // 获取文章列表
    async getArticleList() {
      const res = await this.$api.getHomeArticle({
        page: this.page.index,
        per_page: this.page.size,
        orderby: 'date',
        order: 'desc',
      })

      if (res && res.length && Array.isArray(res)) {
        this.articleList.push(...res)
      } else {
        this.$tips.toast('出错了，请稍后再试')
      }

      if (this.isPullDown) {
        uni.stopPullDownRefresh()
        this.isPullDown = false
      }

      if (res.length < 5 || res.code === 'rest_post_invalid_page_number') {
        this.isLastPage = true
      }
    },

    // 跳转
    goto(info) {
      this.$util.goto(info)
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '../../styles/var'
.page
  .logo
    height 200rpx
    width 200rpx
    margin-top 200rpx
    margin-left auto
    margin-right auto
    margin-bottom 50rpx
  .user
    font-size 36rpx
    color $base-color
    text-align center

</style>
