<template>
  <view :id="attrs.id" :class="'_block _'+name+' '+attrs.class" :style="attrs.style">
    <block v-for="(n, i) in childs" v-bind:key="i">
      <!-- 图片 -->
      <!-- 占位图 -->
      <image v-if="n.name==='img'&&((opts[1]&&!ctrl[i])||ctrl[i]<0)" class="_img" :style="n.attrs.style" :src="ctrl[i]<0?opts[2]:opts[1]" mode="widthFix" />
      <!-- 显示图片 -->
      <!-- #ifdef H5 || (APP-PLUS && VUE2) -->
      <img v-if="n.name==='img'" :id="n.attrs.id" :class="'_img '+n.attrs.class" :style="(ctrl[i]===-1?'display:none;':'')+n.attrs.style" :src="n.attrs.src||(ctrl.load?n.attrs['data-src']:'')" :data-i="i" @load="imgLoad" @error="mediaError" @tap.stop="imgTap" @longpress="imgLongTap" />
      <!-- #endif -->
      <!-- #ifndef H5 || APP-PLUS -->
      <image v-if="n.name==='img'" :id="n.attrs.id" :class="'_img '+n.attrs.class" :style="(ctrl[i]===-1?'display:none;':'')+'width:'+(ctrl[i]||1)+'px;height:1px;'+n.attrs.style" :src="n.attrs.src" :mode="!n.h?'widthFix':(!n.w?'heightFix':'')" :lazy-load="opts[0]" :webp="n.webp" :show-menu-by-longpress="opts[3]&&!n.attrs.ignore" :image-menu-prevent="!opts[3]||n.attrs.ignore" :data-i="i" @load="imgLoad" @error="mediaError" @tap.stop="imgTap" @longpress="imgLongTap" />
      <!-- #endif -->
      <!-- #ifdef APP-PLUS && VUE3 -->
      <image v-if="n.name==='img'" :id="n.attrs.id" :class="'_img '+n.attrs.class" :style="(ctrl[i]===-1?'display:none;':'')+'width:'+(ctrl[i]||1)+'px;'+n.attrs.style" :src="n.attrs.src||(ctrl.load?n.attrs['data-src']:'')" :mode="!n.h?'widthFix':(!n.w?'heightFix':'')" :data-i="i" @load="imgLoad" @error="mediaError" @tap.stop="imgTap" @longpress="imgLongTap" />
      <!-- #endif -->
      <!-- 文本 -->
      <!-- #ifndef MP-BAIDU || MP-ALIPAY || MP-TOUTIAO -->
      <text v-else-if="n.text" :user-select="n.us" decode>{{n.text}}</text>
      <!-- #endif -->
      <text v-else-if="n.name==='br'">\n</text>
      <!-- 链接 -->
      <view v-else-if="n.name==='a'" :id="n.attrs.id" :class="(n.attrs.href?'_a ':'')+n.attrs.class" hover-class="_hover" :style="'display:inline;'+n.attrs.style" :data-i="i" :appid="n.attrs.appid" :redirectype="n.attrs.redirectype" :jumptype="n.attrs.jumptype" :feedid="n.attrs.feedid" :path="n.attrs.path" :src="n.attrs.href" :filetype="n.attrs.filetype" @tap.stop="linkTap">
        <node name="span" :childs="n.children" :opts="opts" style="display:inherit" />
        <text v-if="n.attrs.redirectype === 'miniapp' || n.attrs.redirectype === 'apppage'" class="iconfont icon-miniapp-logo" />
      </view>
      <!-- 视频 -->
      <!-- #ifdef APP-PLUS -->
      <view v-else-if="n.html" :id="n.attrs.id" :class="'_video '+n.attrs.class" :style="n.attrs.style" v-html="n.html" @vplay.stop="play" />
      <!-- #endif -->
      <!-- #ifndef APP-PLUS -->
      <video v-else-if="n.name==='video'" :id="n.attrs.id" :class="'wm-video ' + n.attrs.class" :style="n.attrs.style" :autoplay="n.attrs.autoplay" :controls="n.attrs.controls" :loop="n.attrs.loop" :muted="n.attrs.muted" :object-fit="n.attrs['object-fit']" :poster="n.attrs.poster" :src="n.src[ctrl[i]||0]" :data-i="i" @play="play" @error="mediaError" />
      <!-- #endif -->
      <!-- #ifdef H5 || APP-PLUS -->
      <iframe v-else-if="n.name==='iframe'" :style="n.attrs.style" :allowfullscreen="n.attrs.allowfullscreen" :frameborder="n.attrs.frameborder" :src="n.attrs.src" />
      <embed v-else-if="n.name==='embed'" :style="n.attrs.style" :src="n.attrs.src" />
      <!-- #endif -->
      <!-- #ifndef MP-TOUTIAO || ((H5 || APP-PLUS) && VUE3) -->
      <!-- 音频 -->
      <audio v-else-if="n.name==='audio'" :id="n.attrs.id" :class="'wm-audio ' + n.attrs.class" :style="n.attrs.style" :author="n.attrs.author || n.attrs.singer" :controls="n.attrs.controls" :loop="n.attrs.loop" :name="n.attrs.name || n.attrs.title" :poster="n.attrs.poster" :src="n.src[ctrl[i]||0]" :data-i="i" @play="play" @error="mediaError" />
      <!-- #endif -->
      <view v-else-if="(n.name==='table'&&n.c)||n.name==='li'" :id="n.attrs.id" :class="'_'+n.name+' '+n.attrs.class" :style="n.attrs.style">
        <node v-if="n.name==='li'" :childs="n.children" :opts="opts" />
        <view v-else v-for="(tbody, x) in n.children" v-bind:key="x" :class="'_'+tbody.name+' '+tbody.attrs.class" :style="tbody.attrs.style">
          <node v-if="tbody.name==='td'||tbody.name==='th'" :childs="tbody.children" :opts="opts" />
          <block v-else v-for="(tr, y) in tbody.children" v-bind:key="y">
            <view v-if="tr.name==='td'||tr.name==='th'" :class="'_'+tr.name+' '+tr.attrs.class" :style="tr.attrs.style">
              <node :childs="tr.children" :opts="opts" />
            </view>
            <view v-else :class="'_'+tr.name+' '+tr.attrs.class" :style="tr.attrs.style">
              <view v-for="(td, z) in tr.children" v-bind:key="z" :class="'_'+td.name+' '+td.attrs.class" :style="td.attrs.style">
                <node :childs="td.children" :opts="opts" />
              </view>
            </view>
          </block>
        </view>
      </view>
      <!-- wm-custom -->
      <!-- 跳转短代码 -->
      <block v-else-if="n.name==='minappershortcode'">
        <view class="wmcode-view" :appid="n.attrs.appid" :redirectype="n.attrs.redirectype" :jumptype="n.attrs.jumptype" :url="n.attrs.url" :path="n.attrs.path" @tap="goTo">
          <view class="wmcode-inner">
            <view class="wmcode-img">
              <image mode="aspectFill" :src="n.attrs.poster" />
            </view>
            <view class="wmcode-content">
              <view class="wmcode-text-box">
                <view class="wmcode-text-title">{{n.attrs.title}}</view>
                <view class="wmcode-text-des" v-if="n.attrs.description">
                  {{n.attrs.description}}
                </view>
              </view>
              <view class="wmcode-btn-box">
                <view class="wmcode-price" v-if="n.attrs.codetype=='goods'">
                  {{n.attrs.price ? '￥' + n.attrs.price : ''}}
                </view>
                <text class="cost-price" v-if="n.attrs.marketprice">￥{{n.attrs.marketprice}}</text>
                <view class="wmcode-price" v-else />
                <view class="wmcode-btn-goods" v-if="n.attrs.codetype=='goods'">
                  {{n.attrs.buttontext}}
                </view>
                <view class="wmcode-btn" v-if="n.attrs.codetype !='goods'">
                  {{n.attrs.buttontext}}
                </view>
              </view>
            </view>
          </view>
        </view>
      </block>
      <!-- 视频号主页短代码 -->
      <block v-else-if="n.name==='minapperchannels'">
        <view class="wm-channels-page" :channelsid="n.attrs.channelsid" @tap.stop="goChannels">
          <view class="wm-channels-page-content">
            <image class="image" v-if="n.attrs.channelslogo" mode="aspectFill" :src="n.attrs.channelslogo" />
            <view class="wm-channels-page-info">
              <view class="wm-channels-name">{{n.attrs.channelstitle}}</view>
              <view class="wm-channels-des">{{n.attrs.channelsdesc}}</view>
            </view>
          </view>
          <view class="wm-channels-page-footer">
            <view>视频号主页</view>
            <text class="iconfont icon-channels" />
          </view>
        </view>
      </block>
      <!-- 视频号视频短代码 -->
      <block v-else-if="n.name==='minapperchannelsactivity'">
        <view class="wm-channels" :channelsid="n.attrs.channelsid" :feedid="n.attrs.feedid"  @tap.stop="openActivity">
          <view class="wm-channels-img">
            <image v-if="n.attrs.feedcover" class="image" mode="aspectFill" :src="n.attrs.feedcover" />
            <view v-if="n.attrs.feedtitle" class="wm-channels-title">
              <text class="wm-channels-text">{{n.attrs.feedtitle}}</text>
            </view>
          </view>
          <view class="wm-channels-content" :channelsid="n.attrs.channelsid"  @tap.stop="goChannels">
            <view class="wm-channels-info">
              <image class="image" v-if="n.attrs.channelslogo" mode="aspectFill" :src="n.attrs.channelslogo" />
              <view class="wm-channels-name">{{n.attrs.channelstitle}} · 视频</view>
            </view>
            <text class="iconfont icon-channels" />
          </view>
        </view>
      </block>
      <!-- 视频号活动短代码 -->
      <block v-else-if="n.name==='minapperchannelsevent'">
        <view class="wm-channels" :channelsid="n.attrs.channelsid" :eventid="n.attrs.eventid"  @tap.stop="openEvent">
          <view class="wm-channels-img">
            <image v-if="n.attrs.eventcover" class="image" mode="aspectFill" :src="n.attrs.eventcover" />
            <view v-if="n.attrs.eventtitle" class="wm-channels-title">
              <text class="wm-channels-text">{{n.attrs.eventtitle}}</text>
            </view>
          </view>
          <view class="wm-channels-content" :channelsid="n.attrs.channelsid"  @tap.stop="goChannels">
            <view class="wm-channels-info">
              <image class="image" v-if="n.attrs.channelslogo" mode="aspectFill" :src="n.attrs.channelslogo" />
              <view class="wm-channels-name">{{n.attrs.channelstitle}} · 活动</view>
            </view>
            <text class="iconfont icon-channels" />
          </view>
        </view>
      </block>
      <!-- 广告短代码 -->
      <block v-else-if="n.name==='minapperad'">
        <ad :unit-id="n.attrs.unitid" :ad-type="n.attrs.adtype" :ad-theme="n.attrs.adtheme" :ad-intervals="n.attrs.adintervals" />
      </block>
      <!-- 地图短代码 -->
      <block v-else-if="n.name==='minappermap'">
        <view>
          <map id="myMap" style="width: 100%; height: 420rpx;" :latitude="n.attrs.latitude" :longitude="n.attrs.longitude" :markers="n.attrs.markers" :title="n.attrs.title" :add="n.attrs.address" show-location @markertap="openmap"></map>
          <view class="map-des" :latitude="n.attrs.latitude" :longitude="n.attrs.longitude" :title="n.attrs.title" :add="n.attrs.address" @tap="openmap">
            <view class="distance">
              <view class="addr">{{n.attrs.address}}</view>
              {{n.attrs.distance ? (n.attrs.distance + 'km') : ''}}
            </view>
            <text class="iconfont icon-a-link" />
          </view>
        </view>
      </block>
      <!-- 全局商品短代码 -->
      <block v-else-if="n.name==='minapperglobalgoods'">
        <view class="wmcode-view" :productid="n.attrs.id" :path="n.attrs.path" @tap="goToSinshopproduct">
          <view class="wmcode-inner">
            <view class="wmcode-img">
              <image mode="aspectFill" :src="n.attrs.poster" />
            </view>
            <view class="wmcode-content">
              <view class="wmcode-text-box">
                <view class="wmcode-text-title">{{n.attrs.title}}</view>
                <view class="wmcode-text-des" v-if="n.attrs.description">
                  {{n.attrs.description}}
                </view>
              </view>
              <view class="wmcode-btn-box">
                <view class="wmcode-price">{{n.attrs.price ? '￥' + n.attrs.price : ''}}</view>
                <text class="cost-price" v-if="n.attrs.marketprice">￥{{n.attrs.marketprice}}</text>
                <view class="wmcode-btn-goods">{{n.attrs.buttontext}}</view>
              </view>
            </view>
          </view>
        </view>
      </block>
      <!-- 单一商品短代码 -->
      <block v-else-if="n.name==='minappergoods'">
        <view class="wmcode-view" :productid="n.attrs.id" :path="n.attrs.path" @tap="goToSinshopproduct">
          <view class="wmcode-inner">
            <view class="wmcode-img">
              <image mode="aspectFill" :src="n.attrs.poster" />
            </view>
            <view class="wmcode-content">
              <view class="wmcode-text-box">
                <view class="wmcode-text-title">{{n.attrs.title}}</view>
                <view class="wmcode-text-des" v-if="n.attrs.description">
                  {{n.attrs.description}}
                </view>
              </view>
              <view class="wmcode-btn-box">
                <view class="wmcode-price">{{n.attrs.price ? '￥' + n.attrs.price : ''}}</view>
                <text class="cost-price" v-if="n.attrs.marketprice">￥{{n.attrs.marketprice}}</text>
                <view class="wmcode-btn-goods">{{n.attrs.buttontext}}</view>
              </view>
            </view>
          </view>
        </view>
      </block>
      <!-- 网盘短代码 -->
      <block v-else-if="n.name==='baidupan'">
        <view class="baidu-disk">
          <view class="header">
            <view class="circle">
              <text class="iconfont icon-baidu-disk" />
            </view>
            <view class="title">百度网盘</view>
          </view>
          <view class="url">链接：{{ n.attrs.href }}</view>
          <view class="code">提取码：{{ n.attrs.code }}</view>
          <view class="footer">
            <view class="btn btn-copy" :code="n.attrs.code" @tap="onbaiPanCopy">复制提取码</view>
            <view class="btn" :key="n.attrs.key"  @tap="onbaiduPanOpen">打开网盘</view>
          </view>
        </view>
      </block>
      <!-- 相册滑动短代码 -->
      <block v-else-if="n.name==='minappergallery'">
        <swiper indicator-dots indicator-color="rgba(255, 255, 255, .3)" indicator-active-color="rgba(255, 255, 255, .8)" interval="10000" autoplay="true" circular="true" style="height: 600rpx">
          <swiper-item v-for="(item, idx) in n.attrs.images" :key="idx" :imgallsrc="item.allimages" :imgsrc="item.imageurl" @tap="previewImage">
            <image mode="aspectFill" style="height: 600rpx;width:100%;" :src="item.imageurl" />
          </swiper-item>
        </swiper>
      </block>
      
      <!-- 富文本 -->
      <!-- #ifdef H5 || ((MP-WEIXIN || MP-QQ || APP-PLUS || MP-360) && VUE2) -->
      <rich-text v-else-if="!n.c&&!handler.isInline(n.name, n.attrs.style)" :id="n.attrs.id" :style="n.f" :nodes="[n]" />
      <!-- #endif -->
      <!-- #ifndef H5 || ((MP-WEIXIN || MP-QQ || APP-PLUS || MP-360) && VUE2) -->
      <rich-text v-else-if="!n.c" :id="n.attrs.id" :style="n.f+';display:inline'" :preview="false" :nodes="[n]" />
      <!-- #endif -->
      <!-- 继续递归 -->
      <view v-else-if="n.c===2" :id="n.attrs.id" :class="'_block _'+n.name+' '+n.attrs.class" :style="n.f+';'+n.attrs.style">
        <node v-for="(n2, j) in n.children" v-bind:key="j" :style="n2.f" :name="n2.name" :attrs="n2.attrs" :childs="n2.children" :opts="opts" />
      </view>
      <node v-else :style="n.f" :name="n.name" :attrs="n.attrs" :childs="n.children" :opts="opts" />
    </block>
  </view>
</template>
<script module="handler" lang="wxs">
// 行内标签列表
var inlineTags = {
  abbr: true,
  b: true,
  big: true,
  code: true,
  del: true,
  em: true,
  i: true,
  ins: true,
  label: true,
  q: true,
  small: true,
  span: true,
  strong: true,
  sub: true,
  sup: true
}
/**
 * @description 判断是否为行内标签
 */
module.exports = {
  isInline: function (tagName, style) {
    return inlineTags[tagName] || (style || '').indexOf('display:inline') !== -1
  }
}
</script>
<script>

import node from './node'
export default {
  name: 'node',
  options: {
    // #ifdef MP-WEIXIN
    virtualHost: true,
    // #endif
    // #ifdef MP-TOUTIAO
    addGlobalClass: false
    // #endif
  },
  data () {
    return {
      ctrl: {}
    }
  },
  props: {
    name: String,
    attrs: {
      type: Object,
      default () {
        return {}
      }
    },
    childs: Array,
    opts: Array
  },
  components: {

    // #ifndef H5 && VUE3
    node
    // #endif
  },
  mounted () {
    this.$nextTick(() => {
      for (this.root = this.$parent; this.root.$options.name !== 'mp-html'; this.root = this.root.$parent);
    })
    // #ifdef H5 || APP-PLUS
    if (this.opts[0]) {
      let i
      for (i = this.childs.length; i--;) {
        if (this.childs[i].name === 'img') break
      }
      if (i !== -1) {
        this.observer = uni.createIntersectionObserver(this).relativeToViewport({
          top: 500,
          bottom: 500
        })
        this.observer.observe('._img', res => {
          if (res.intersectionRatio) {
            this.$set(this.ctrl, 'load', 1)
            this.observer.disconnect()
          }
        })
      }
    }
    // #endif
  },
  beforeDestroy () {
    // #ifdef H5 || APP-PLUS
    if (this.observer) {
      this.observer.disconnect()
    }
    // #endif
  },
  methods:{
    // #ifdef MP-WEIXIN
    toJSON () { },
    // #endif
    /**
     * @description 播放视频事件
     * @param {Event} e
     */
    play (e) {
      this.root.$emit('play')
      // #ifndef APP-PLUS
      if (this.root.pauseVideo) {
        let flag = false
        const id = e.target.id
        for (let i = this.root._videos.length; i--;) {
          if (this.root._videos[i].id === id) {
            flag = true
          } else {
            this.root._videos[i].pause() // 自动暂停其他视频
          }
        }
        // 将自己加入列表
        if (!flag) {
          const ctx = uni.createVideoContext(id
            // #ifndef MP-BAIDU
            , this
            // #endif
          )
          ctx.id = id
          this.root._videos.push(ctx)
        }
      }
      // #endif
    },

    /**
     * @description 图片点击事件
     * @param {Event} e
     */
    imgTap (e) {
      const node = this.childs[e.currentTarget.dataset.i]
      if (node.a) {
        this.linkTap(node.a)
        return
      }
      if (node.attrs.ignore) return
      // #ifdef H5 || APP-PLUS
      node.attrs.src = node.attrs.src || node.attrs['data-src']
      // #endif
      this.root.$emit('imgtap', node.attrs)
      // 自动预览图片
      if (this.root.previewImg) {
        uni.previewImage({
          // #ifdef MP-WEIXIN
          showmenu: this.root.showImgMenu,
          // #endif
          // #ifdef MP-ALIPAY
          enablesavephoto: this.root.showImgMenu,
          enableShowPhotoDownload: this.root.showImgMenu,
          // #endif
          current: parseInt(node.attrs.i),
          urls: this.root.imgList
        })
      }
    },

    /**
     * @description 图片长按
     */
    imgLongTap (e) {
      // #ifdef APP-PLUS
      const attrs = this.childs[e.currentTarget.dataset.i].attrs
      if (this.opts[3] && !attrs.ignore) {
        uni.showActionSheet({
          itemList: ['保存图片'],
          success: () => {
            const save = path => {
              uni.saveImageToPhotosAlbum({
                filePath: path,
                success () {
                  uni.showToast({
                    title: '保存成功'
                  })
                }
              })
            }
            if (this.root.imgList[attrs.i].startsWith('http')) {
              uni.downloadFile({
                url: this.root.imgList[attrs.i],
                success: res => save(res.tempFilePath)
              })
            } else {
              save(this.root.imgList[attrs.i])
            }
          }
        })
      }
      // #endif
    },

    /**
     * @description 图片加载完成事件
     * @param {Event} e
     */
    imgLoad (e) {
      const i = e.currentTarget.dataset.i
      /* #ifndef H5 || (APP-PLUS && VUE2) */
      if (!this.childs[i].w) {
        // 设置原宽度
        this.$set(this.ctrl, i, e.detail.width)
      } else /* #endif */ if ((this.opts[1] && !this.ctrl[i]) || this.ctrl[i] === -1) {
        // 加载完毕，取消加载中占位图
        this.$set(this.ctrl, i, 1)
      }
    },

    /**
     * @description 链接点击事件
     * @param {Event} e
     */
    linkTap (e) {
      const node = e.currentTarget ? this.childs[e.currentTarget.dataset.i] : {}
      const attrs = node.attrs || e
      const href = attrs.href
      this.root.$emit('linktap', Object.assign({
        innerText: this.root.getText(node.children || []) // 链接内的文本内容
      }, attrs))
      if (href) {
        if (href[0] === '#') {
          // 跳转锚点
          this.root.navigateTo(href.substring(1)).catch(() => { })
        } else if (href.split('?')[0].includes('://')) {
          // 复制外部链接
          if (this.root.copyLink) {
            // #ifdef H5
            window.open(href)
            // #endif
            // #ifdef MP
            uni.setClipboardData({
              data: href,
              success: () =>
                uni.showToast({
                  title: '链接已复制'
                })
            })
            // #endif
            // #ifdef APP-PLUS
            plus.runtime.openWeb(href)
            // #endif
          }
        } else {
          // 跳转页面
          uni.navigateTo({
            url: href,
            fail () {
              uni.switchTab({
                url: href,
                fail () { }
              })
            }
          })
        }
      }
    },

    /**
     * @description 错误事件
     * @param {Event} e
     */
    mediaError (e) {
      const i = e.currentTarget.dataset.i
      const node = this.childs[i]
      // 加载其他源
      if (node.name === 'video' || node.name === 'audio') {
        let index = (this.ctrl[i] || 0) + 1
        if (index > node.src.length) {
          index = 0
        }
        if (index < node.src.length) {
          this.$set(this.ctrl, i, index)
          return
        }
      } else if (node.name === 'img') {
        // #ifdef H5 && VUE3
        if (this.opts[0] && !this.ctrl.load) return
        // #endif
        // 显示错误占位图
        if (this.opts[2]) {
          this.$set(this.ctrl, i, -1)
        }
      }
      if (this.root) {
        this.root.$emit('error', {
          source: node.name,
          attrs: node.attrs,
          // #ifndef H5 && VUE3
          errMsg: e.detail.errMsg
          // #endif
        })
      }
    },

    // 预览图片
    previewImage(e) {
      var imgallsrc = e.currentTarget.dataset.imgallsrc
      var imgsrc = e.currentTarget.dataset.imgsrc
      uni.previewImage({
        current: imgsrc,
        urls: imgallsrc
      })
    },

    // 跳转
    goTo(e){
      var appid=e.currentTarget.dataset.appid;
      var redirectype=e.currentTarget.dataset.redirectype;   
      var path=e.currentTarget.dataset.path;
      var url=e.currentTarget.dataset.url;
      var jumptype=e.currentTarget.dataset.jumptype;

      if (redirectype == 'apppage') { //跳转到小程序内部页面         
        uni.navigateTo({
          url: path
        })
      } else if (redirectype == 'webpage') //跳转到web-view内嵌的页面
      {
        url = '../webview/webview?url=' + url;
        uni.navigateTo({
          url: url
        })
      }
      else if (redirectype == 'miniapp') //跳转其他小程序
       {
          if(jumptype=='embedded') {
            uni.openEmbeddedMiniProgram({
              appId: appid,
              path: path
            })
          } else {
            uni.navigateToMiniProgram({
              appId: appid,
              path: path
            })
          }
      }
    },

    // 跳转视频号
    goChannels(e){
      let channelsid = e.currentTarget.dataset.channelsid
      uni.openChannelsUserProfile({
        finderUserName:channelsid
      })
    },

      // 跳转视频号视频
      openActivity(e){
        let channelsid = e.currentTarget.dataset.channelsid
        let feedId=e.currentTarget.dataset.feedid
        uni.openChannelsActivity({
          finderUserName:channelsid,
          feedId: feedId
          
        })
      },

      // 跳转视频号视频
      openEvent(e){
        let channelsid = e.currentTarget.dataset.channelsid
        let eventId=e.currentTarget.dataset.eventid
        uni.openChannelsEvent({
          finderUserName:channelsid,
          eventId: eventId
          
        })
      },

    // 跳转
    goToSinshopproduct(e){
      var path=e.currentTarget.dataset.path;
      uni.navigateTo({
        url: path
      })
    },

    // 打开地图查看位置
    openmap(e) { 
      var latitude = Number(e.currentTarget.dataset.latitude)
      var longitude = Number(e.currentTarget.dataset.longitude)
      var address = e.currentTarget.dataset.address
      var name=e.currentTarget.dataset.title;
      wx.openLocation({
        latitude: latitude,
        longitude: longitude,
        scale: 15,
        name: name,
        address: address
      })
    },

    // a标签跳转和复制链接
    onTapATag(e) {
      let href = e.currentTarget.dataset.src
      let appid = e.currentTarget.dataset.appid
      let redirectype = e.currentTarget.dataset.redirectype
      let path = e.currentTarget.dataset.path

      // 判断a标签src里是不是插入的文档链接
      let isDoc = /\.(doc|docx|xls|xlsx|ppt|pptx|pdf)$/.test(href)

      if (isDoc) {
        this.openLinkDoc(e)
        return
      }

      if(redirectype) {
        if (redirectype == 'apppage') { //跳转到小程序内部页面         
          uni.navigateTo({
            url: path
          })
        } else if (redirectype == 'webpage') //跳转到web-view内嵌的页面
        {
          href = '../webview/webview?url=' + href;
          uni.navigateTo({
            url: href
          })
        }
        else if (redirectype == 'miniapp') //跳转其他小程序
        {
          uni.navigateToMiniProgram({
            appId: appid,
            path: path
          })
        }
      } else {
        uni.setClipboardData({
          data: href,
          success: () =>
            uni.showToast({
              title: '链接已复制'
            })
        })
      }
    },
    onbaiPanCopy(e) {
      const code =  e.currentTarget.dataset.code
      if (!code) {
        uni.showToast({
          title: '提取码不存在！',
          icon: "none",
          duration: 3000
        })
        return
      }

      uni.setClipboardData({
        data: code,
        success: function (res) {
          uni.getClipboardData({
            success: function (res) {
              uni.showToast({
                title: '复制成功',
                icon: "success",
                duration: 3000
              })
            }
          })
        }
      })
    },

    // 打开网盘小程序
    onbaiduPanOpen(e) {
      const key = e.currentTarget.dataset.key
      if (key) {
        let path = `pages/netdisk_share/share?scene=${key}`
        uni.navigateToMiniProgram({
          appId: 'wxdcd3d073e47d1742',
          path
        })
      } else {
        uni.showToast({
          title: '链接不存在！',
          icon: "none",
          duration: 3000
        })
      }
    },

    // 打开文档
    async openLinkDoc(e) {
      let url
      let fileType
      let src = e.currentTarget.dataset.src || ''

      // 如果是a标签href中插入的文档
      const res = await getApp().$api.getBaseConfig()
      console.log('domains')
      console.log(res)
      let info = res.settings || {}
      let domains = info.downloadfile_domain && info.downloadfile_domain.split(',') || []

      let isHave = domains.find(m => src.includes(m))
      if(!isHave) {
        uni.setClipboardData({
          data: src,
          success: () =>
            uni.showToast({
              title: '链接已复制'
            })
        })
        return
      }

      let isDoc = /\.(doc|docx|xls|xlsx|ppt|pptx|pdf)$/.test(src)
      if (src && isDoc){
        url = src
        fileType = /doc|docx|xls|xlsx|ppt|pptx|pdf$/.exec(src)[0]
      } else {
        url = e.currentTarget.dataset.filelink
        fileType = e.currentTarget.dataset.filetype
      }

      uni.downloadFile({
        url,
        success: function (res) {
          const filePath = res.tempFilePath
          uni.openDocument({
            filePath,
            // fieldType
          })
        }
      })
    },
  }
}
</script>
<style>
@import url(./wm.css);
/* a 标签默认效果 */
._a {
  padding: 1.5px 0 1.5px 0;
  color: #366092;
  word-break: break-all;
}

/* a 标签点击态效果 */
._hover {
  /* text-decoration: underline; */
  opacity: 0.7;
}

/* 图片默认效果 */
._img {
  max-width: 100%;
  -webkit-touch-callout: none;
}

/* 内部样式 */
._block {
  display: block;
}

._b,
._strong {
  font-weight: bold;
}

._code {
  font-family: monospace;
}

._del {
  text-decoration: line-through;
}

._em,
._i {
  font-style: italic;
}

._h1 {
  font-size: 2em;
}

._h2 {
  font-size: 1.5em;
}

._h3 {
  font-size: 1.17em;
}

._h5 {
  font-size: 0.83em;
}

._h6 {
  font-size: 0.67em;
}

._h1,
._h2,
._h3,
._h4,
._h5,
._h6 {
  display: block;
  font-weight: bold;
}

._image {
  height: 1px;
}

._ins {
  text-decoration: underline;
}

._li {
  display: list-item;
}

._ol {
  list-style-type: decimal;
}

._ol,
._ul {
  display: block;
  padding-left: 40px;
  margin: 1em 0;
}

._q::before {
  content: '"';
}

._q::after {
  content: '"';
}

._sub {
  font-size: smaller;
  vertical-align: sub;
}

._sup {
  font-size: smaller;
  vertical-align: super;
}

._thead,
._tbody,
._tfoot {
  display: table-row-group;
}

._tr {
  display: table-row;
}

._td,
._th {
  display: table-cell;
  vertical-align: middle;
}

._th {
  font-weight: bold;
  text-align: center;
}

._ul {
  list-style-type: disc;
}

._ul ._ul {
  margin: 0;
  list-style-type: circle;
}

._ul ._ul ._ul {
  list-style-type: square;
}

._abbr,
._b,
._code,
._del,
._em,
._i,
._ins,
._label,
._q,
._span,
._strong,
._sub,
._sup {
  display: inline;
}

/* #ifdef APP-PLUS */
._video {
  width: 300px;
  height: 225px;
}
/* #endif */
</style>