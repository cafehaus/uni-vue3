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
          <image :src="itm.category_thumbnail_image || defaultImg" class="img" mode="aspectFill" />
        </view>

        <!-- 分类名、描述 -->
        <view class="content-title">
          <view class="name">
            <text>{{itm.name}}</text>
          </view>
          <!-- #ifdef MP-WEIXIN ||  MP-ALIPAY || MP-QQ || MP-TOUTIAO || MP-BAIDU -->
          <text class="btn-sub" @click.stop="subscribeCate(itm)">{{itm.subflag === '1' ? '取消' : '订阅'}}</text>
          <!-- #endif -->
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
        defaultImg: this.$config.defaultImg,
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
      },

      async subscribeCate(e) {
        if (!this.$user.isLogin()) {
          this.$user.login('navigateTo')
          return
        }

        let categoryid = e.id
        let openid = uni.getStorageSync('openid') || ''
        let params = {
          categoryid,
          openid
        }

        const res = await this.$api.subscribeCate(params)
        if (res.status == '200') {
          this.$tips.success('订阅成功')
          this.reloadData(categoryid, '1')

        } else if (res.status == '201') {
          this.$tips.toast('取消成功')
          this.reloadData(categoryid, '0')
        } else {
          this.$tips.toast('操作失败,请稍后重试')
        }
      },

      reloadData(id, subflag) {
        let newCategoriesList = []
        let cateSubList = this.cateSubList
        for (let i = 0; i < cateSubList.length; i++) {
          if (cateSubList[i].id == id) {
            cateSubList[i].subflag = subflag
          }
          newCategoriesList.push(cateSubList[i])
        }

        if (newCategoriesList.length) {
          this.cateSubList = newCategoriesList
        }
      },
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
          .name
            font-size 15px
            line-height 1
            font-weight 500
            color #333
            flex 1
            flex-shrink 0
          .btn-sub
            margin-left 20rpx
            display inline-block
            // width 10rpx
            padding 0 24rpx
            height 48rpx
            line-height @height
            border 1rpx solid #eee
            border-radius 24rpx
            font-size 24rpx
            color #666

        .content-brief
          width 70%
          padding 4rpx 0 30rpx 30rpx
          font-size 13px
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
          color #333
 
</style>
