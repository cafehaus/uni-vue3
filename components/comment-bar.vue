<template>
  <view>
    <template v-if="showBar">
      <view class="comment-box">
        <image src="@/static/detail_home.png" class="icon-img" @click="goHome" />

        <view class="input-box">
          <input
            class="input"
            type="text"
            confirm-type="send"
            cursor-spacing="10"
            maxlength="100"
            :value="content"
            :placeholder="placeholder"
            :focus="focus"
            @blur="onReplyBlur"
            @focus="onRepleyFocus"
          />
          <button class="btn-submit" @click="submit">发送</button>
        </view>

        <button
          class="btn-share"
          hover-class="none"
          @click="showSharePopup"
        >
          <image src="@/static/detail_share.png" class="icon-img" />
        </button>
      </view>

      <!-- 弹出层 -->
      <view
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
      </view>
    </template>

    <!-- 当在后台关闭评论功能时，显示出单独的分享按钮 -->
    <button v-else class="circle-share" hover-class="none" @click="showSharePopup">
      <image class="icon-img" src="@/static/detail_share.png"></image>
    </button>
  </view>
</template>

<script>
export default {
  name: 'comment-bar',
  props: {
    placeholder: {
      type: String,
      default: '请输入评论',
    },
    showBar: { // 是否显示评论输入框
      type: Boolean,
      default: true,
    },
  },
  computed: {
    isImage() {
      return this.icon.includes('/')
    },
  },
  data() {
    return {
      showPopup: false,
      content: '',
      focus: false,
    }
  },
  methods: {
    submit() {

    },

    showSharePopup() {
      this.showPopup = true
    },

    onCreatePoster() {

    },

    goHome() {

    },

    onReplyBlur() {

    },

    onRepleyFocus() {

    },
  },
}
</script>

<style lang="stylus" scoped>

.comment-box
  padding 20rpx
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
      width 100rpx
      height 80rpx
      line-height 80rpx
      border-bottom-left-radius 0
      border-top-left-radius 0
      border-top-right-radius 40rpx
      border-bottom-right-radius 40rpx
      text-align center
      font-size 15px
      background-color #fff
      color #959595
      padding 0
      &::after
        border none

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
