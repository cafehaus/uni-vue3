<template>
  <view>
    <view v-if="showBar" class="comment-box">
      <image src="@/static/detail_home.png" class="icon-img" @click="goHome" />

      <view class="input-box">
        <input
          class="input"
          type="text"
          confirm-type="send"
          cursor-spacing="10"
          maxlength="100"
          v-model="content"
          :placeholder="placeholder"
        />
        <text class="btn-submit" @click="submit">发送</text>
      </view>

      <!-- <button
        class="btn-share"
        hover-class="none"
        @click="showSharePopup"
      >
        <image src="@/static/detail_share.png" class="icon-img" />
      </button> -->
      <button
        class="btn-share"
        hover-class="none"
        open-type="share"
      >
        <image src="@/static/detail_share.png" class="icon-img" />
      </button>
    </view>

    <!-- 弹出层 -->
    <!-- <view
      v-show="showPopup"
      class="pop"
    >
      <view class="pop-title">立即分享</view>
      <view class="pop-content">
        <view class="share-item" @click="onCreatePoster">
          <image class="img" src="@/static/share_poster.png" />
          <view>生成海报</view>
        </view>

        <button class="share-item share-item-btn" open-type="share" hover-class="none">
          <image class="img" src="@/static/share_wechat.png" />
          <view>转发给好友</view>
        </button>
      </view>
    </view> -->

    <!-- 当在后台关闭评论功能时，显示出单独的分享按钮 -->
    <!-- <button v-else class="circle-share" hover-class="none" @click="showSharePopup">
      <image class="icon-img" src="@/static/detail_share.png"></image>
    </button> -->
    <button v-else class="circle-share" hover-class="none"  open-type="share">
      <image class="icon-img" src="@/static/detail_share.png"></image>
    </button>
  </view>
</template>

<script>
import uni from '../libs/uni'

export default {
  name: 'comment-bar',
  props: {
    showBar: {
      type: Boolean,
      default: true,
    },
    article: { // 文章信息
      type: Object,
      default: () => ({}),
    },
    replyUser: { // 回复用户信息
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      placeholder: '请输入评论',
      showPopup: false,
      content: '',
    }
  },

  computed: {
    placeholder() {
      if (this.replyUser && this.replyUser.userid) {
        return `回复 ${this.replyUser.author_name}：`
      } else {
        return '请输入评论'
      }
    }
  },

  methods: {
    submit() {
      console.log(this.replyUser)
      if (!this.content) {
        this.$tips.toast('请输入评论内容')
        return
      }

      if (this.$user.isLogin()) {
        // this.$emit('send', this.content)
        this.submitComment()
      } else {
        this.$user.login('navigateTo')
      }
    },

    showSharePopup() {
      this.showPopup = true
    },

    onCreatePoster() {

    },

    goHome() {
      uni.switchTab({
        url: '/pages/home/home'
      })
    },

    async submitComment() {
      const parent = this.replyUser ? this.replyUser.id : ''
      const postID = this.article.id
      const userid = this.replyUser ? this.replyUser.userid : ''
      let formId = this.replyUser ? this.replyUser.formId : ''
      if (formId === 'the formId is a mock one') {
        formId = ''
      }

      let user = this.$storage('userInfo') || {}
      let openid = this.$storage('openId') || ''
      let name = user.nickName
      let author_url = user.avatarUrl
      let email = openid + "@weixin.com"

      var data = {
        post: postID,
        author_name: name,
        author_email: email,
        content: this.content,
        author_url: author_url,
        parent: parent,
        openid: openid,
        userid: userid,
        formId: formId
      }

      const res = await this.$api.submitComment(data)
      if (res.status === '200') {
        this.$tips.toast(res.message || '评论成功')
        this.content = ''
        this.$emit('success')
      } else {
        this.$tips.toast('评论失败，请稍后重试')
      }
      // if (res.statusCode == 200) {
      //   if (res.data.status == '200') {
      //     this.$emit('success')
      //   } else if (res.data.status == '500') {
      //     this.$tips.toast('评论失败，请稍后重试')
      //   }
      // } else {
      //   if (res.data.code == 'rest_comment_login_required') {
      //     this.$tips.toast('需要开启在WordPress rest api 的匿名评论功能！')
      //   } else if (res.data.code == 'rest_invalid_param' && res.data.message.indexOf('author_email') > 0) {
      //     this.$tips.toast('email填写错误！')
      //   } else {
      //     this.$tips.toast('评论失败,' + res.data.message)
      //   }
      // }
    },
  },
}
</script>

<style lang="stylus" scoped>

.comment-box
  padding 20rpx 30rpx
  display flex
  justify-content space-between
  align-items center
  position fixed
  bottom 0
  left 0
  right 0
  background-color #fff
  box-shadow 0 0 6px rgba(30, 20, 20, 0.1)
  z-index 100
  padding-bottom calc(20rpx + env(safe-area-inset-bottom))
  .icon-img
    width 36rpx
    height 36rpx
  .btn-share
    width 36rpx
    height 36rpx
    padding 0
    margin 0
    line-height 36rpx
    &::after
      border none
  .input-box
    width 520rpx
    display flex
    align-items center
    .input
      background-color #f4f6f9
      padding 0 24rpx
      font-size 14px
      height 80rpx
      flex 1
      border-radius 40rpx
    .btn-submit
      padding 0 30rpx
      line-height 80rpx
      font-size 30rpx
      color #959595

// 分享弹出层
.pop
  .pop-title
    text-align center
    font-size 13px
    color #959595
    padding 40rpx 0
  .pop-content
    display flex
    .share-item
      flex 1
      font-size 14px
      font-weight 500
      color #333
      line-height 2
      text-align center
      padding-bottom 40rpx
      &.share-item-btn
        background #fff
        padding 0
        margin 0
        &::after
          border none
      .img
        width 60rpx
        height 60rpx

// 关闭评论功能时显示分享按钮
.circle-share
  width 88rpx
  height 88rpx
  border-radius 50%
  padding 0
  margin 0
  position fixed
  bottom 40rpx
  right 40rpx
  line-height 98rpx
  background-color #fff
  box-shadow 2px 4px 8px #ccc
  z-index 3
  &::after
    border none
  .icon-img
    width 36rpx
    height 36rpx

</style>
