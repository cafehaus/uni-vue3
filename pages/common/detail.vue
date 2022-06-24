<template>
  <view class="page detail">
    <view class="ad-box" v-if="wxAd.detailAdId && wxAd.detailAd == '1'">
      <ad :unit-id="wxAd.detailAdId"></ad>
    </view>

    <!-- 自定义广告 -->
    <CustomAd v-else from="detail" />

    <h2 class="article-title">{{ title }}</h2>
    <section class="article-date">
      <text class="txt">{{ info.dateName }}</text>
      <i v-if="info.category_name" class="iconfont icon-cate" />
      <text v-if="info.category_name" class="txt">{{
        info.category_name
      }}</text>
      <i class="iconfont icon-comment" />
      <text class="txt">{{ commentNum }}</text>
      <i class="iconfont icon-preview" />
      <text class="txt">{{ info.pageviews }}</text>
      <i class="iconfont icon-like" />
      <text class="txt">{{ likeNum }}</text>
    </section>

    <mpHtml :content="content" />

    <!-- <view class="read-more" wx:if="{{detailSummaryHeight != ''}}">
      <view class="read-more-mask">
        <view class="read-more-btn" @click="readMore">{{ wxAd.isShowExcitation ? '观看视频,' : '' }}阅读更多</view>
      </view>
    </view> -->

    <!-- 点赞 -->
    <section class="like">
      <!-- #ifdef MP-WEIXIN ||  MP-ALIPAY || MP-QQ || MP-TOUTIAO || MP-BAIDU -->
      <view class="btn" :class="{ 'btn-active': isLike }" @click="onLike">
        <i class="iconfont" :class="[isLike ? 'icon-zan-fill' : 'icon-zan']" />
        <text class="txt">{{ isLike ? '已点赞' : '点个赞' }}</text>
      </view>
      <!-- #endif -->
      <view class="num" v-if="likeNum"><text>{{ likeNum }} 人已赞</text></view>
      <view class="avatar">
        <view class="avatar-item" v-for="(item, i) in likeList" :key="i">
          <image class="img" :src="item.avatarurl" />
          <image v-if="item.userType === 'weixin'" class="icon" src="/static/weixin.jpg" />
          <image v-else-if="item.userType === 'qq'" class="icon" src="/static/qq.jpg" />
          <image v-else-if="item.userType === 'toutiao'" class="icon" src="/static/toutiao.jpg" />
          <image v-else-if="item.userType === 'baidu'" class="icon" src="/static/baidu.jpg" />
          <image v-else-if="item.userType === 'alipay'" class="icon" src="/static/alipay.jpg" />
          <image v-else class="icon" src="/static/web.jpg" />
        </view>
      </view>
    </section>

    <!-- 文章标签 -->
    <section v-if="info.tag_name && info.tag_name.length" class="tag">
      <view class="tag-item" v-for="tag in info.tag_name" :key="tag.term_id" @click="goTagDetail(tag)">
        <view class="txt">#{{ tag.name }}</view>
      </view>
    </section>

    <!-- 阅读原文和鼓励 -->
    <section class="origin">
      <text class="txt" @click="gotoWeb">阅读原文</text>
      <view class="praise" @click="onPraise">
        <text>鼓励</text>
        <i class="iconfont icon-lucky-money" />
      </view>
    </section>

    <view class="ad-box-video" v-if="wxAd.videoAdId !='' && wxAd.detailAd == '1'">
      <ad :unit-id="wxAd.videoAdId" ad-type="video" ad-theme="white"></ad>
    </view>

    <!-- 上下文 -->
    <section class="pre-next">
      <view v-if="info.preArticle && info.preArticle.id" class="pre" @click="goDetail(info.preArticle.id)">
        <view class="des">
          <text>上一篇</text>
          <view class="title">{{ info.preArticle.title }}</view>
        </view>
        <image class="img" :src="info.preArticle.img" mode="aspectFill" />
      </view>

      <view v-if="info.nextArticle && info.nextArticle.id" class="next" @click="goDetail(info.nextArticle.id)">
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
      <view class="item" v-for="item in tagArticle" :key="item.id" @click="goDetail(item.id)">
        <view class="title">{{ item.idx }}. {{ item.title }}</view>
        <image class="img" :src="item.img" mode="aspectFill"></image>
      </view>
    </section>

    <!-- 评论 -->
    <template v-if="showBdComment">
      <view class="subtitle">
        <view>在百度APP里评论交流</view>
      </view>
      <comment-list
        :comment-param="commentParam"
        add-comment
        is-page-scroll
        need-toolbar
        :toolbar-config="toolbarInfo"
        @clickcomment="goCommentDetail"
      />
    </template>
    <template v-else>
      <view class="subtitle">
        <view>在WordPress里评论交流</view>
        <view v-if="commentNum" class="num">有{{ commentNum }}条评论</view>
      </view>
      <CommentItem v-for="c in commentList" :key="c.id" :item="c" @reply="handleReply" />
      <w-empty v-if="empty" />
    </template>

    <!-- 评论框 -->
    <!-- #ifdef MP-WEIXIN || MP-QQ || MP-TOUTIAO || MP-BAIDU -->
    <CommentBar :show-bar="canComment" :article="info" :reply-user="replyUser" @success="commentSuccess" />
    <!-- #endif -->
  </view>
</template>

<script>
import { mapState } from 'vuex'
import mpHtml from '@/components/mp-html/mp-html'
import CommentItem from '@/components/comment-item/comment-item'
import CommentBar from '@/components/comment-bar'
import CustomAd from '@/components/custom-ad'

export default {
  components: {
    mpHtml,
    CommentItem,
    CommentBar,
    CustomAd,
  },
  data() {
    return {
      articleId: '',
      info: {},
      title: '',
      content: '',
      page: {
        index: 1,
        size: 10,
      },
      commentList: [],
      empty: false,
      commentNum: 0,
      likeNum: 0,
      tagList: [],
      tagArticle: [],
      isLike: false,
      likeList: [],
      replyUser: null,
      canComment: true,
      showBdComment: false,
      commentParam: {},
      toolbarInfo: {},

      wxAd: {
        isShowExcitation: false, // 是否启用激励视频
        detailAd: '',
        videoAdId: '',
        excitationAdId: ''
      }
    }
  },
  computed: {
    ...mapState('app', ['appInfo', 'systemInfo']),
    showBdComment() {
      let bdInfo = this.appInfo.bdInfo || {}
      let flag = bdInfo.enableInteraction === '1'
      // #ifndef MP-BAIDU
      flag = false
      // #endif

      return flag
    }
  },
  onLoad(e) {
    this.articleId = e.id
    this.initData()
  },

  methods: {
    initData() {
      this.getArticleDetail()
      this.getArticleComment()
      this.getCanComment()
      this.getIsLike()
    },

    async onLike() {
      if (this.$user.isLogin()) {
        if (this.isLike) return

        let params = {
          openid: uni.getStorageSync('openid') || '',
          postid: this.articleId,
        }

        const res = await this.$api.submitLike(params)
        if (res.status == '200') {
          this.likeNum = this.likeNum + 1
          let userType = 'web'
          // #ifdef MP-WEIXIN
          userType = 'weixin'
          // #endif
          // #ifdef MP-ALIPAY
          userType = 'alipay'
          // #endif
          // #ifdef MP-BAIDU
          userType = 'baidu'
          // #endif
          // #ifdef MP-TOUTIAO
          userType = 'toutiao'
          // #endif
          // #ifdef MP-QQ
          userType = 'qq'
          // #endif

          let user = uni.getStorageSync('userInfo') || {}
          this.likeList.unshift({
            avatarurl: user.avatarUrl,
            userType,
          })

          this.isLike = true
          this.$tips.success('谢谢点赞')
        } else if (res.status === '501') {
          this.$tips.success('谢谢，已赞过啦！')
        }
      } else {
        this.$user.login('navigateTo')
      }
    },

    async getIsLike() {
      if (this.$user.isLogin()) {
        let params = {
          openid: uni.getStorageSync('openid') || '',
          postid: this.articleId,
        }
        const res = await this.$api.getIsLike(params)
        if (res.status == '200') {
          this.isLike = true
        } else {
          this.isLike = false
        }
      }
    },

    async getCanComment() {
      const res = await this.$api.getCanComment()
      this.canComment = res.enableComment === '1'
    },

    commentSuccess() {
      this.replyUser = null
      this.page.index = 1
      this.getArticleComment()
    },

    // 获取文章详情
    async getArticleDetail() {
      let key = 'wxexcitation'
      // #ifdef MP-WEIXIN
      key = 'wxexcitation'
      // #endif
      // #ifdef MP-ALIPAY
      key = 'alexcitation'
      // #endif
      // #ifdef MP-BAIDU
      key = 'bdexcitation'
      // #endif
      // #ifdef MP-TOUTIAO
      key = 'ttexcitation'
      // #endif
      // #ifdef MP-QQ
      key = 'qqexcitation'
      // #endif
      this.$tips.loading()
      const res = await this.$api.getArticleDetail(
        {
          id: this.articleId,
        },
        { header: { [key]: '1' } }
      )
      this.$tips.loaded()
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

      let likeList = info.avatarurls || []
      this.likeList = likeList.map(m => {
        let curUserTypeArr = m.userTypeImg.split('-') || []
        let curUserType = curUserTypeArr[1] || ''
        m.userType = curUserType.replace('.jpg', '')

        return m
      })

      // 小程序广告
      this.wxAd = {
        isShowExcitation: res.wxExcitation === 1,
        detailAd: res.wxdetailAd,
        videoAdId: res.wxVideoAdId,
        detailAdId: res.wxdetailAdId,
        excitationAdId: res.wxExcitationAdId
      }

      // 百度互动组件
      this.commentParam = {
        snid: this.articleId,
        path: '/pages/comment/detail?id=' + this.articleId,
        title: this.title,
        openid: uni.getStorageSync('openid') || ''
      }
      getApp().commentParam = commentParam
      this.toolbarInfo = {
        placeholder: '评论...',
        moduleList: ['comment', 'like', 'favor', 'share'],
        share: {
          title: this.title,
          imageUrl: info.post_medium_image || this.$config.defaultImg,
          path: '/pages/common/detail?id=' + this.articleId
        }
      }

      // 设置页面标题
      this.$uni.setTitle(this.title)

      // 根据标签获取相关文章
      if (this.tagList.length) {
        let tagIds = res.tags.join(',')
        this.getTagArticle(tagIds)
      }

      // 缓存浏览记录
      this.setReadLog(info)
    },

    goCommentDetail(e) {
      let srid = e.data.srid
      let url = '/pages/common/comment-detail?srid=' + srid + '&id=' + this.articleId + "&title=" + this.title
      uni.navigateTo({
          url: url
      })
    },

    setReadLog(info) {
      if (!this.title && !this.content) return

      let logs = this.$storage('readLogs') || []
      // 过滤重复值
      if (logs.length > 0) {
        logs = logs.filter((m) => m.id !== this.articleId)
      }
      // 最多20条
      if (logs.length > 19) {
        logs.pop()
      }
      let obj = {
        id: this.articleId,
        total_comments: this.commentNum,
        pageviews: info.pageviews,
        like_count: this.likeNum,
        title: this.title,
        img: info.post_medium_image || this.$config.defaultImg,
      }
      logs.unshift(obj)
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
        let list = res.data || []
        this.commentList = list
        this.empty = !list.length
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
      this.tagArticle = list.map((m, i) => {
        m.idx = i + 1
        m.img = m.post_medium_image || this.$config.defaultImg
        m.title = (m.title && m.title.rendered) || ''

        return m
      })
    },

    onPraise() {
      // #ifdef MP-WEIXIN
      if (this.appInfo.isCompany && this.systemInfo.osName === 'Android') {
        if (this.$user.isLogin()) {
          let openid = uni.getStorageSync('openid') || ''
          uni.navigateTo({
            url: '../common/pay?flag=1&openid=' + openid + '&postid=' + this.articleId
          })
        } else {
          this.$user.login('navigateTo')
        }
      } else {
        uni.previewImage({
          urls: [this.appInfo.qrCode],
        })
      }
      // #endif

      // #ifndef MP-WEIXIN
      uni.previewImage({
        urls: [this.appInfo.qrCode],
      })
      // #endif
    },

    // 跳转文章
    goDetail(id) {
      uni.navigateTo({
        url: '/pages/common/detail' + '?id=' + id
      })
    },

    // 跳转标签列表
    goTagDetail(tag) {
      uni.navigateTo({
        url: '/pages/common/list' + '?type=2&id=' + tag.term_id
      })
    },

    // 去网页
    gotoWeb() {
      if (this.appInfo.isCompany) {
        let url = '/pages/common/web'
        uni.navigateTo({
          url: url + '?url=' + this.info.link
        })
      } else {
        this.copyLink(this.info.link)
      }
    },

    // 复制链接
    copyLink(url) {
      uni.setClipboardData({
        data: url,
        success: function(res) {
          uni.getClipboardData({
            success: function(res) {
              this.$tips.toast('链接已复制')
              // wx.showToast({
              //   title: '链接已复制',
              //   image: '../../images/src/link.png',
              //   duration: 2000
              // })
            }
          })
        }
      })
    },

    handleReply(e) {
      this.replyUser = e
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '../../styles/var'

.detail
  padding 0 40rpx
  padding-bottom calc(120rpx + env(safe-area-inset-bottom))
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
    .pre, .next
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

  .read-more
    width 100%
    // position absolute
    // bottom 0
    .read-more-mask
      height 200rpx
      width 100%
      box-sizing border-box
      background-image linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 96%)
    .read-more-btn
      width 280rpx
      height 64rpx
      font-size 30rpx
      font-weight 500
      line-height 1
      text-align center
      color #fd8f45
      position absolute
      bottom 0
      left 50%
      transform translateX(-50%)
      &::after
        content ''
        display inline-block
        border solid #fd8f45
        border-width 0 0 2px 2px
        padding 3px
        position absolute
        right 50%
        bottom 6rpx
        transform translateX(4px) rotate(-45deg)
        opacity 0.6

  /* 小程序广告 */
  .ad-box
    width 100%
    overflow hidden
  .ad-box-video
    padding 40rpx 40rpx 0
    margin 0 auto
    position relative
    z-index 1
  ad
    z-index 1 !important

</style>
