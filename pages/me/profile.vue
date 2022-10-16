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
      <view class="list-item list-item-edit" @click="handleEdit('2')">
        <view class="label">密码</view>
        <view class="val">修改密码</view>
      </view>
      <view class="list-item">
        <view class="label">用户ID</view>
        <view class="val">{{ userInfo.userId }}</view>
      </view>
      <view class="list-item">
        <view class="label">手机号</view>
        <view class="val">{{ userInfo.phone || '' }}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    const userInfo = this.$storage("userInfo") || {}
    const token = this.$storage("token") || {}
    return {
      userInfo,
      token
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
          console.log(JSON.stringify(res.tempFilePaths));
          this.uploadImg(JSON.stringify(res.tempFilePaths)[0])
        }
      });
    },

    async uploadImg(imgfile) {
      let params = {
        imgfile,
        userid: this.userInfo.userId,
        sessionid: this.token.sessionid
      }
      const res = await this.$api.uploadImg(params)
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
