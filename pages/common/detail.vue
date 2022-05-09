<template>
  <div class="page detail">
    <h2 class="article-title">{{ title }}</h2>
    <section class="article-date">
      <text class="txt">{{ info.dateName }}</text>
      <i v-if="info.category_name" class="iconfont icon-cate" />
      <text v-if="info.category_name" class="txt">{{ info.category_name }}</text>
      <i class="iconfont icon-comment" />
      <text class="txt">{{ commentNum }}</text>
      <i class="iconfont icon-preview" />
      <text class="txt">{{ info.pageviews }}</text>
      <i class="iconfont icon-like" />
      <text class="txt">{{ likeNum }}</text>
    </section>

    <mpHtml :content="content" />
    <!-- <rich-text :nodes="content" /> -->

    <!-- 点赞 -->
    <section class="like">
      <view class="btn" :class="{'btn-active': isLike}" @click="onLike">
        <i class="iconfont" :class="[isLike ? 'icon-zan-fill' : 'icon-zan']" />
        <text class="txt">{{ isLike ? '已点赞' : '点个赞' }}</text>
      </view>
      <view class="num"><text>{{ likeNum }} 人已赞</text></view>
      <view class="avatar">
        <view class="avatar-item" v-for="(item, i) in info.avatarurls" :key="i">
          <image class="img" :src="item.avatarurl" />
          <image class="icon" :src="`/static/${item.userTypeImg.split('-')[1]}`" />
        </view>
      </view>
    </section>

    <!-- 文章标签 -->
    <section v-if="info.tag_name && info.tag_name.length" class="tag">
      <view class="tag-item" v-for="tag in info.tag_name" :key="tag.term_id">
        <view class="txt">#{{ tag.name }}</view>
      </view>
    </section>

    <!-- 阅读原文和鼓励 -->
    <section class="origin">
      <text class="txt">阅读原文</text>
      <view class="praise">
        <text>鼓励</text>
        <i class="iconfont icon-lucky-money" />
      </view>
    </section>

    <!-- 上下文 -->
    <section class="pre-next">
      <view v-if="info.preArticle && info.preArticle.id" class="pre">
        <view class="des">
          <text>上一篇</text>
          <view class="title">{{info.preArticle.title}}</view>
        </view>
        <image class="img" :src="info.preArticle.img" mode="aspectFill" />
      </view>

      <view v-if="info.nextArticle && info.nextArticle.id" class="next">
        <view class="des">
          <text>下一篇</text>
          <view class="title">{{ info.nextArticle.title }}</view>
        </view>
        <image class="img" :src="info.nextArticle.img" mode="aspectFill" />
      </view>
    </section>

    <!-- 猜你喜欢 -->
    <section v-if="tagArticle.length" class="tag-article">
      <view class="subtitle">猜你喜欢</view>
      <view class="item" v-for="item in tagArticle" :key="item.id">
        <view class="title">{{ item.idx }}. {{ item.title }}</view>
        <image class="img" :src="item.img" mode="aspectFill"></image>
      </view>
    </section>

    <!-- 评论 -->
    <view class="subtitle">
      <view>评论交流</view>
      <view v-if="commentNum" class="num">有{{ commentNum }}条评论</view>
    </view>
    <CommentItem
      v-for="c in commentList"
      :key="c.id"
      :item="c"
    />
  </div>
</template>

<script>
  import mpHtml from '@/components/mp-html/mp-html'
  import CommentItem from '@/components/comment-item'
  export default {
    components: {
      mpHtml,
      CommentItem,
    },
    data() {
      return {
        articleId: '',
        info: {},
        title: '',
        content: '',
        page: {
          index: 1,
          size: 10
        },
        commentList: [],
        commentNum: 0,
        likeNum: 0,
        tagList: [],
        tagArticle: [],
        isLike: false,
      }
    },
    onLoad() {
      this.initData()
    },

    methods: {
      initData() {
        this.articleId = this.$route.query.id
        this.getArticleDetail()
        this.getArticleComment()
      },

      onLike() {

      },

      getIsLike() {
        // if (self.data.openid) {
        //   var data = {
        //     openid: self.data.openid,
        //     postid: self.data.postID
        //   };
        //   var url = Api.postIsLikeUrl();
        //   var postIsLikeRequest = wxRequest.postRequest(url, data);
        //   postIsLikeRequest
        //     .then(response => {
        //       if (response.data.status == '200') {
        //         self.setData({
        //           likeImag: "like-on.png"
        //         });
        //       }
        //     })
      },

      // 获取文章详情
      async getArticleDetail() {
        const res = await this.$api.getArticleDetail(this.articleId)
        let info = {
          ...res,
          preArticle: {
            title: res.previous_post_title,
            id: res.previous_post_id,
            img: res.previous_post_image || this.$config.defaultImg,
          },
          nextArticle: {
            title: res.next_post_title,
            id: res.next_post_id,
            img: res.next_post_image || this.$config.defaultImg,
          },
          dateName: this.$util.fmtDate(res.date, 'yyyy-MM-dd'),
        }
        this.info = info
        this.content = info.content.rendered
        this.title = info.title.rendered
        this.commentNum = info.total_comments || 0
        this.likeNum = info.like_count || 0
        this.tagList = info.tag_name || []

        // 根据标签获取相关文章
        if (this.tagList.length) {
          let tagIds =  res.tags.join(',')
          this.getTagArticle(tagIds)
        }

        // 缓存浏览记录
        this.setReadLog(info)
      },

      setReadLog(info) {
        if (!this.title && !this.content) return

        let logs = this.$storage('readLogs') || []
        // 过滤重复值
        if (logs.length > 0) {
          logs = logs.filter(m =>  m.id !== this.articleId)
        }
        // 最多20条
        if (logs.length > 19) {
          logs.pop()
        }
        let info = {
          id: this.articleId,
          total_comments: this.commentNum,
          pageviews: info.pageviews,
          like_count: this.likeNum,
          title: this.title,
          post_medium_image: info.post_medium_image || $config.defaultImg
        }
        logs.unshift(info)
        this.$storage('readLogs', logs)
      },

      async getArticleComment() {
        let params = {
          postid: this.articleId,
          limit: this.page.size || 10,
          page: this.page.index || 1,
          order: 'desc',
        }
        const res = await this.$api.getArticleComment(params)
        if (res.status === '200') {
          this.commentList = res.data || []
        } else {
          this.$tips.toast(res.message || '请求失败')
        }
      },

      async getTagArticle(tags) {
        let params = {
          exclude: this.articleId,
          per_page: 5,
          page: 1,
          tags,
        }
        const res = await this.$api.getTagArticle(params)
        let list = res || []
        this.tagArticle = list.map((m,i) => {
          m.idx = i + 1
          m.img = m.post_medium_image || this.$config.defaultImg
          m.title = (m.title && m.title.rendered) || ''

          return m
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
@import '../../styles/var'

.detail
  padding 0 40rpx
  .article-title
    font-size 20px
    font-weight 600
    margin 40rpx 0 20rpx
  .article-date
    font-size 24rpx
    line-height 1
    color #959595
    margin-bottom 30rpx
    display flex
    align-items center
    .iconfont
      margin-right 8rpx
      font-size 24rpx
      color #c4c4c4
    .txt
      margin-right 40rpx

  .article-content
    line-height 1.6

  // 点个赞
  .like
    margin 80rpx 0
    .btn
      width 200rpx
      height 64rpx
      display flex
      justify-content center
      align-items center
      font-size 28rpx
      font-weight 500
      color #959595
      line-height 64rpx
      border 1px solid #959595
      border-radius 32rpx
      margin 0 auto
      &.btn-active
        color $base-color
        border-color $base-color
      .iconfont
        font-size 36rpx
        margin-right 6rpx
    .num
      font-size 28rpx
      color #959595
      text-align center
      margin-top 48rpx
      text
        display inline-block
        position relative
        &::before
          content ''
          display block
          width 100rpx
          height 1px
          background #eee
          position absolute
          left -120rpx
          top 50%
        &::after
          content ''
          display block
          width 100rpx
          height 1px
          background #eee
          position absolute
          right -120rpx
          top 50%
    .avatar
      display flex
      justify-content center
      flex-wrap wrap
      margin 0 auto
      margin-left -20rpx
      margin-top 20rpx
      .avatar-item
        position relative
        display inline-block
        padding-left 20rpx
        padding-bottom 20rpx
        width 60rpx
        overflow visible
        .img
          vertical-align top
          border-radius 16rpx
          height 60rpx
          width 60rpx
        .icon
          width 30rpx
          height 30rpx
          position absolute
          right -5rpx
          bottom 15rpx
          border-radius 50%
          border 1px solid #fff

  // 标签
  .tag
    display flex
    flex-wrap wrap
    margin 32rpx 0 0
    .tag-item
      color #4c4c4c
      font-size 26rpx
      font-weight 500
      margin-right 40rpx
      margin-bottom 20rpx
      .txt
        nowrap()

  // 阅读原文赞赏
  .origin
    display flex
    justify-content space-between
    align-items center
    font-size 28rpx
    color #959595
    line-height 1
    margin 30rpx 0 0
    .txt
      color $link
    .praise
      display flex
      align-items center
      .iconfont
        font-size 30rpx
        color $red
        margin-left 12rpx

  // 公共小标题
  .subtitle
    font-size 30rpx
    font-weight 500
    color #4c4c4c
    display flex
    justify-content space-between
    border-bottom 1rpx solid #e6e6e6
    position relative
    margin 40rpx 0
    padding-bottom 20rpx
    &::before
      content ''
      display block
      width 54rpx
      height 4rpx
      background #959595
      position absolute
      left 0
      bottom -2rpx
    .num
      font-size 26rpx 

  // 上下文
  .pre-next
    font-size 28rpx
    line-height 1.5
    color #fff
    margin 40rpx 0 0
    :not(:first-child)
      margin-top 12rpx
    .img
      width 100%
      height 180rpx
      filter brightness(80%)
      background #f5f7f7
    .pre,
    .next
      width 100%
      height 180rpx
      position relative
      overflow hidden
      .des
        width 610rpx
        position absolute
        top 50%
        left 0
        transform translateY(-50%)
        z-index 2
        margin 0 30rpx
        >text
          font-weight 200
          font-size 26rpx
          line-height 1
        .title
          multi-nowrap(2)
    .next
      text-align right

  // 猜你喜欢
  .tag-article
    margin 20rpx 0
    .item
      display flex
      justify-content space-between
      align-items center
      margin-bottom 40rpx
      .title
        flex 1
        font-size 28rpx
        line-height 1.8
        color #4c4c4c
        margin-right 30rpx
        multi-nowrap(2)
      .img
        width 200rpx
        height 120rpx
        display block

</style>
