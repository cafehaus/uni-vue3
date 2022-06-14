<template>
  <view class="page detail">
    <h2 class="article-title">{{ title }}</h2>
    <mpHtml :content="content" />
  </view>
</template>

<script>
  import mpHtml from '@/components/mp-html/mp-html'
  export default {
    components: {
      mpHtml
    },
    data() {
      return {
        pageId: '',

        title: '',
        content: ''
      }
    },
    onLoad(e) {
      this.pageId = e.id
      this.initData()
    },

    methods: {
      initData() {
        this.getPageDetail()
      },

      // 获取wp页面详情
      async getPageDetail() {
        const res = await this.$api.getWpPageDetail(this.pageId)
        this.content = res.content.rendered
        this.title = res.title.rendered

        uni.setNavigationBarTitle({
          title: res.title.rendered || '页面详情'
        })
      },
    }
  }
</script>

<style lang="stylus" scoped>
  .detail
    padding 0 40rpx
    .article-title
      font-size 20px
      font-weight 600
      margin 40rpx 0 20rpx
    // .article-content
    //   line-height 1.6

</style>
