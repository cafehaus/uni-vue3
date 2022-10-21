<template>
  <view class="page">
    <view class="list">
      <view class="list-item list-item-edit">
        <view class="label">头像</view>
        <image :src="userInfo.avatarUrl" @click="updateAvatar" />
      </view>

      <view class="list-item list-item-edit" @click="handleEdit('1')">
        <view class="label">昵称</view>
        <view class="val">{{ userInfo.nickName }}</view>
      </view>
      <view class="list-item list-item-edit list-item-edit" @click="handleEdit('2')">
        <view class="label">登录名</view>
        <view class="val">{{ userInfo.username || '设置登录名' }}</view>
      </view>
      <view v-if="userInfo.username" class="list-item list-item-edit" @click="handleEdit('3')">
        <view class="label">密码</view>
        <view class="val">修改密码</view>
      </view>
      <view class="list-item">
        <view class="label">用户ID</view>
        <view class="val">{{ userInfo.userId }}</view>
      </view>
      <view class="list-item" :class="{'list-item-edit': canGetPhone}">
        <view class="label">手机号</view>
        <view class="val" v-if="!canGetPhone">{{ userInfo.phone || '' }}</view>
        <button
          v-else
          class="val btn-phone"
          open-type="getPhoneNumber"
          @getphonenumber="getPhoneNumber"
        >
          <text>{{ userInfo.phone || '绑定手机号' }}</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex'
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
    ...mapState('app', ['appInfo', 'systemInfo']),
    canGetPhone() {
      const t = this.$config.minapptype || ''
      const isCompany = this.systemInfo.isCompany
      return t && isCompany && ['weixin', 'baidu', 'toutiao', 'alipay', 'kuaishou'].includes(t)
    }
  },

  onShow() {
    this.userInfo = this.$storage("userInfo") || {}
  },

  methods: {
    updateAvatar() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'], // 'original', 'compressed' 可以指定是原图还是压缩图
        sourceType: ['album'], //从相册选择
        success: (res) => {
          const temp = JSON.stringify(res.tempFilePaths) || []
          this.uploadImg(temp[0])
        }
      })
    },

    async uploadImg(imgfile) {
      let params = {
        userid: this.userInfo.userId,
        sessionid: this.token.sessionid
      }

      this.$tips.loading('上传中...')
      const url = this.$config + 'wp-json/minapper-plus/v1/attachments'
      uni.uploadFile({
        url,
        filePath: imgfile,
        name: 'file',
        formData: params,
        success: res => {
          console.log(res)
          const data = res.data || {}
          const img = data.imageurl
          if (img) {
            let user = {
              ...this.userInfo,
              avatarUrl: img
            }
            this.$storage('userInfo', user)
            this.$tips.toast('头像更新成功')
          }
        },
        complete: () => {
          this.$tips.loaded()
        }
      })
    },

    async getPhoneNumber(e) {
      let args = {
        code: e.detail.code,
        openid: this.userInfo.openid
      }
      const apiName = this.$config.appType + 'BindPhone'
      const res = await this.$api[apiName](args)
      if (res.success && code) {
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

    handleEdit(t) {
      let url = `/pages/login/user-edit?type=${t}`
      this.goto(url)
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
</style>
