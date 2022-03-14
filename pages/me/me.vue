<template>
  <view class="page my">
    <!-- 个人信息 -->
    <view class="user">
      <image class="user-img" :src="gravatar" mode="aspectFill" />

      <view class='user-info'>
        <view class='user-name' @click="login">
          <text>{{ userInfo.nickName || '立即登录' }}</text>
        </view>
        <view class='user-member'>
          <text>{{ userInfo.membername || '游客' }}</text>
          <text class="user-member-integral">{{ userInfo.integral || '0' }} 积分</text>
        </view>
      </view>
    </view>

    <!-- 列表 -->
    <view class="list">
      <view class="list-sub">
        <view class="list-item">我的浏览</view>

        <view class="list-item">我的评论</view>

        <view class="list-item">我的点赞</view>

        <view class="list-item">我的订阅</view>
      </view>

      <view class="list-sub">
        <!-- 关于我们 -->
        <view class="list-item" @click="goTo('about')">关于我们</view>

        <view class="list-item">
          <button openType="contact" class='list-item-btn'>联系客服</button>
        </view>
        <view class="list-item">
          <button open-type="feedback" class='list-item-btn'>意见反馈</button>
        </view>

        <view class="list-item" @click="clearStorage">清除缓存</view>
        <view v-if="islogin" class="list-item" @click="logout">退出登录</view>
      </view>
    </view>

    <!-- 确认弹窗 -->
    <van-dialog id="van-dialog" />
  </view>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    data() {
      const userInfo = this.$storage('userInfo')
      return {
        userInfo
      }
    },
    onLoad() {
      this.initData()
    },

    onShow() {
      if (this.$user.isLogin()) {
        this.getUserInfo()
      }
    },

    computed: {
      ...mapState(['islogin']),
      gravatar() { // 头像
        return this.userInfo.avatarUrl || '../../static/gravatar.png'
      }
    },

    methods: {
      initData() {
        // this.getUserInfo()
      },

      // 获取用户信息
      async getUserInfo() {
        let userId = this.$storage('userId')
        let sessionId = this.$storage('sessionId')
        const res = await this.$api.getUserInfo({
          sessionId,
          userId
        })

        // 错误
        if(res.code) {
          this.$tips.toast(res.message)
          return
        }

        let user = this.$storage('userInfo')
        user.integral = res.memberUserInfo.integral
        user.membername = res.memberUserInfo.membername

        this.userInfo = user
        this.$storage('userInfo', user)
      },

      // 登录
      login() {
        if(!this.$user.isLogin()) {
          this.$user.login()
        }
      },

      // 退出登录
      logout() {
        if (!this.$user.isLogin()) return

        this.$dialog.confirm({
          title: '提示',
          message: '您确定要退出登录吗？'
        })
          .then(() => {
            this.$user.logout()
            this.userInfo = {}
          })
          .catch(() => {
          })
      },

      // 清除缓存
      clearStorage() {

      },

      // 跳转
      goTo(e) {
        // 关于我们
        if (e === 'about') {
          uni.navigateTo({
            url: `/pages/common/page-detail?id=2`
          })
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
@import '../../styles/var'

  page
    background #f5f7f7
  .user
    display flex
    align-items center
    background-color #fff
    height 280rpx
    padding 0 40rpx
    .user-img
      width 128rpx
      height 128rpx
      border-radius 50%
      box-shadow 4px 12px 30px -8px rgba(139, 161, 185, 0.9)
    .user-info
      color #333
      margin-left 32rpx
      .user-name
        max-height 42rpx
        overflow hidden
        > text
          font-size 20px
          font-weight 500
          line-height 1
          overflow hidden
          text-overflow ellipsis
          display -webkit-box
          -webkit-line-clamp 1
          -webkit-box-orient vertical
      .user-member
        display flex
        flex-direction row
        align-items center
        margin-top 20rpx
        > text
          display block
          color #4c4c4c
          font-size 12px
          line-height 1
          &.user-member-integral
            margin-left 24rpx

  .list .list-sub
    margin 0 40rpx 40rpx
    padding 0 40rpx
    border-radius 24rpx
    background #fff
    box-shadow 2px 2px 10px rgba(160, 160, 150, 0.2)
    .list-item
      height 100rpx
      line-height 100rpx
      font-size 14px
      color #333
      position relative
      &::after
        content ""
        display inline-block
        border solid #c4c4c4
        border-width 0 2px 2px 0
        padding 3px
        position absolute
        right 0
        top 50%
        transform translateY(-50%) rotate(-45deg)
        -webkit-transform translateY(-50%) rotate(-45deg)
    > view:not(:last-child)
      border-bottom 1rpx solid #eee
    .list-item-btn
      height 100rpx
      line-height 100rpx
      font-size 14px
      text-align left
      color #333
      padding 0
      background #fff
      &::after
        border none  
</style>
