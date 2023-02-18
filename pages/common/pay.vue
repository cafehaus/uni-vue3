<template>
  <view class="page">
    <view class="title">请选择鼓励的金额</view>
    <view class="price-list-box">
      <view class="price-list">
        <view
          class="item"
          v-for="(item, index) in options"
          :key="index"
          @click="selectItem(item)"
        >
          <view class="price-box" :class="{'active': selected === item}">
            <strong class="price">{{ item }} 元</strong>
          </view>
        </view>
      </view>
    </view>

    <view class="cancel-button">
      <button size="mini" @click="goBack">取消</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      options: [6, 8, 18, 66, 88, 188],
      openid:'',
      postid:'',
      template_id: $config.getPayTemplateId,
      flag:'1',
      selected: null,
    }
  },

  onLoad(e) {
    this.openid = e.openid
    this.postid = e.postid
    this.flag = e.flag
  },

  methods: {
    async selectItem(num) {
      this.selected = num
      let params = {
        openid: this.openid,
        totalfee: num
      }
      const response = await this.$api.postPraiseUrl(params)
      if (response.data) {
        uni.requestPayment({
          'timeStamp': response.data.timeStamp,
          'nonceStr': response.data.nonceStr,
          'package': response.data.package,
          'signType': 'MD5',
          'paySign': response.data.paySign,
          'success': async (res) => {
            let arg = {
              openid: this.openid,
              postid: this.postid,
              orderid: response.data.nonceStr,
              money: num
            }

            await this.$api.updatePraiseUrl(arg)
            this.$tips.toast('谢谢鼓励！')
          },
          fail: function (res) {
            this.$tips.toast(res.errMsg)
          },
          complete: function (res) {
            if (res.errMsg =='requestPayment:fail cancel') {
              this.$tips.toast('取消鼓励')
            }
          }
        })
      }
    },

    goBack() {
      uni.navigateBack()
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '../../styles/var'

.page
  width 100%
  margin-bottom 10rpx
  padding 0
.title
  color #333
  font-size 32rpx
  text-align center
  margin 48rpx
.price-list-box
  margin 0 auto
  width 680rpx
  height 300rpx
.price-list
  /* padding:0 30rpx; */
  margin-left -40rpx
  text-align center
.price-list .item
  float left
  margin-left 40rpx
  margin-bottom 40rpx
  width 200rpx
.price-list .price-box
  height 100rpx
  border-radius 16rpx
  border 4rpx solid #fd8f45
  text-align center
.price-list .price-box em
  line-height 100rpx
  color #fd8f45
  font-size 30rpx
.price-list .price-box .price
  font-size 50rpx
  display inline-block
.price-list .price-box.active
  background-color #36c
.price-list .price-box.active em
  color #fff
  background-color #36c
.cancel-button
  width 200rpx
  margin 0 auto
.cancel-button>button
  width 200rpx
  height 88rpx
  font-size 28rpx
  color #959595
  line-height 88rpx
  background-color #fff
  border-radius 16rpx
  border 2px solid #eee
  margin-top 200rpx
.cancel-button>button::after
  border none
</style>
