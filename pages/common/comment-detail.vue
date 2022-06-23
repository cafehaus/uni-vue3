<template>
  <view class="page">
    <comment-detail
      :comment-param="commentParam"
      :srid="srid"
      is-page-scroll
      need-toolbar
      need-like-btn
      back-list-after-delete
      add-comment
      @delete="detailDelete"
    />
  </view>
</template>

<script>
  export default {
    data() {
      return {
        srid: '',
        commentParam: {},
        postId: ''
      }
    },
    onLoad(e) {
      this.srid = e.srid
      this.postId = e.id
      this.commentParam = getApp().commentParam || {}
    },

    methods: {
      detailDelete() {
        if(e.status === 'success') {
          // uni.navigateTo()
          uni.reLaunch({
            url: '/pages/common/detail?id=' + this.postId
          })
        } else {
          this.$tips.toast('删除失败')
        }
      },
    }
  }
</script>

<style lang="stylus" scoped>
  .page
    background #fff
</style>
