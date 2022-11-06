<template>
  <div class="page">
    <div class="item" v-for="(itm, idx) in listData" :key="idx">
      <div class="header">
        <p class="title">{{ itm.title }}</p>
        <p class="info">{{ itm.content }}</p>
        <p class="contact">联系方式：{{ itm.contact }}</p>
      </div>
      <div class="footer">
        <p class="time">{{ itm.creatdate }}</p>
        <p v-if="itm.replay" class="btn-reply" @click="previewReply(itm)">查看回复</p>
      </div>
    </div>

    <w-empty v-if="empty" />

    <view class="btn-goto" @click="goto('/pages/me/leaveword')">去留言</view>
  </div>
</template>

<script>
export default {
  data() {
    const userInfo = this.$storage('userInfo')
    const token = this.$storage("token") || {}
    return {
      userInfo,
      token,
      listData: [],
      empty: false,
    }
  },

  onLoad() {
    this.initData()
  },

  methods: {
    initData() {
      this.getListData()
    },

    async getListData() {
      const res = await this.$api.getMyLeaveword({
        userid: this.userInfo.userId,
        sessionid: this.token.sessionid
      })
      if (res.message) {
        this.$tips.toast(res.msg || '请求失败')
      } else {
        let data = res || []
        this.listData = data
        this.empty = !data.length
      }
    },

    previewReply(itm) {
      wx.showModal({
        title: '回复',
        content: itm.replay,
        showCancel: false,
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },

    goto(url) {
      uni.navigateTo({
        url
      })
    },
  },
}
</script>
<style lang='stylus' scoped>
@import '../../styles/var'
.page
  min-height 100vh
  background #EFF1F2
  padding 20rpx 20rpx 0
  padding-bottom calc(20rpx + env(safe-area-inset-bottom))
  .btn-goto
    width 240rpx
    height 80rpx
    border-radius 40rpx
    color #fff
    font-size 14px
    text-align center
    line-height 80rpx
    background $base-color
    box-shadow 4px 4px 8px #eee
    position fixed
    bottom 40rpx
    left 50%
    margin-left -120rpx

  .item
    background #fff
    border-radius 20rpx
    padding 32rpx
    margin-bottom 20rpx
    .header
      border-bottom 1px dashed #D8D8D8
      padding-bottom 24rpx
      margin-bottom 20rpx
      .title
        font-size 16px
        font-weight 600
      .info
        font-size 13px
      .contact  
        font-size 13px
        margin-top 12rpx

    .footer
      display flex
      justify-content space-between
      align-content center
      color #A2A2A3
      padding-top 20rpx
      .time
        font-size 12px
      .btn-reply
        height 60rpx
        width 180rpx
        border 1px solid #eee
        border-radius 30rpx
        font-size 13px
        color #666
        text-align center
        line-height 56rpx
        float right
        box-sizing border-box

</style>
