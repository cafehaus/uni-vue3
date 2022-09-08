<template>
  <view class="comment" @click="goto">
    <view class="user">
      <view class="avatar">
        <image class="img" :src="item.author_url" />
        <!-- #ifndef MP-KUAISHOU -->
        <image class="icon" :src="`/static/${item.usertype}.jpg`" />
        <!-- #endif -->
      </view>
      <view class="info">
        <view class="author" @click="onReply(item)">{{ item.author_name }}</view>
        <view class="date">{{ item.date }}</view>
      </view>
    </view>
    <view class="content" @click="onReply(item)"> {{ item.content }}</view>

    <!-- 回复-->
    <view v-if="item.child && item.child.length" class='reply'>
      <CommentChildren :list="item.child" :father="item" @reply="onReply" />
    </view>
  </view>
</template>

<script>
  import CommentChildren from './comment-children'
  export default {
    name: 'CommentItem',
    components: {
      CommentChildren,
    },
    props: {
      item: {
        type: Object,
        default: () => ({})
      },
    },

    data() {
      return {}
    },

    methods: {
      onReply(e) {
        this.$emit('reply', { ...e })
      },
      goto() {
        this.$emit('goto', this.item)
      },
    }
  }
</script>

<style lang="stylus" scoped>
@import '../../styles/var'

.comment
  margin 0 0 60rpx
  .user
    display flex
    justify-content space-between
    align-items center
    font-size 28rpx
    color #333
    .avatar
      position relative
      .img
        border-radius 16rpx
        height 64rpx
        width 64rpx
      .icon
        width 30rpx
        height 30rpx
        position absolute
        right -5rpx
        bottom 3rpx
        border-radius 50%
        border 1px solid #fff
  .info
    flex 1
    display flex
    justify-content space-between
    align-items center
    .author
      max-width 400rpx
      color $base-color
      font-weight 500
      margin 0 20rpx
      nowrap()
    .date
      font-size 24rpx
      color #959595
      flex-shrink 0

  .content
    font-size 30rpx
    color #333
    text-align justify
    line-height 1.8
    margin-left 80rpx
    margin-bottom 16rpx

  .reply
    background-color #f9fafb
    margin-left 80rpx
    padding 16rpx 24rpx

</style>
