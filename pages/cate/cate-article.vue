<template>
  <div class="page cate">
    <!-- 文章分类 -->
    <view class="topic-common-list">
      <view class="topic-list-item">
        <image :src="cateInfo.category_thumbnail_image || $config.defaultImg" class="cover" mode="aspectFill" />
        <view class='topic-item-content'>
          <view class="topic-content-brief">
            <text>{{ cateInfo.description }}</text>
          </view>
          <view class="topic-content-num">
            <text>共有 {{ cateInfo.count }} 篇文章</text>
          </view>
        </view>
      </view>
    </view>

    <ArticleList :article-list="articleList" />
  </div>
</template>

<script>
  import ArticleList from '@/components/article-list'
  export default {
    components: {
      ArticleList
    },
    data() {
      return {
        cateId: '',
        articleList: [],
        cateInfo: {},

        page: {
          index: 1,
          size: 5
        },
        isLastPage: false,
        isPullDown: false
      }
    },
    onLoad() {
      this.initData()
    },

    // 下拉刷新
    onPullDownRefresh() {
      this.articleList = []
      this.page.index = 1
      this.isPullDown = true
      this.isLastPage = false

      this.getCateArticle()
    },

    // 上拉加载
    onReachBottom() {
      if (this.isLastPage) {
        uni.showToast({
          icon: 'none',
          title: '已经是最后一页了',
          duration: 1000
        })
        return
      }
      
      this.page.index++
      this.getCateArticle()
    },

    methods: {
      initData() {
        this.cateId = this.$route.query.id

        this.getCategoryInfo()
        this.getCateArticle()
      },

      // 获取分类
      async getCateArticle() {
        const res = await this.$api.getCateArticle({
          orderby: 'date',
          order: 'desc',
          page: this.page.index,
          per_page: this.page.size,
          categories: this.cateId
        })

        if (res.length) {
          this.articleList.push(...res)
        }

        if(this.isPullDown) {
          uni.stopPullDownRefresh()
          this.isPullDown = false
        }

        if ((res.length < 5) || (res.code === 'rest_post_invalid_page_number')) {
          this.isLastPage = true
        }
      },

      // 获取分类信息
      async getCategoryInfo() {
        const res = await this.$api.getCategoryInfo(this.cateId)
        this.cateInfo =  res

        // 设置页面标题
        uni.setNavigationBarTitle({
          title: res.name
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
@import '../../styles/var'

.list-header {
  padding: 50rpx 0;
  text-align: left;
  font-weight: normal;
  font-size: 40rpx;
  line-height: 40rpx;
  color: #21759b;
  border-bottom: 2rpx solid #ededed;
  margin-bottom: 48rpx;
}

.topic-list-item {
  position: relative;
  overflow: hidden;
  background: #f4f6f9;
}

.topic-list-item  image.cover {
  display: block;
  width: 100%;
  height: 240rpx;
  filter: brightness(88%);
}

.topic-item-content {
  position: absolute;
  z-index: 2;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  vertical-align: middle;
  width: 90%;
}

.topic-content-brief {
  font-size: 30rpx;
  font-weight: 500;
  line-height: 1.4;
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 16rpx;
}

.topic-content-num {
  font-size: 24rpx;
  line-height: 24rpx;
  color: #fff;
  margin-bottom: 24rpx;
}
 
</style>
