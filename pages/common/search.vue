<template>
  <view class="page">
    <VSearch v-model="searchKey" @search="onSearch" />

    <!-- 搜索历史 -->
    <view class="history" v-if="showHistory && history.length && !showList">
      <view class="header">
        <text class='subtitle'>· 搜索历史</text>
        <text class="iconfont icon-clear-search" @click="onClear" />
      </view>

      <view class='content'>
        <view class="item" v-for="(item, index) in history" :key="index">
          {{ item }}
        </view>
      </view>
    </view>

    <ArticleList :article-list="articleList" />
  </view>
</template>

<script>
  import ArticleList from '@/components/article-list'
  import VSearch from '@/pages/home/components/v-search'
  export default {
    components: {
      ArticleList,
      VSearch,
    },
    data() {
      return {
        articleList: [],
        history: [],
        showList: false, 
        showHistory: true,
        isEmpty: false,
        page: {
          index: 1,
          size: 5
        },
        noMore: false,
        searchKey: '',
      }
    },
    onLoad(e) {
      this.searchKey = e.search || ''
      this.initData()
    },

    // 下拉刷新
    onPullDownRefresh() {
      this.articleList = []
      this.page.index = 1
      this.noMore = false
      this.showHistory = true

      this.getList()
    },

    // 上拉加载
    onReachBottom() {
      if (this.noMore) {
        uni.showToast({
          icon: 'none',
          title: '已经是最后一页了',
          duration: 1000
        })
        return
      }
      
      this.page.index++
      this.getList()
    },

    methods: {
      initData() {
        if (this.searchKey) {
          this.onSearch()
        }
        this.getStorage()
      },

      // 搜索
      onSearch() {
        if (!this.searchKey) {
          this.$tips.toast('请输入关键字')
          return
        }
        this.page.index = 1
        this.getList()
      },

      async getList() {
        this.setSearchStorage(this.searchKey)
        const res = await this.$api.getArticleList({
          orderby: 'date',
          order: 'desc',
          page: this.page.index,
          per_page: this.page.size,
          search: this.searchKey
        })

        if (res.length) {
          this.articleList.push(...res)
          this.showList = true
        }

        if ((res.length < 5) || (res.code === 'rest_post_invalid_page_number')) {
          this.noMore = true
        }
      },

      // 缓存搜索
      setStorage(key) {
        if (!key) return
        let list = this.$storage('search') || []

        if (list.length) {
          list = list.filter(m => m !== key)
          if (list.length >= 10) list.pop()
        }
  
        list.unshift(key)
        this.$storage('search', list)
      },

      // 获取搜索历史
      getStorage() {
        let list = this.$storage('search') || []
        this.history = list
      },

      onClear() {
        this.history = []
        this.$storage('search', [])
      }
    }
  }
</script>

<style lang="stylus" scoped>
@import '../../styles/var'

.history
  line-height 100rpx
  color #999
  .header
    display flex
    justify-content space-between
    align-items center
    margin 60rpx 40rpx 0
    .subtitle
      font-size 14px
  .content
    display flex
    flex-direction row
    flex-wrap wrap
    margin 0 40rpx 0 16rpx
    padding-bottom 16rpx
  .item
    height 72rpx
    border-radius 36rpx
    background #f5f7f7
    padding 0 36rpx
    margin-left 24rpx
    margin-bottom 24rpx
    display inline-block
    max-width 400rpx
    color #4c4c4c
    font-size 26rpx
    line-height 72rpx
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
 
</style>
