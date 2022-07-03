<template>
  <view class="page">
    <view class="header">
      <image
        src="@/static/comments_bg.jpg"
        class="cover"
        mode="aspectFill"
      ></image>
      <view class="des">点击可跳转至相关文章查看</view>
    </view>

    <view class="content">
      <CommentItem
        v-for="c in listData"
        :key="c.id"
        :item="c"
        @goto="goto"
      />
    </view>
  </view>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import CommentItem from '@/components/comment-item/comment-item'

export default {
  components: {
    CommentItem,
  },
  data() {
    return {
      listData: [],
    }
  },
  computed: {
    ...mapState('app', ['appInfo'])
  },

  onLoad() {
    this.initData()
    this.getCpAd('comment')

    this.$util.setShareMenu()
  },

  onShareTimeline: function () {
    return {
      title: this.appInfo.appName + '的最新评论'
    }
  },

  onShareAppMessage: function () {
    return {
      title: '分享“' + this.appInfo.appName + '”的最新评论',
      path: 'pages/common/comment'
    }
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    this.listData = []
    this.getList()
  },

  methods: {
    ...mapActions('app', ['getCpAd']),

    initData() {
      this.getList()
    },

    async getList() {
      const res = await this.$api.getCommentList({
        limit: 20,
        page: 1,
      })

      if (res.status === '200') {
        let list = res.data || []
        this.listData = list
      } else {
        this.$tips.toast(res.message || '出错啦')
      }
    },

    // 跳转文章列表
    goto(e) {
      let url = '/pages/common/detail?id=' + e.postid
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

  .content
    padding 0 32rpx
</style>
