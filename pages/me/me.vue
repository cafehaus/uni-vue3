<template>
  <view class="page">
    <view class="user"  :class="{'user-login': isLogin}">
      <view class="user-info">
        <view class="user-name">{{ userInfo.nickName || '游客' }}</view>
        <view class="user-des">
          <text class="user-member">{{ userInfo.levelName || '未知等级' }}</text>
          <text v-if="userInfo.userId" class="user-id">ID:{{ userInfo.userId }}</text>

          <button v-if="!isLogin" class="btn-update" @click="login">立即登录</button>
          <!-- #ifdef  MP-BAIDU || MP-QQ || MP-TOUTIAO || MP-ALIPAY -->
          <button v-else class="btn-update" open-type="getUserInfo" @getuserinfo="updateUserInfo">更新信息</button>
          <!-- #endif -->
       </view>
      </view>

      <!-- 头像 -->
      <image class="avatar" :src="avatar" mode="aspectFill" @click="goto('/pages/me/profile')" />
    </view>

    <!-- 列表 -->
    <view class="list">
      <view class="list-sub">
        <view class="list-item" @click="goto('1')">我的浏览</view>
        <view class="list-item" @click="goto('2')">我的评论</view>
        <view class="list-item" @click="goto('3')">我的点赞</view>
        <view class="list-item" @click="goto('5')">我的订阅</view>
      </view>

      <view class="list-sub">
        <!-- 关于我们 -->
        <view class="list-item" @click="goto('about')">关于我们</view>
        <view class="list-item" @click="goto('/pages/me/leaveword-log')">预约留言</view>
        <!-- #ifdef MP-WEIXIN || MP-BAIDU -->
        <view class="list-item">
          <button openType="contact" class='list-item-btn'>联系客服</button>
        </view>
        <!-- #endif -->
        <!-- #ifdef MP-WEIXIN || MP-QQ -->
        <view class="list-item">
          <button open-type="feedback" class='list-item-btn'>意见反馈</button>
        </view>
        <!-- #endif -->
        <view class="list-item" @click="clearStorage">清除缓存</view>
        <view v-if="isLogin" class="list-item" @click="logout">退出登录</view>

        <view v-if="isLogin && userInfo.levelName === '管理者'" class="list-item" @click="updateLiveInfo">更新直播数据</view>
      </view>
    </view>
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
      // this.initData()
    },

    onShow() {
      if (this.isLogin) {
        this.getUserInfo()
      }
    },

    computed: {
      ...mapState('user', ['isLogin']),
      avatar() { // 头像
        return this.userInfo.avatarUrl || '/static/avatar.png'
      }
    },

    methods: {
      initData() {
        this.getUserInfo()
      },

      // 获取用户信息
      async getUserInfo() {
        let user = this.$storage('userInfo') || {}
        this.userInfo = user
      },

      // 登录
      login() {
        if(!this.$user.isLogin()) {
          this.$user.login('navigateTo')
        }
      },

      // 退出登录
      logout() {
        if (!this.$user.isLogin()) return

        this.$tips.confirm({
          title: '提示',
          content: '您确定要退出登录吗？',
          ok: () => {
            this.$user.logout()
            this.userInfo = {}
          }
        })
      },

      async updateUserInfo(e) {
        let userInfo = e.detail.userInfo
        let openId = this.$storage('openId') || ''
        let args = {
          openid: openId,
          avatarUrl: userInfo.avatarUrl,
          nickname: userInfo.nickName
        }
        this.$tips.loading('更新中...')
        const res = await this.$api.getUserInfo(args)
        this.$tips.loaded()
        if (res.status === '200') {
          let userLevel = res.userLevel || {}
          userInfo.userLevel = userLevel
          userInfo.levelName = userLevel.levelName || ''
          userInfo.userId = res.usreId
          userInfo.openId = openId

          this.userInfo = userInfo
          this.$storage('userInfo', userInfo)
          this.$tips.success('更新成功')
        } else {
          this.$tips.toast(res.message || '更新失败，请稍后再试')
        }
      },

      // 清除缓存
      clearStorage() {
        this.$tips.loading('努力清除中...')
        // uni.clearStorage({
        //   success: () => {
        //     setTimeout(() => {
        //       this.$tips.loaded()
        //       this.$tips.success('清除成功')
        //     }, 2000)
        //   }
        // })

        uni.removeStorage({
          key: 'readLogs', // 浏览记录
          success: () => {
            setTimeout(() => {
              this.$tips.loaded()
              this.$tips.success('清除成功')
            }, 2000)
          }
        })
      },

      // 更新直播数据
      async updateLiveInfo() {
        this.$tips.loading('更新中...')
        const res = await this.$api.updateLiveInfo({
          userid: this.userInfo.userId,
          openid: this.userInfo.openid
        })
        this.$tips.loaded()

        if (res.success === 0) {
          this.$tips.toast(res.message || '更新成功')
        } else {
          this.$tips.toast(res.message || '出错了')
        }
      },

      // 跳转
      goto(e) {
        let url = ''
        // 关于我们
        if (e === 'about') {
          url = `/pages/me/about`
        } else {
          if(!this.$user.isLogin()) {
            this.$user.login('navigateTo')
            return
          }

          if (['1', '2', '3', '5'].includes(e)) {
            url = `/pages/me/readlog?type=${e}`
          } else {
            url = e
          }
        }
        uni.navigateTo({
          url
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
@import '../../styles/var'

  .page
    // background #f5f7f7
    padding-bottom 40rpx
  .user
    display flex
    align-items center
    justify-content space-between
    background-color #fff
    height 280rpx
    padding 0 40rpx
    position relative
    &.user-login
      padding 0 70rpx 0 40rpx
      position relative
      &::after
        content ""
        display inline-block
        border solid #c4c4c4
        border-width 0 2px 2px 0
        padding 3px
        position absolute
        right 40rpx
        top 50%
        transform translateY(-50%) rotate(-45deg)
        -webkit-transform translateY(-50%) rotate(-45deg)
    .avatar
      width 128rpx
      height 128rpx
      border-radius 50%
      box-shadow 4px 12px 30px -8px rgba(139, 161, 185, 0.9)
    .user-info
      color #333
      margin-left 32rpx
      .user-name
        max-width 400rpx
        font-size 40rpx
        font-weight 500
        line-height 1
        nowrap()

      .user-des
        display flex
        align-items center
        margin-top 20rpx
        color #4c4c4c
        font-size 24rpx
        line-height 1
        .user-member,
        .user-id
          margin-right 20rpx
        .btn-update
          height 42rpx
          line-height 42rpx
          background #fff
          padding 0 16rpx
          font-size 22rpx
          color #4c4c4c
          border-radius 24rpx
          border 4rpx solid #f5f7f7
          &::after
            border none

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
