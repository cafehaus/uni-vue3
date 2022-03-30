<template>
  <div class="page article-detail">
    <h2 class="article-title">{{ title }}</h2>
    <!-- <Parser :html="content" class="article-content" /> -->
    <rich-text :nodes="content" />
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
        articleId: '',

        title: '',
        content: ''
      }
    },
    onLoad() {
      this.initData()
    },

    methods: {
      initData() {
        console.log(this.$route)
        this.articleId = this.$route.query.id
        this.getArticleDetail()
      },

      // 获取文章详情
      async getArticleDetail() {
        const res = await this.$api.getArticleDetail(this.articleId)
        this.content = res.content.rendered
        this.title = res.title.rendered
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
