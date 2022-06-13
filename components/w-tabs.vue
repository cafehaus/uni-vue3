<template>
  <view class="w-tabs">
    <view class="navbar">
      <view
        v-for="(item, index) in tabs"
        :key="index"
        class="navbar-item"
        :class="{'navbar-item-on': activeTab == index}"
        @click="switchTab(index)"
      >
        <span class="navbar-title">{{ item.name }}</span>
      </view>
      <view class="navbar-slider" :class="'navbar-slider-' + activeTab" />
    </view>
   <view class="tab-content">
      <slot></slot>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'tab',
    props: {
      tabs: {
        type: Array,
        default() {
          return ['选项一', '选项二', '选项三']
        }
      },
      activeTab: {
        type: Number,
        default: 0
      }
    },

    data() {
      return {
        activeIndex: this.activeTab
      }
    },

    // watch: {
    //   activeTab(val) {
    //     this.activeTab = val
    //   }
    // },

    methods: {
      switchTab(index) {
        // this.activeTab = index
        this.$emit('change', index)
      }
    }
  }
</script>

<style lang="stylus" scoped>
@import '../styles/var'

.w-tabs
  .tab-content
    padding-top 80rpx
  .navbar
    height 80rpx
    position fixed
    left 0
    right 0
    z-index 9
    padding 0 0 10rpx
    display flex
    box-shadow 0px 4px 8px #f7f7f7
    background #fff
    .navbar-item
      flex 1
      margin 0 10px
      padding 8px 0
      text-align center
      color #666
      &.navbar-item-on
        color $red
        .navbar-title
          font-weight 500
    .navbar-slider
      position absolute
      left 0
      bottom 0
      width 25%
      transition all .3s
      &::before
        content ''
        width 40rpx
        height 4rpx
        background-color $red
        position absolute
        bottom 0
        left 50%
        transform translateX(-50%)
      &-0
        transform translateX(0)
      &-1
        transform translateX(100%)
      &-2
        transform translateX(200%)
      &-3
        transform translateX(300%)
</style>
