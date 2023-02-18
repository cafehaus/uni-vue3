<template>
  <view class="page">
    <view class="list">
      <template v-if="canEdit">
        <view class="list-item list-item-edit">
          <image :src="userInfo.avatarUrl" @click="previewImg" />
          <!-- #ifndef MP-WEIXIN -->
          <view class="val" @click="updateAvatar">修改头像(剩余{{userInfo.enableUpdateAvatarCount || 0 }}次)</view>
          <!-- #endif -->
          <!-- #ifdef MP-WEIXIN -->
          <button hover-class="none" open-type="chooseAvatar" @chooseavatar="onChooseAvatar" class="val btn-avatar">修改头像(剩余{{userInfo.enableUpdateAvatarCount || 0 }}次)</button>
          <!-- #endif -->
        </view>
        <view class="list-item list-item-edit" @click="handleEdit('1')">
          <view class="label">昵称</view>
          <view class="val">{{ userInfo.nickName }}</view>
        </view>
        <view class="list-item list-item-edit" @click="handleEdit('2')">
          <view class="label">登录名</view>
          <view class="val">{{ userInfo.username || '设置登录名' }}</view>
        </view>
      </template>

      <!-- H5 和 APP 暂不支持修改 -->
      <template v-else>
        <view class="list-item">
          <view class="label">头像</view>
          <image :src="userInfo.avatarUrl" @click="previewImg" />
        </view>
        <view class="list-item">
          <view class="label">昵称</view>
          <view class="val">{{ userInfo.nickName }}</view>
        </view>
        <view class="list-item">
          <view class="label">登录名</view>
          <view class="val">{{ userInfo.username || '' }}</view>
        </view>
      </template>
      <view v-if="userInfo.username" class="list-item list-item-edit" @click="handleEdit('3')">
        <view class="label">密码</view>
        <view class="val">修改密码</view>
      </view>
      <view class="list-item">
        <view class="label">用户ID</view>
        <view class="val">{{ userInfo.userId }}</view>
      </view>
      <!-- #ifndef MP-QQ -->
      <view class="list-item" :class="{'list-item-edit': canGetPhone}">
        <view class="label">手机号</view>
        <view class="val" v-if="!canGetPhone">{{ userInfo.phone || '' }}</view>
        <button v-else hover-class="none" class="val btn-phone" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
          <text>{{ userInfo.phone || '绑定手机号' }}</text>
        </button>
      </view>
      <!-- #endif -->

      <!-- #ifdef APP-PLUS -->
      <view class="btn-del" @click="deleteAccount">注销并删除账号</view>
      <!-- #endif -->
    </view>
  </view>
</template>

<script>
  import {
    mapState
  } from 'vuex'
  export default {
    data() {
      const userInfo = this.$storage("userInfo") || {}
      const token = this.$storage("token") || {}
      return {
        userInfo,
        token
      }
    },

    computed: {
      ...mapState('app', ['appInfo']),
      canGetPhone() {
        const t = this.$config.minapptype || ''
        // const isCompany = this.appInfo.isCompany
        // return t && isCompany && ['weixin', 'baidu', 'toutiao', 'alipay', 'kuaishou'].includes(t)
        return t && ['weixin', 'baidu', 'toutiao', 'alipay', 'kuaishou'].includes(t)
      },

      canEdit() {
        const t = this.$config.minapptype || ''
        return t && ['weixin', 'qq', 'baidu', 'toutiao', 'alipay', 'kuaishou'].includes(t)
      }
    },

    onLoad() {
      this.getLoginCode()
    },

    onShow() {
      this.userInfo = this.$storage("userInfo") || {}
    },

    methods: {
      updateAvatar() {
        const m = this.$config.uploadSize || 2
        const sizeLimit = m * 1024 * 1024
        uni.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success: (res) => {
            const temp = res.tempFiles || []
            const info = temp[0]
            const img = info.path
            const size = info.size
            if (size > sizeLimit) {
              this.$tips.toast(`图片大小超过最大限制：${m}M，请重新选择`)
              return
            }

            img && this.uploadImg(img)
          }
        })
      },
      onChooseAvatar(e){
        const img = e.detail.avatarUrl
        console.log(img);
        this.uploadImg(img)

      },

      async uploadImg(imgfile) {
        let params = {
          userid: this.userInfo.userId,
          sessionid: this.token.sessionid,
          imagestype:'minapperUpdateAvatar'
        }

        this.$tips.loading('上传中...')
        const url = this.$config.api + 'wp-json/minapper-plus/v1/attachments'
        uni.uploadFile({
          url,
          filePath: imgfile,
          name: 'file',
          formData: params,
          success: res => {
            let data
             // #ifndef MP-BAIDU
             data = JSON.parse(res.data || '')
             // #endif
             // #ifdef MP-BAIDU
             data = res.data || {}
             // #endif
              console.log(data)
            if (data.success) {
                const img = data.imageurl
                if (img) {
                  this.submitUpdateAvatar(img)
                }
              }
              else
              {
                this.$tips.toast(data.message)
              }

          },
          fail: err => {
            console.log(err)
          },
          complete: () => {
            this.$tips.loaded()
          }
        })
      },

      async submitUpdateAvatar(avatarUrl) {
        const res = await this.$api.updateAvatar({
          userid: this.userInfo.userId,
          sessionid: this.token.sessionid,
          avatarUrl
        })
        if (res.code === 'success') {
          console.log(res.userInfo);
          // let user = {
          //   userInfo:res.userInfo,
          //   avatarUrl,
          // }
          this.$storage('userInfo', res.userInfo)
          this.userInfo = res.userInfo
          this.$tips.toast('头像更新成功')
        } else {
          this.$tips.toast(res.message || '出错了，请稍后再试')
        }
      },

      previewImg() {
        const img = this.userInfo.avatarUrl
        uni.previewImage({
          urls: [img]
        })
      },

      async getPhoneNumber(e) {
        console.log(e)
        // #ifdef MP-WEIXIN
        if (e.detail.errMsg != 'getPhoneNumber:ok') {
          if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
            this.$tips.toast('用户拒绝了手机授权')
          } else {
            this.$tips.toast(e.detail.errMsg)
          }
          return;
        }
        // #endif
        // #ifdef MP-TOUTIAO
        if (e.detail.errNo) {
          if (e.detail.errNo == 10200) {
            this.$tips.toast('用户拒绝了手机授权')
          } else {
            this.$tips.toast(e.detail.errMsg)
          }
          return;
        }
        // #endif
        // #ifdef MP-KUAISHOU
        if (e.detail.errMsg !='getPhoneNumber:ok') {
          if (e.detail.errMsg == 'getPhoneNumber:fail 小程序获取权限失败') {
            this.$tips.toast('用户拒绝了手机授权')
          } else {
            this.$tips.toast(e.detail.errMsg)
          }
          return;
        }
        // #endif
        let args = {
          // #ifdef MP-WEIXIN
          code: e.detail.code,
          // #endif
          // #ifdef MP-BAIDU || MP-TOUTIAO || MP-KUAISHOU
          js_code: this.code,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          // #endif
          // #ifdef MP-ALIPAY
          encryptedData: e.detail.encryptedData,
          // #endif
          openid: this.userInfo.openid || this.$storage('openId')
        }
        const apiName = this.$config.appType + 'BindPhone'
        const res = await this.$api[apiName](args)
        if (res.code === 'success') {
          this.$tips.toast('手机号绑定成功')
          let userInfo = res.userInfo || {}
          let user = {
            ...this.userInfo,
            phone: userInfo.phone
          }
          this.userInfo = user
          this.$storage('userInfo', user)
        } else {
          this.$tips.toast(res.message || '出错了，请稍后再试')
        }
      },

      getLoginCode() {
        // #ifdef MP-WEIXIN || MP-QQ || MP-TOUTIAO || MP-ALIPAY || MP-KUAISHOU
        uni.login({
          success: (r) => {
            if (r.code) {
              this.code = r.code
            }
          }
        })
        // #endif

        // #ifdef MP-BAIDU
        if (swan.canIUse('getLoginCode')) {
          swan.getLoginCode({
            success: resCode => {
              if (resCode.errCode == '10004') {
                this.$tips.toast('用户没有登录百度app', 'error')
                return
              }
              this.code = resCode.code
            }
          })
        } else {
          //在低版本基础库中'swan.getLoginCode'不可用
          console.log('"swan.getLoginCode"不可用,请升级基础库版本')
        }
        // #endif
      },

      handleEdit(t) {
        let url = `/pages/login/user-edit?type=${t}`
        this.goto(url)
      },

      // 注销账号：小米应用商店需提供账号注销功能
      deleteAccount() {
        const email = 'account@minapper.com'
        const content =  `如需注销账号，请使用原注册邮箱，发送申请至${email}，邮件中注明您将要注销的账号即可，我们将在5个工作日内完成相关账号的注销删除。`
        uni.showModal({
          title: '注销账号',
          content,
          confirmText: '复制邮箱',
          success (res) {
            if (res.confirm) {
              uni.setClipboardData({
                data: email
              })
            }
          }
        })
      },

      // 跳转
      goto(url) {
        uni.navigateTo({
          url,
        })
      },
    },
  };
</script>

<style lang="stylus" scoped>
  @import '../../styles/var';

  /* 列表样式 */
  .list {
    padding: 40rpx 40rpx 0;
    width: 100%;
    box-sizing: border-box;
  }

  .list .list-item:not(:last-child) {
    border-bottom: 1rpx solid #EEE;
  }

  .list-item {
    width: 100%;
    font-size: 14px;
    color: #333;
    position: relative;
    padding: 32rpx 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .list-item image {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    margin-right: 20rpx;
  }

  .list-item .label {
    flex-shrink: 0;
    color: #999;
  }

  .list-item .val {
    font-size: 16px;
    font-weight: 500;
    margin-left: 80rpx;
    flex-shrink: 0;
    text-align: right;
    word-break: break-all;
    max-width: 480rpx;
  }

  .list-item .val-empty {
    font-weight: normal;
    color: #999;
  }

  .list-item-des {
    align-items: flex-start;
  }

  .list-item-des .val {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .list-item-edit .val {
    padding-right: 24rpx;
  }

  .val.btn-avatar {
    border: none;
    display: inline;
  }

  .val.btn-avatar::after {
    border: none;
  }

  .val.btn-phone {
    border: none;
    display: inline;
  }

  .val.btn-phone::after {
    border: none;
  }

  .list-item-edit::after {
    content: '';
    display: inline-block;
    border: solid #ccc;
    border-width: 0 2px 2px 0;
    padding: 3px;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%) rotate(-45deg);
    -webkit-transform: translateY(-50%) rotate(-45deg);
  }

  .btn-del {
    position: fixed;
    bottom: 80rpx;
    left: 50%;
    transform: translateX(-50%);
    font-size: 30rpx;
    color: $base-color;
  }
</style>
