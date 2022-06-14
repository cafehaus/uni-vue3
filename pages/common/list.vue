<template>
  <view class="page">
    <view v-if="type < 4" class="header">
      <image class="img" :src="info.img" mode="aspectFill" />
      <view class='info'>
        <view class="des">
          <text>{{ info.des }}</text>
        </view>
        <view v-if="info.count" class="num">共有 {{ info.count }} 篇文章</view>
      </view>
    </view>

    <ArticleList :article-list="articleList" />
  </view>
</template>

<script>
  import ArticleList from '@/components/article-list'
  export default {
    components: {
      ArticleList
    },
    data() {
      return {
        type: '1', // 1 分类 2 标签 3 搜索 4 我的浏览 5 我的评论 6 我的点赞 7 我的订阅
        curId: '',
        articleList: [],
        info: {},

        page: {
          index: 1,
          size: 5
        },
        isLastPage: false,
        isPullDown: false
      }
    },
    onLoad(e) {
      this.curId = e.id || ''
      this.type = e.type || '1'
      this.initData()
    },

    // 下拉刷新
    onPullDownRefresh() {
      this.articleList = []
      this.page.index = 1
      this.isPullDown = true
      this.isLastPage = false

      this.getCateArticle()
    },

    // 上拉加载
    onReachBottom() {
      if (this.isLastPage) {
        uni.showToast({
          icon: 'none',
          title: '已经是最后一页了',
          duration: 1000
        })
        return
      }

      this.page.index++
      this.getCateArticle()
    },

    methods: {
      initData() {
        // 分类
        if (this.type === '1') {
          this.getCategoryInfo()
          this.getCateArticle()
        }

        // 标签
        if (this.type === '2') {
          this.getTagDetail()
          this.getTagArticle()
        }
      },

      // 获取分类
      async getCateArticle() {
        const res = await this.$api.getArticleList({
          orderby: 'date',
          order: 'desc',
          page: this.page.index,
          per_page: this.page.size,
          categories: this.curId
        })

        if (res.length) {
          this.articleList.push(...res)
        }

        if(this.isPullDown) {
          uni.stopPullDownRefresh()
          this.isPullDown = false
        }

        if ((res.length < 5) || (res.code === 'rest_post_invalid_page_number')) {
          this.isLastPage = true
        }
      },

      // 获取分类信息
      async getCategoryInfo() {
        const res = await this.$api.getCategoryInfo(this.curId)
        this.info = {
          ...res,
          img: res.category_thumbnail_image || this.$config.defaultImg,
          des: res.description,
        }

        // 设置页面标题
        uni.setNavigationBarTitle({
          title: res.name
        })
      },

      async getTagDetail() {
        // per_page=' + pageCount + '&orderby=date&order=desc&page=' + args.page + '&tags=' + args.tag
        const res = await this.$api.getTagDetail(this.curId)
        this.info = {
          ...res,
          img: res.tag_thumbnail_image || this.$config.defaultImg,
          des: res.name,
        }

        // 设置页面标题
        uni.setNavigationBarTitle({
          title: res.name
        })
      },

      async getTagArticle() {
        const res = await this.$api.getTagArticle({
          per_page: this.page.size,
          page: this.page.index,
          orderby: 'date',
          order: 'desc',
          tags: this.curId
        })
        let data = res.data || []
        data = data(m => {
          m.post_thumbnail_image = m.post_thumbnail_image || this.$config.defaultImg
          m.date = this.$util.fmtDate(res.date, 'yyyy-MM-dd')
        })
        if (data.length) {
          this.articleList.push(...data)
        }

        // 设置页面标题
        uni.setNavigationBarTitle({
          title: res.name
        })
      },

      // 搜索
      async searchArticle() {
        const res = await this.$api.getCateArticle({
          orderby: 'date',
          order: 'desc',
          page: this.page.index,
          per_page: this.page.size,
          search: this.curId
        })

        if (res.length) {
          this.articleList.push(...res)
        }

        if(this.isPullDown) {
          uni.stopPullDownRefresh()
          this.isPullDown = false
        }

        if ((res.length < 5) || (res.code === 'rest_post_invalid_page_number')) {
          this.isLastPage = true
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
@import '../../styles/var'

.header
  position relative
  overflow hidden
  background #f4f6f9
  .img
    display block
    width 100%
    height 240rpx
    filter brightness(88%)
  .info
    position absolute
    z-index 2
    left 50%
    top 50%
    transform translate(-50%, -50%)
    text-align center
    vertical-align middle
    width 90%
    .des
      font-size 30rpx
      font-weight 500
      line-height 1.4
      color #fff
      margin-bottom 16rpx
      multi-nowarp(2)
    .num
      font-size 24rpx
      line-height 24rpx
      color #fff
      margin-bottom 24rpx  
 
</style>
