<template>
  <view class="page">
    <view class="form">
      <view class='form-item'>
        <view class="label">标题</view>
        <input v-model="form.title" placeholder="请输入标题" />
      </view>
      <view class='form-item'>
        <view class="label">内容</view>
        <textarea v-model="form.content" placeholder="请输入内容" />
      </view>
      <view class='form-item'>
        <view class="label">联系方式</view>
        <input v-model="form.contact" placeholder="请输入联系方式" />
      </view>
    </view>

    <view class="footer">
      <view class="btn" @click="submit">立即提交</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    const userInfo = this.$storage('userInfo')
    const token = this.$storage("token") || {}
    return {
      userInfo,
      token,
      form: {
        title: '',
        content: '',
        contact: ''
      }
    }
  },

  methods: {
    async submit() {
      if (!this.form.title) {
        this.$tips.toast('请输入标题')
        return
      }
      if (!this.form.content) {
        this.$tips.toast('请输入内容')
        return
      }
      if (!this.form.contact) {
        this.$tips.toast('请输入联系方式')
        return
      }

      let params = {
        ...this.form,
        userid: this.userInfo.userId,
        sessionid: this.token.sessionid
      }

      const res = await this.$api.submitLeaveword(params)
      if (res.code === 'success') {
        this.$tips.toast('提交成功')
        if (this.$uni.hasPrevPage()) {
          this.$uni.refreshtPrevPage()
          uni.navigateBack()
        } else {
          this.$uni.relaunch('/pages/home/home')
        }
      } else {
        this.$tips.toast(res.message || '出错啦')
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '../../styles/var'
.form-item
  background-color #fff
  padding 30rpx 25rpx
  display flex
  border-bottom 1rpx solid #eee
  .label
    flex-shrink 0
    margin-right 24rpx
    width 150rpx
    font-size 14px
  input,
  textarea
    font-size 14px  

.footer
  display flex
  align-items center
  padding 100rpx 100rpx
  .btn
    width 100%
    height 88rpx
    // padding 0 60rpx
    font-size 14px
    font-weight 500
    text-align center
    color #FFF
    line-height 88rpx
    border-radius 50rpx
    background $base-color
</style>