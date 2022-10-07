<template>
  <view class="page">
    <view class="list">
      <view class="list-item list-item-edit">
        <view class="label">头像</view>
        <image :src="userInfo.avatarUrl" @click="previewImage" />
      </view>

      <view class="list-item list-item-edit">
        <view class="label">昵称</view>
        <view class="val">{{ userInfo.nickName }}</view>
      </view>
      <view class="list-item list-item-edit">
        <view class="label">密码</view>
        <view class="val">修改密码</view>
      </view>
      <view class="list-item">
        <view class="label">用户ID</view>
        <view class="val">{{ userInfo.userId }}</view>
      </view>
      <view class="list-item">
        <view class="label">手机</view>
        <view class="val">{{ userInfo.phone }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import ArticleList from "@/components/article-list";
export default {
  components: {
    ArticleList,
  },
  data() {
    const userInfo = this.$storage("userInfo") || {};
    return {
      userInfo,
    };
  },
  onLoad(e) {},

  methods: {
    async getList() {
      let t = this.curType;
      let listData = [];
      let res = "";
      let params = {
        openid: this.$storage("openId") || "",
        // apptype: 'wx',
      };

      if (t === "1") {
        listData = this.$storage("readLogs") || [];
        console.log(listData);
      }
      if (t === "2") {
        res = await this.$api.getCommentArticle(params);
        console.log(res);
        listData = (res.data || []).map((m) => ({
          id: m.post_id,
          title: m.post_title,
          img: m.post_medium_image,
        }));
        console.log(listData);
      }
      if (t === "3") {
        res = await this.$api.getLikeArticle(params);
        listData = (res.data || []).map((m) => ({
          id: m.post_id,
          title: m.post_title,
          img: m.post_medium_image,
        }));
      }
      if (t === "4") {
        res = await this.$api.getPraiseArticle(params);
        listData = (res.data || []).map((m) => ({
          id: m.post_id,
          title: m.post_title,
          img: m.post_medium_image,
        }));
      }
      if (t === "5") {
        res = await this.$api.getSubscribeArticle(params);
        listData = (res.usermetaList || []).map((m) => ({
          id: m.ID,
          title: m.post_title,
          img: m.post_medium_image,
        }));
      }
      this.listData = listData;
      this.empty = !listData.length;

      // if (res.code === '200') {
      //   let list = res.data || []
      //   this.listData = list
      // } else {
      //   this.$tips.toast(res.message || '出错啦')
      // }
    },

    previewImage() {},

    // 跳转文章列表
    goto(e) {
      let url = "/pages/common/detail?id=" + e.id;
      uni.navigateTo({
        url,
      });
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
