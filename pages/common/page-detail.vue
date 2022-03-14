<template>
  <div class="page article-detail">
    <h2 class="article-title">{{ title }}</h2>
    <!-- <Parser :html="content" class="article-content" /> -->
  </div>
</template>

<script>
  // import Parser from "@/components/jyf-parser/jyf-parser"
  export default {
    components: {
      // Parser
    },
    data() {
      return {
        pageId: '',

        title: '',
        content: ''
      }
    },
    onLoad() {
      this.initData()
    },

    methods: {
      initData() {
        this.pageId = this.$Route.query.id
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
  .article-detail
    padding 0 40rpx
    .article-title
      font-size 20px
      font-weight 600
      margin 40rpx 0 20rpx
    // .article-content
    //   line-height 1.6

</style>
