<template>
  <view class="page">
    <view
      class="tag"
      v-for="tag in tagList"
      :key="tag.id"
      @click="goto(tag)"
    >
      <image class="img" mode="aspectFill" :src="tag.img" />
      <view class="info">
        <view class="title">#{{ item.name }}</view>
        <view class="des">
          <text>{{ item.description }}</text>
        </view>
        <view class="num">{{ item.count }}篇文章</view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        page: {
          index: 1,
          size: 10
        },
        hasMore: true,
        tagList: [],
      }
    },
    onLoad() {
      this.initData()
    },

    // 下拉刷新
    onPullDownRefresh: function () {
      this.tagsList = []
      this.page.index = 1
      this.hasMore = true
      this.getTagList()
    },

    // 上拉加载
    onReachBottom: function () {
      if (this.hasMore) {
        this.page.index++
        this.getTagList()
      }
    },

    methods: {
      initData() {
        this.getTagList()
      },

      async getTagList() {
        const res = await this.$api.getTagList({
          per_page: this.page.index,
          page: this.page.size,
          orderby: 'count',
          order: 'desc',
        })

        let list = res || []
        list = list.map(m => {
          m.img = m.tag_thumbnail_image || this.$config.defaultImg

          this.tagsList.push(m)
        })
        this.hasMore = this.page.size === list.length
      },

      // 跳转标签文章列表
      goto(e) {
        let url = '/pages/common/list?tagId=' + e.id
        uni.navigateTo({
          url
        })
      },
    }
  }
</script>

<style lang="stylus" scoped>
@import '../../styles/var'

.tag
  display flex
  flex-direction row
  padding 24rpx
  border-bottom 1rpx solid #eee
  .img
    width 132rpx
    height 132rpx
    border-radius 8rpx
    display block
  .info
    display flex
    flex-direction column
    justify-content space-between
    margin-left 24rpx
    .title
      font-size 32rpx
      font-weight 500
      color #333
    .des
      font-size 28rpx
      font-weight 300
      color #959595
      word-break break-all
      display -webkit-box
      -webkit-line-clamp 1
      -webkit-box-orient vertical
      overflow hidden
    .num
      font-size 24rpx
      font-weight 300
      color #959595  

</style>
