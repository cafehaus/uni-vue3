<template>
  <view>
    <view v-for="item in list" :key="item.id">
      <view class="item" @click="onReply(item)">
        <text class="author">{{item.author_name}}</text>
        <text>回复</text>
        <text class="author">{{father.author_name}}</text>
        <text>：{{item.content}}</text>
      </view>

      <CommentChildren :list="item.child" :father="item" />
    </view>
  </view>
</template>

<script>
  // #ifdef MP
  import CommentChildren from './comment-children'
  // #endif
  export default {
    name: 'CommentChildren',
    components: {
      // #ifdef MP
      CommentChildren,
      // #endif
    },
    props: {
      list: {
        type: Array,
        default: []
      },
      father: {
        type: Object,
        default: () => ({})
      }
    },

    data() {
      return {}
    },

    methods: {
      onReply(e) {
        console.log(e)
        this.$emit('reply', { ...e })
      },

      // 去文章详情
      goDetail(id) {
        uni.navigateTo({
          url: `/pages/common/article-detail?id=${id}`
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
@import '../../styles/var'

.item
  font-size 28rpx
  line-height 1.8
  color #333
  .author
    color $base-color
    font-weight 500
</style>
