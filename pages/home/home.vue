<template>
	<view class="page">
		<image class="logo" src="/static/logo.png"></image>
		<view class="user">
			<view v-if="userInfo">用户名：{{ userInfo.userName }}</view>
      <view>字体图标：<i class="iconfont icon-time" /></view>
		</view>
	</view>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
    computed: {
      ...mapState('user', ['islogin', 'userInfo'])
    },
		onLoad() {
      if (!this.islogin) {
        this.getUserInfo()
        this.setUserInfo({
          userName: '周小黑'
        })
      }
		},
		methods: {
      ...mapMutations('user', ['setUserInfo']),
      ...mapActions('user', ['getUserInfo']),
		}
	}
</script>

<style lang="stylus" scoped>
@import '../../styles/var'

.page
  display flex
  flex-direction column
  align-items center
  justify-content center
  .logo
    height 200rpx
    width 200rpx
    margin-top 200rpx
    margin-left auto
    margin-right auto
    margin-bottom 50rpx
  .user
    font-size 36rpx
    color $base-color
    text-align center
</style>
