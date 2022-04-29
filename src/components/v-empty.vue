<template>
  <div class="empty">
    <i class="icon iconfont" :class="'icon-' + icon" />
    <p class="msg" v-if="showTips"><slot>暂无数据</slot></p>
  </div>
</template>

<script>
  export default {
    name: 'Empty',
    props: {
      icon: {
        type: String,
        default: 'empty-box',
      },
      showTips: {
        type: Boolean,
        default: true,
      },
    },
  }
</script>

<style lang="stylus" scoped>
  .empty
    padding 30px
    line-height 1
    text-align center
    color $gray
    font-size 14px
    .icon
      font-size 50px
      color $gray
    .msg
      margin-top 20px
</style>
