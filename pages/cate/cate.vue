<template>
  <view class="page cate">
    <!-- 左边一级分类菜单 -->
    <view class="cate-left">
      <view class="cate-left-box">
        <view
          class="cate-name"
          :class="{ 'active': activeIndex === index}"
          v-for="(item, index) in categoriesList"
          :key="index"
          @click="switchCate(index)"
        >
          {{ item.name }}
        </view>
      </view>
    </view>

    <!-- 右边二级分类列表 -->
    <view class="cate-right">
      <view
        class="list-item"
        v-for="(itm, idx) in cateSubList"
        :key="idx"
        @click="goDetail(itm)"
      >
        <view class="cate-img">
          <image :src="itm.category_thumbnail_image || $config.defaultImg" class="img" mode="aspectFill" />
        </view>

        <!-- 分类名、描述 -->
        <view class="content-title">
          <span>{{ itm.name }}</span>
        </view>
        <view class="content-brief">
          <span>{{ itm.description }}</span>
        </view>

      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        categoriesList: [],
        cateSubList: [],
        activeIndex: 0
      }
    },
    onLoad() {
      this.initData()
    },

    methods: {
      initData() {
        this.getCategory()
      },

      // 获取分类
      async getCategory() {
        const res = await this.$api.getCategory()
        if (res.length) {
          let list = res.map(item => {
            if (!item.children.length) {
              item.children[0] = { ...item, children: []}
            }
            return item
          })

          let index = this.activeIndex
          this.categoriesList = list
          this.cateSubList = list[index].children
        }
      },

      // 左边分类菜单切换
      switchCate(index) {
        let cateChildren = this.categoriesList[index]

        // 只有一级分类，右侧显示出一级分类
        if (!cateChildren.children.length) {
          cateChildren = [cateChildren]
        } else {
          cateChildren = this.categoriesList[index].children
        }

        this.activeIndex = index
        this.cateSubList = cateChildren
      },

      //跳转分类详情
      goDetail(item) {
        uni.navigateTo({
          // url: `/pages/cate/cate-article?id=${item.id}`
          url: `/pages/common/list?id=${item.id}`
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
@import '../../styles/var'

  page 
    background #f5f7f7
  .cate
    width 100%
    position absolute
    top 0
    bottom 0
    display flex
    .cate-left
      width 200rpx
      font-size 28rpx
      background #fff
      position fixed
      height 100%
      .cate-left-box
        width 200rpx
        position absolute
        height 100%
        overflow auto
        .cate-name
          height 100rpx
          line-height 100rpx
          padding 0 24rpx
          position relative
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
          &.active
            color $maincolor
            font-weight 500
            background #f5f7f7
            &::before
              content ''
              display block
              width 3px
              height 30rpx
              background $maincolor
              position absolute
              top 35rpx
              left 0
    .cate-right
      flex 1
      height 100%
      padding 40rpx 40rpx 0
      overflow auto
      background #f5f7f7
      margin-left 200rpx
      .list-item
        position relative
        overflow hidden
        margin-bottom 40rpx
        background #fff
        border-radius 10rpx
        box-shadow 2px 2px 10px #eee
        .cate-img
          .img
            width 100%
            height 160rpx
            display block
        .content-title
          padding 20rpx 30rpx 0
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
          display flex
          justify-content space-between
          align-items center
          span
            font-size 15px
            line-height 1
            font-weight 500
            color #333
        .content-brief
          width 70%
          padding 4rpx 0 30rpx 30rpx
          font-size 13px
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
          color #333
 
</style>
