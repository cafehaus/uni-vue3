<template>
  <view class="page history">
    <w-tabs
      :tabs="tabsList"
      :active-tab="activeIndex"
      @change="change"
    >
      <!-- 自定义广告 -->
      <CustomAd from="hot" />

      <ArticleList :empty="empty" :article-list="articleList" />
    </w-tabs>
  </view>
</template>

<script>
  import ArticleList from '@/components/article-list'
  import CustomAd from '@/components/custom-ad'
  import { mapState, mapActions } from 'vuex'

  export default {
    components: {
      ArticleList,
      CustomAd,
    },
    data() {
      return {
        tabsList: [
          { index: 0, name: '评论数', type: 'hotpostthisyear' },
          { index: 1, name: '浏览数', type: 'pageviewsthisyear' },
          { index: 2, name: '点赞数', type: 'likethisyear' },
          { index: 3, name: '鼓励数', type: 'praisethisyear' }
        ],

        activeIndex: 0,
        articleList: [],
        empty: false,
      }
    },

    computed: {
      ...mapState('app', ['appInfo']),
    },

    onLoad() {
      this.initData()
      this.getCpAd('hot')

      this.$util.setShareMenu()
    },

    onShareTimeline: function () {
      return {
        title: '分享“' + this.appInfo.appName + '”的热门文章'
      }
    },

    onShareAppMessage: function () {
      return {
        title: '分享“' + this.appInfo.appName + '”的热门文章',
        path: 'pages/hot/hot'
      }
    },

    methods: {
      ...mapActions('app', ['getCpAd']),

      initData() {
       this.getHotArticle()
      },

      // 获取热门文章
      async getHotArticle() {
        this.$tips.loading()
        const res = await this.$api.getHotArticle({
          type: this.tabsList[this.activeIndex].type
        })
        this.$tips.loaded()

        let list = res || []
        this.articleList = list.map(m => {
          m.title = m.post_title
          m.total_comments = m.comment_total
          m.id = m.post_id

          return m
        })
        this.empty = !list.length
      },

      change(index) {
        this.activeIndex = index
        this.getHotArticle()
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .page
    background #fff
</style>
