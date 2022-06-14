<template>
  <view class="page">
    <ArticleList
      v-for="c in listData"
      :key="c.id"
      :item="c"
    />
  </view>
</template>

<script>
import ArticleList from "@/components/article-list"
export default {
  components: {
    ArticleList,
  },
  data() {
    return {
      curType: '1', // 1 我的浏览  2 我的评论 3 我的点赞  4 我的赞赏 5 我的订阅
      listData: [],
    }
  },
  onLoad(e) {
    this.curType = e.type || '1'
    this.initData()
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    this.listData = []
    this.getList()
  },

  methods: {
    initData() {
      let typeList = ['我的浏览', '我的评论', '我的点赞', '我的赞赏', '我的订阅']
      uni.setNavigationBarTitle({
        title: typeList[this.curType - 1]
      })

      this.getList()
    },

    async getList() {
      let t = this.curType
      let listData = []
      let res = ''
      let params = {
        openid: wx.getStorageSync('openid') || '',
        apptype: 'wx',
      }

      if (t === '1') {
        listData = uni.getStorageSync('readLogs') || []
      }
      if (t === '2') {
        res = await this.$api.getCommentArticle(params)
        listData = (res.data || []).map(m => ({
          id: m.post_id,
          title: m.post_title,
          img: m.post_medium_image,
        }))
      }
      if (t === '3') {
        res = await this.$api.getLikeArticle(params)
        listData = (res.data || []).map(m => ({
          id: m.post_id,
          title: m.post_title,
          img: m.post_medium_image,
        }))
      }
      if (t === '4') {
        res = await this.$api.getPraiseArticle(params)
        listData = (res.data || []).map(m => ({
          id: m.post_id,
          title: m.post_title,
          img: m.post_medium_image,
        }))
      }
      if (t === '5') {
        res = await this.$api.getSubscribeArticle(params)
        listData = (res.usermetaList || []).map(m => ({
          id: m.ID,
          title: m.post_title,
          img: m.post_medium_image,
        }))
      }
      this.listData = listData

      // if (res.code === '200') {
      //   let list = res.data || []
      //   this.listData = list
      // } else {
      //   this.$tips.toast(res.message || '出错啦')
      // }
    },

    // 跳转文章列表
    goto(e) {
      let url = '/pages/common/detail?id=' + e.id
      uni.navigateTo({
        url,
      })
    },
  },
}
</script>

<style lang="stylus" scoped>
  @import '../../styles/var'

  .header
    position relative
    background #fff
    margin-bottom 40rpx
    .cover
      width 100%
      height 240rpx
      display block
      filter brightness(88%)
    .des
      font-size 30rpx
      color #fff
      position absolute
      top 50%
      left 50%
      transform translate(-50%, -50%)

</style>
