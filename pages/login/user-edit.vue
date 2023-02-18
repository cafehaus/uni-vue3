<template>
  <div class="view login">
    <image class="logo" :src="avatar" mode="aspectFit" />
    <p class="nickname">{{ userInfo.nickName }}</p>
    <view class="form">
      <view v-if="editType === '1' || editType === '2'" class="form-item">
        <input
          v-model="userName"
          class="input"
          type="nickname"
          @blur="onblur"
          :placeholder="'请输入' + userNameTxt"
        />
      </view>
      <view class="form-item" v-if="editType === '2' || editType === '3'">
        <input
          v-model="password"
          type="password"
          class="input"
          :placeholder="editType === '2' ? '请输入密码' : '请输入旧密码'"
        />
      </view>
      <view class="form-item" v-if="editType === '3'">
        <input
          v-model="newPassword"
          type="password"
          class="input"
          placeholder="请输入新密码"
        />
      </view>
    </view>
    <p class="btn-register" @click="handleSubmit">{{ editType === '2' ? '确认' : '确认修改' }}</p>
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
        userName: '',
        password: '',
        newPassword: '',
        editType: '',
      }
    },

    computed: {
      avatar() { // 头像
        return this.userInfo.avatarUrl || '/static/avatar.png'
      },

      isBind() {
        return !!this.userInfo.username
      },

      userNameTxt() {
        let txts = {
          1: '昵称',
          2: '登录名'
        }
        return txts[this.editType] || '用户名'
      }
    },

    onLoad(e) {
      this.editType = e.type || ''
      this.initData()
    },

    methods: {
      initData() {
        let titles = {
          1: '修改昵称',
          2: this.isBind ? '修改登录名' : '设置登录名',
          3: '修改密码'
        }
        // 设置页面标题
        uni.setNavigationBarTitle({
          title: titles[this.editType] || '修改'
        })

        if (this.editType === '1') {
          this.userName = this.userInfo.nickName || ''
        }
        if (this.editType === '2' && this.isBind) {
          this.userName = this.userInfo.username || ''
        }
      },

      handleSubmit() {
        if (this.editType === '1') {
          this.updateUserName()
        }
        if (this.editType === '2') {
          this.bindUser()
        }
        if (this.editType === '3') {
          this.updatePassword()
        }
      },
      onblur(e)
      {
        this.userName=e.detail.value
        
      },

       async updateUserName() {
        if (!this.userName) {
          this.$tips.toast('请输入昵称')
          return
        }
        let args = {
          nickname: this.userName,
          userid: this.userInfo.userId,
          sessionid: this.token.sessionid
        }
        this.$tips.loading('正在更新...')
        const res = await this.$api.updateUserName(args)
        this.$tips.loaded()

        if (res.code == 'success') {
          this.$tips.toast('昵称修改成功')
          let user = {
            ...this.userInfo,
            nickName: this.userName
          }
          this.$storage('userInfo', user)
          this.goBack()
        } else {
          this.$tips.toast(res.message)
        }
      },

      async updatePassword() {
        if (!this.password || !this.newPassword) {
          let msg = !this.password ? '请输入旧密码' : '请输入新密码'
          this.$tips.toast(msg)
          return
        }

        let args = {
          username: this.userInfo.username,
          oldpassword: this.password,
          newpassword: this.newPassword
        }
        this.$tips.loading('正在更新...')
        const res = await this.$api.updatePassword(args)
        this.$tips.loaded()

        if (res.code == 'success') {
          this.$tips.toast('密码修改成功')
          this.goBack()
        } else {
          this.$tips.toast(res.message)
        }
      },

      async bindUser() {
        if (!this.userName || !this.password) {
          let msg = !this.userName ? '请输入登录名' : '请输入密码'
          this.$tips.toast(msg)
          return
        }

        let args = {
          username: this.userName,
          password: this.password,
          openid: this.userInfo.openid
        }
        const apiName = this.$config.appType + 'BindUserNamePassword'
        this.$tips.loading('正在更新...')
        const res = await this.$api[apiName](args)
        this.$tips.loaded()

        if (res.code == 'success') {
          this.$tips.toast('登录名密码设置成功')
          let user = {
            ...this.userInfo,
            username: this.userName
          }
          this.$storage('userInfo', user)
          this.goBack()
        } else {
          this.$tips.toast(res.message)
        }
      },

      // 返回
      goBack() {
        uni.navigateBack()
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../styles/var'

  .login
    background #fff
    padding 0 80rpx
    text-align center
    .logo
      width 120rpx
      height 120rpx
      border-radius 50%
      margin-top 100rpx
    .nickname
      margin-top 20rpx
    .form
      padding 80rpx 0
      &-item
        border 1rpx solid #eee
        margin-top 20rpx
        padding 20rpx
        text-align left
    .btn-register
      width 100%
      height 88rpx
      background $base-color
      border-radius 49rpx
      // margin 200rpx auto 0
      line-height 88rpx
      color #fff
      text-align center
      display flex
      justify-content center
      align-items center
      &::after
        border none
    // .btn-register
    //   width 100%
    //   height 80rpx
    //   border 1px solid $base-color
    //   border-radius 49rpx
    //   margin 30rpx auto 0
    //   color $base-color
    //   text-align center
    //   line-height 80rpx
    // .btn-cancel
    //   font-size 13px
    //   color #bbb
    //   line-height 100rpx

</style>
