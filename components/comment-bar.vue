<template>
  <view>
    <view v-if="showBar" class="comment-box">
      <image src="@/static/detail_home.png" class="icon-img" @click="goHome" />
      <view class="input" @click="onComment">请输入评论...</view>
      <button
        class="btn-share"
        hover-class="none"
        open-type="share"
      >
        <image src="@/static/detail_share.png" class="icon-img" />
      </button>
    </view>
    <button v-else class="circle-share" hover-class="none"  open-type="share">
      <image class="icon-img" src="@/static/detail_share.png"></image>
    </button>

    <view v-show="showInput" class="textarea-box">
      <view class="textarea-mask" @click="cancel"></view>
      <view class="textarea-inner">
        <view class="textarea-header">
          <text class="textarea-header-btn" @click.stop="cancel">取消</text>
          <text class="textarea-header-btn" @click.stop="submit">发送</text>
        </view>
        <textarea
          class="textarea"
          maxlength="140"
          cursor-spacing="80"
          v-model="content"
          :placeholder="placeholder"
          :focus="focus"
          :auto-height="false"
          fixed
          :show-confirm-bar="false"
        />
      </view>
    </view>
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
      // placeholder: '请输入评论',
      focus: false,
      showInput: false,
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

    onComment() {
      if (!this.$user.isLogin()) {
        this.$user.login('navigateTo')
        return
      }
      this.focus = false
      this.showInput = true
      this.$nextTick(() => {
        this.focus = true
      })
    },

    cancel() {
      this.focus = false
      this.showInput = false
      this.$emit('cancel')
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
        this.focus = false
        this.showInput = false
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
  .input
    flex 1
    background-color #f4f6f9
    padding 0 24rpx
    margin 0 40rpx
    font-size 14px
    height 80rpx
    line-height 80rpx
    color #999
    border-radius 40rpx

.textarea-box
  .textarea-mask
    position fixed
    top 0
    bottom 0
    left 0
    right 0
    background transparent
    z-index 3
  .textarea-inner
    position fixed
    bottom 0
    left 0
    right 0
    background-color #fff
    border-top-left-radius 40rpx
    border-top-right-radius 40rpx
    box-shadow 0 0 20px rgba(30, 20, 20, 0.2)
    z-index 102
    .textarea-header
      padding 0 40rpx
      height 100rpx
      display flex
      justify-content space-between
      align-items center
      border-bottom 1rpx solid #eee
      .textarea-header-btn
        height 70rpx
        line-height 70rpx
        font-size 15px
        color #4c4c4c
        background transparent
        margin 0
        padding 0
    .textarea
      padding 20rpx 40rpx
      width 670rpx

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
