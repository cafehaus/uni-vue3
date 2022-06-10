<template>
  <view class="page">
    <!-- 轮播 -->
    <VSwiper :swiper-list="swiperList" />

    <!-- 精选栏目 -->
    <NiceColumn :nav-list="navList" />

    <!-- 搜索 -->
    <VSearch from="home" />

    <!-- 标签 -->
    <VTag :tag-list="tagList" />

    <!-- 文章列表 -->
    <ArticleList :article-list="articleList" />
  </view>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import ArticleList from "@/components/article-list";
import VSwiper from "./components/v-swiper";
import NiceColumn from "./components/nice-column";
import VSearch from "./components/v-search";
import VTag from "./components/v-tag";
export default {
  components: {
    ArticleList,
    VSwiper,
    NiceColumn,
    VSearch,
    VTag
  },
  data() {
    return {
      swiperList: [],
      navList: [],
      tagList: [],

      articleList: [],
      page: {
        index: 1,
        size: 5
      },
      isLastPage: false,
      isPullDown: false
    };
  },
  computed: {
    ...mapState("user", ["islogin", "userInfo"])
  },
  onLoad() {
    // if (!this.islogin) {
    //   this.getUserInfo()
    //   this.setUserInfo({
    //     userName: '周小黑'
    //   })
    // }
    this.initData();
  },
  onPullDownRefresh() {
    this.articleList = [];
    this.page.index = 1;
    this.isPullDown = true;
    this.isLastPage = false;

    this.getArticleList();
  },

  onReachBottom() {
    if (this.isLastPage) {
      uni.showToast({
        icon: "none",
        title: "已经是最后一页了",
        duration: 1000
      });
      return;
    }

    this.page.index++;
    this.getArticleList();
  },
  methods: {
    ...mapMutations("user", ["setUserInfo"]),
    ...mapActions("user", ["getUserInfo"]),
    initData() {
      this.getOptionsExpand();
      this.getCustomAd();
      this.getTagList();
      this.getArticleList();
    },

    // 轮播/精选
    async getOptionsExpand() {
      const res = await this.$api.getOptionsExpand();
      let swiperList = res.wx_swipe_nav || [];
      let navList = res.wx_selected_nav || [];

      this.swiperList = swiperList;
      this.navList = navList;
      console.log(swiperList)
    },

    // 标签
    async getTagList() {
      const res = await this.$api.getTagList({
        per_page: 7,
        page: 1,
        orderby: 'count',
        order: 'desc',
      })
      this.tagList = res || []
    },

    // 自定义广告
    async getCustomAd() {
      const res = await this.$api.getCustomAd();
      let banner = res.home_list_top_ad || {};

      this.banner = banner;
    },

    // 获取文章列表
    async getArticleList() {
      const res = await this.$api.getArticleList({
        page: this.page.index,
        per_page: this.page.size,
        orderby: "date",
        order: "desc"
      });

      if (res.length) {
        this.articleList.push(...res);
      }

      if (this.isPullDown) {
        uni.stopPullDownRefresh();
        this.isPullDown = false;
      }

      if (res.length < 5 || res.code === "rest_post_invalid_page_number") {
        this.isLastPage = true;
      }
    },

    // 去文章详情
    goSwiperDetail(id) {
      uni.navigateTo({
        url: `/pages/common/detail?id=${id}`
      })
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '../../styles/var';

.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .logo {
    height: 200rpx;
    width: 200rpx;
    margin-top: 200rpx;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 50rpx;
  }

  .user {
    font-size: 36rpx;
    color: $base-color;
    text-align: center;
  }
}
</style>
