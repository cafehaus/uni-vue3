<template>
  <view :id="attrs.id" :class="'_block _'+name+' '+attrs.class" :style="attrs.style">
    <block v-for="(n, i) in childs" v-bind:key="i">
      <!-- 图片 -->
      <!-- 占位图 -->
      <image v-if="n.name==='img'&&!n.t&&((opts[1]&&!ctrl[i])||ctrl[i]<0)" class="_img" :style="n.attrs.style" :src="ctrl[i]<0?opts[2]:opts[1]" mode="widthFix" />
      <!-- 显示图片 -->
      <!-- #ifdef H5 || (APP-PLUS && VUE2) -->
      <img v-if="n.name==='img'" :id="n.attrs.id" :class="'_img '+n.attrs.class" :style="(ctrl[i]===-1?'display:none;':'')+n.attrs.style" :src="n.attrs.src||(ctrl.load?n.attrs['data-src']:'')" :data-i="i" @load="imgLoad" @error="mediaError" @tap.stop="imgTap" @longpress="imgLongTap" />
      <!-- #endif -->
      <!-- #ifndef H5 || (APP-PLUS && VUE2) -->
      <!-- 表格中的图片，使用 rich-text 防止大小不正确 -->
      <rich-text v-if="n.name==='img'&&n.t" :style="'display:'+n.t" :nodes="'<img class=\'_img\' style=\''+n.attrs.style+'\' src=\''+n.attrs.src+'\'>'" :data-i="i" @tap.stop="imgTap" />
      <!-- #endif -->
      <!-- #ifndef H5 || APP-PLUS -->
      <image v-else-if="n.name==='img'" :id="n.attrs.id" :class="'_img '+n.attrs.class" :style="(ctrl[i]===-1?'display:none;':'')+'width:'+(ctrl[i]||1)+'px;height:1px;'+n.attrs.style" :src="n.attrs.src" :mode="!n.h?'widthFix':(!n.w?'heightFix':'')" :lazy-load="opts[0]" :webp="n.webp" :show-menu-by-longpress="opts[3]&&!n.attrs.ignore" :image-menu-prevent="!opts[3]||n.attrs.ignore" :data-i="i" @load="imgLoad" @error="mediaError" @tap.stop="imgTap" @longpress="imgLongTap" />
      <!-- #endif -->
      <!-- #ifdef APP-PLUS && VUE3 -->
      <image v-else-if="n.name==='img'" :id="n.attrs.id" :class="'_img '+n.attrs.class" :style="(ctrl[i]===-1?'display:none;':'')+'width:'+(ctrl[i]||1)+'px;'+n.attrs.style" :src="n.attrs.src||(ctrl.load?n.attrs['data-src']:'')" :mode="!n.h?'widthFix':(!n.w?'heightFix':'')" :data-i="i" @load="imgLoad" @error="mediaError" @tap.stop="imgTap" @longpress="imgLongTap" />
      <!-- #endif -->
      <!-- 文本 -->
      <!-- #ifdef MP-WEIXIN -->
      <text v-else-if="n.text" :user-select="opts[4]=='force'&&isiOS" decode>{{n.text}}</text>
      <!-- #endif -->
      <!-- #ifndef MP-WEIXIN || MP-BAIDU || MP-ALIPAY || MP-TOUTIAO || MP-KUAISHOU -->
      <text v-else-if="n.text" decode>{{n.text}}</text>
      <!-- #endif -->
      <text v-else-if="n.name==='br'">\n</text>
      <!-- 链接 -->
      <view v-else-if="n.name==='a'" :id="n.attrs.id" :class="(n.attrs.href?'_a ':'')+n.attrs.class" hover-class="_hover" :style="'display:inline;'+n.attrs.style" :data-i="i" :appid="n.attrs.appid" :redirectype="n.attrs.redirectype" :jumptype="n.attrs.jumptype" :feedid="n.attrs.feedid" :path="n.attrs.path" :src="n.attrs.href" :filetype="n.attrs.filetype" @tap.stop="linkTap">
        <node name="span" :childs="n.children" :opts="opts" style="display:inherit;" />
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
        <!-- #ifndef MP-KUAISHOU -->
        <ad :unit-id="n.attrs.unitid" :ad-type="n.attrs.adtype" :ad-theme="n.attrs.adtheme" :ad-intervals="n.attrs.adintervals" />
        <!-- #endif -->
        <!-- #ifdef MP-KUAISHOU -->
        <ad :unit-id="n.attrs.unitid" :type="n.attrs.adtype" :ad-theme="n.attrs.adtheme" :ad-intervals="n.attrs.adintervals" />
        <!-- #endif -->
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
      <my-audio v-else-if="n.name=='audio'" :class="n.attrs.class" :style="n.attrs.style" :aid="n.attrs.id" :author="n.attrs.author" :controls="n.attrs.controls" :autoplay="n.attrs.autoplay" :loop="n.attrs.loop" :name="n.attrs.name" :poster="n.attrs.poster" :src="n.src[ctrl[i]||0]" :data-i="i" data-source="audio" @play="play" @error="mediaError" /><rich-text v-else-if="n.attrs&&n.attrs['data-content']" :nodes="[n]" :data-content="n.attrs['data-content']" :data-lang="n.attrs['data-lang']" @longpress="copyCode" />
      <!-- 富文本 -->
      <!-- #ifdef H5 || ((MP-WEIXIN || MP-QQ || APP-PLUS || MP-360) && VUE2) -->
      <rich-text v-else-if="!n.c&&!handler.isInline(n.name, n.attrs.style)" :id="n.attrs.id" :style="n.f+';line-height:1.8;text-align:justify;word-break:break-all;'" :user-select="opts[4]" :nodes="[n]" />
      <!-- #endif -->
      <!-- #ifndef H5 || ((MP-WEIXIN || MP-QQ || APP-PLUS || MP-360) && VUE2) -->
      <rich-text v-else-if="!n.c" :id="n.attrs.id" :style="n.f+';display:inline;line-height:1.8;text-align:justify;word-break:break-all;'" :preview="false"  :selectable="opts[4]" :user-select="opts[4]" :nodes="[n]" />
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
import myAudio from '../audio/audio'

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
      ctrl: {},
      // #ifdef MP-WEIXIN
      isiOS: uni.getSystemInfoSync().system.includes('iOS')
      // #endif
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
myAudio,

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
  methods:{copyCode (e) {
      uni.showActionSheet({
        itemList: ['复制代码'],
        success: () =>
          uni.setClipboardData({
            data: e.currentTarget.dataset.content
          })
      })
    },
    // #ifdef MP-WEIXIN
    toJSON () { return this },
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
          if (this.root.playbackRate) {
            ctx.playbackRate(this.root.playbackRate)
          }
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
      this.checkReady()
    },

    /**
     * @description 检查是否所有图片加载完毕
     */
     checkReady () {
      if (!this.root.lazyLoad) {
        this.root._unloadimgs -= 1
        if (!this.root._unloadimgs) {
          setTimeout(() => {
            this.root.getRect().then(rect => {
              this.root.$emit('ready', rect)
            })
          },350)
        }
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
      console.log(e)
      console.log(node)
      console.log(attrs)
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
            if (attrs.redirectype) {
              this.goTo(null, {
                appid: attrs.appid,
                redirectype: attrs.redirectype,
                path: attrs.path,
                jumptype: attrs.jumptype,
                url: attrs.href
              })
            } else {
              uni.setClipboardData({
                data: href,
                success: () =>
                  uni.showToast({
                    title: '链接已复制'
                  })
              })
            }
            // #endif
            // #ifdef APP-PLUS
            plus.runtime.openWeb(href)
            // #endif
          }
        } else {
          // 跳转页面
          // uni.navigateTo({
          //   url: href,
          //   fail () {
          //     uni.switchTab({
          //       url: href,
          //       fail () { }
          //     })
          //   }
          // })
          this.goTo(null, {
            appid: attrs.appid,
            redirectype: attrs.redirectype,
            path: attrs.path,
            jumptype: attrs.jumptype,
            url: attrs.href
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
        this.checkReady()
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
    goTo(e, info = {}){
      const eInfo = (e && e.currentTarget && e.currentTarget.dataset) ? e.currentTarget.dataset : {}
      let appid = info.appid || eInfo.appid
      let redirectype = info.redirectype || eInfo.redirectype  
      let path = info.path || eInfo.path
      let url = info.url || eInfo.url
      let jumptype = info.jumptype || eInfo.jumptype

      if (redirectype == 'apppage') { //跳转到小程序内部页面         
        uni.navigateTo({
          url: path
        })
      }
      
      if (redirectype == 'webpage') { //跳转到web-view内嵌的页面
        url = '../webview/webview?url=' + url;
        uni.navigateTo({
          url: url
        })
      }
      
      let isWx = false
      let isMp = false
      // #ifdef MP-WEIXIN
      isWx = true
      // #endif
      // #ifdef MP
      isMp = true
      // #endif
      
      if (appid && isMp && redirectype == 'miniapp') { //跳转其他小程序
        let appidList =  appid.split(',')
        let reg = /^weixin-.*/
        // #ifdef MP-WEIXIN
        reg = /^weixin-.*/
        // #endif
        // #ifdef MP-BAIDU
        reg = /^baidu-.*/
        // #endif
        // #ifdef MP-TOUTIAO
        reg = /^toutiao-.*/
        // #endif
        // #ifdef MP-QQ
        reg = /^qq-.*/
        // #endif
        // #ifdef MP-ALIPAY
        reg = /^alipay-.*/
        // #endif
        // #ifdef MP-KUAISHOU
        reg = /^kuaishou-.*/
        // #endif
        let appId = appidList.find(m => reg.test(m)) || ''
        if (!appId) return
        
        // 去掉前缀
        appId = appId.replace(/(weixin|baidu|toutiao|alipay|kuaishou|qq)-/, '')
        if(isWx && jumptype === 'embedded') {
          uni.openEmbeddedMiniProgram({
            appId,
            path
          })
        } else {
          uni.navigateToMiniProgram({
            appId,
            path
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
      console.log(e)
      let href = e.currentTarget.dataset.src
      let appid = e.currentTarget.dataset.appid
      let redirectype = e.currentTarget.dataset.redirectype
      let path = e.currentTarget.dataset.path
      let jumptype = e.currentTarget.dataset.jumptype

      // 判断a标签src里是不是插入的文档链接
      let isDoc = /\.(doc|docx|xls|xlsx|ppt|pptx|pdf)$/.test(href)

      if (isDoc) {
        this.openLinkDoc(e)
        return
      }

      if(redirectype) {
        this.goTo(null, {
          appid,
          redirectype,
          path,
          jumptype,
          url: href
        })
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
<style>/deep/ .hl-code,/deep/ .hl-pre{color:#000;background:0 0;text-shadow:0 1px #fff;font-family:Consolas,Monaco,'Andale Mono','Ubuntu Mono',monospace;font-size:1em;text-align:left;white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;line-height:1.5;-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-hyphens:none;-moz-hyphens:none;-ms-hyphens:none;hyphens:none}/deep/ .hl-code ::-moz-selection,/deep/ .hl-code::-moz-selection,/deep/ .hl-pre ::-moz-selection,/deep/ .hl-pre::-moz-selection{text-shadow:none;background:#b3d4fc}/deep/ .hl-code ::selection,/deep/ .hl-code::selection,/deep/ .hl-pre ::selection,/deep/ .hl-pre::selection{text-shadow:none;background:#b3d4fc}@media print{/deep/ .hl-code,/deep/ .hl-pre{text-shadow:none}}/deep/ .hl-pre{padding:1em;margin:.5em 0;overflow:auto}/deep/ .hl-pre{background:#f5f2f0}/deep/ .hl-cdata,/deep/ .hl-comment,/deep/ .hl-doctype,/deep/ .hl-prolog{color:#708090}/deep/ .hl-punctuation{color:#999}/deep/ .hl-namespace{opacity:.7}/deep/ .hl-boolean,/deep/ .hl-constant,/deep/ .hl-deleted,/deep/ .hl-number,/deep/ .hl-property,/deep/ .hl-symbol,/deep/ .hl-tag{color:#905}/deep/ .hl-attr-name,/deep/ .hl-builtin,/deep/ .hl-char,/deep/ .hl-inserted,/deep/ .hl-selector,/deep/ .hl-string{color:#690}/deep/ .hl-entity,/deep/ .hl-operator,/deep/ .hl-url,/deep/ .language-css .hl-string,/deep/ .style .hl-string{color:#9a6e3a;background:hsla(0,0%,100%,.5)}/deep/ .hl-atrule,/deep/ .hl-attr-value,/deep/ .hl-keyword{color:#07a}/deep/ .hl-class-name,/deep/ .hl-function{color:#dd4a68}/deep/ .hl-important,/deep/ .hl-regex,/deep/ .hl-variable{color:#e90}/deep/ .hl-bold,/deep/ .hl-important{font-weight:700}/deep/ .hl-italic{font-style:italic}/deep/ .hl-entity{cursor:help}/deep/ .md-p {
  margin-block-start: 1em;
  margin-block-end: 1em;
}

/deep/ .md-table,
/deep/ .md-blockquote {
  margin-bottom: 16px;
}

/deep/ .md-table {
  box-sizing: border-box;
  width: 100%;
  overflow: auto;
  border-spacing: 0;
  border-collapse: collapse;
}

/deep/ .md-tr {
  background-color: #fff;
  border-top: 1px solid #c6cbd1;
}

.md-table .md-tr:nth-child(2n) {
  background-color: #f6f8fa;
}

/deep/ .md-th,
/deep/ .md-td {
  padding: 6px 13px !important;
  border: 1px solid #dfe2e5;
}

/deep/ .md-th {
  font-weight: 600;
}

/deep/ .md-blockquote {
  padding: 0 1em;
  color: #6a737d;
  border-left: 0.25em solid #dfe2e5;
}

/deep/ .md-code {
  padding: 0.2em 0.4em;
  font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;
  font-size: 85%;
  background-color: rgba(27, 31, 35, 0.05);
  border-radius: 3px;
}

/deep/ .md-pre .md-code {
  padding: 0;
  font-size: 100%;
  background: transparent;
  border: 0;
}/deep/ .hl-pre {
  position: relative;
}
/deep/ .hl-code {
  overflow: auto;
  display: block;
}/deep/ .hl-language {
  font-size: 12px;
  font-weight: 600;
  position: absolute;
  right: 8px;
  text-align: right;
  top: 3px;
}
/deep/ .hl-pre {
  padding-top: 1.5em;
}/deep/ .hl-pre {
  font-size: 14px;
  padding-left: 3.8em;
  counter-reset: linenumber;
}
/deep/ .line-numbers-rows {
  position: absolute;
  pointer-events: none;
  top: 1.5em;
  font-size: 100%;
  left: 0;
  width: 3em; /* works for line-numbers below 1000 lines */
  letter-spacing: -1px;
  border-right: 1px solid #999;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
/deep/ .line-numbers-rows .span {
  display: block;
  counter-increment: linenumber;
} 
/deep/ .line-numbers-rows .span:before {
  content: counter(linenumber);
  color: #999;
  display: block;
  padding-right: 0.8em;
  text-align: right;
}
/* @import url(./wm.css); */
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
  /* height: 1px; */
  width: 100%;
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

._span {
  display: inline !important;
}

/* #ifdef APP-PLUS */
._video {
  width: 300px;
  height: 225px;
}
/* #endif */

/* zhou-自定义样式 */
._block,
._div,
._p {
	display: block;
  line-height: 1.8;
  text-align: justify;
  word-break: break-all;
}

.wm-audio {
  width: 100%;
}

.wm-video {
  width: 100%;
}

/* 短代码 */
.wmcode-view {
  overflow: visible;
  border: 1px solid #eee;
  margin-bottom: 10rpx;
}

.wmcode-inner {
  height: 280rpx;
  background-color: #fff;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  overflow: visible;
}

.wmcode-img {
  width: 260rpx;
  height: 280rpx;
  overflow: hidden;
}

.wmcode-img image {
  width: 260rpx;
  height: 260rpx;
  margin: 10rpx 0 0 10rpx;
  display: block;
}

.wmcode-content {
  overflow: visible;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 32rpx 32rpx 32rpx 24rpx;
  flex: 1;
  box-sizing: border-box;
}

.wmcode-text-box {
  display: flex;
  flex-direction: column;
}

.wmcode-text-title {
  color: #333;
  font-size: 15px;
  line-height: 1.4;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.wmcode-text-des {
  color: #999;
  font-size: 12px;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.wmcode-btn-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: visible;
}

.wmcode-price {
  color: #fe645a;
  font-size: 18px;
  font-weight: 500;
}

.wmcode-btn-goods {
  height: 60rpx;
  padding: 0 30rpx;
  border-radius: 30rpx;
  background-color: #fe645a;
  box-shadow: 0 4px 4px #fdc5c1;
  color: #fff;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible !important;
}

.cost-price {
  text-decoration: line-through;
  margin-left: 4rpx;
  font-size: 10px;
  color: #999;
}

.wmcode-btn {
  height: 60rpx;
  padding: 0 30rpx;
  border-radius: 30rpx;
  border: 1px solid #eee;
  box-sizing: border-box;
  color: #666;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible !important;
}

.address {
  margin-top: 20rpx;
  font-size: 12px;
  color: #576b95;
  margin-left: 100rpx;
  width: 570rpx;
}

.map-des {
  padding: 20rpx;
  background-color: #fdf4f4;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.map-des .distance {
  font-size: 12px;
  color: #999;
}

.map-des .distance .addr {
  margin-bottom: 8rpx;
  color: #333;
  font-size: 14px;
}

.map-des .iconfont {
  margin-left: 100rpx;
  font-size: 48rpx;
  color: #07c160;
}

.icon-baidu-disk:before {
  content: "\e727";
}

.baidu-disk {
  padding: 40rpx 20rpx;
  background: #f9fdff;
}

.baidu-disk .header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24rpx;
}

.baidu-disk .header .circle {
  width: 60rpx;
  height: 60rpx;
  border-radius: 20rpx;
  background: #06a7ff;
  text-align: center;
}

.baidu-disk .header .circle .iconfont {
  font-size: 48rpx;
  color: #fff;
  line-height: 60rpx;
}

.baidu-disk .header .title {
  font-size: 20px;
  font-weight: 500;
  color: #333;
  margin-left: 12rpx;
}

.url,
.code {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
  word-break: break-all;
  margin-top: 8rpx;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 32rpx;
}

.footer .btn {
  height: 60rpx;
  padding: 0 40rpx;
  border-radius: 30rpx;
  border: 1px solid #06a7ff;
  font-size: 13px;
  color: #06a7ff;
  line-height: 60rpx;
  background: #edfaff;
}

.footer .btn-copy {
  margin-right: 32rpx;
}

/* 短代码 */
.wm-channels {
  width: 440rpx;
  border-radius: 16rpx;
  margin: 24rpx auto;
  background-color: #f7f7f7;
  overflow: hidden;
}

.wm-channels-img {
  width: 100%;
  position: relative;
  z-index: 1;
}

.wm-channels-img .image {
  width: 100%;
  height: 440rpx;
  filter: brightness(96%);
  position: relative;
  z-index: 1;
  display: block;
}

.wm-channels-img .image:after {
  content: "\e666";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: "iconfont" !important;
  font-weight: normal;
  font-size: 64rpx;
  color: #fff;
  z-index: 3;
}

.wm-channels-title {
  padding: 30rpx;
  line-height: 1.4;
  text-align: justify;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
  background: linear-gradient(
    -180deg,
    transparent 2%,
    rgba(60, 70, 90, 0.4) 97%
  );
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.wm-channels-title .wm-channels-text {
  font-size: 30rpx;
  font-weight: 500;
  color: #fff;
  text-align: justify;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.wm-channels-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx;
}

.wm-channels-info {
  display: flex;
  align-items: center;
  max-height: 120rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wm-channels-info .image {
  width: 40rpx;
  height: 40rpx;
  margin-right: 16rpx;
  border-radius: 50%;
  flex-shrink: 0;
}

.wm-channels-name {
  font-size: 26rpx;
  line-height: 1;
  max-height: 120rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wm-channels-content .icon-channels {
  font-size: 40rpx;
  color: #fa9d3b;
}

/* 视频号主页 */
.wm-channels-page {
  width: 440rpx;
  border-radius: 16rpx;
  margin: 24rpx auto;
  padding: 32rpx 32rpx 24rpx;
  box-sizing: border-box;
  background: #fff;
  border: 1px solid #eee;
  overflow: hidden;
}

.wm-channels-page .wm-channels-page-content {
  display: flex;
  align-items: center;
}

.wm-channels-page .wm-channels-page-content .image {
  flex-shrink: 0;
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.wm-channels-page .wm-channels-page-content .wm-channels-page-info {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wm-channels-page
  .wm-channels-page-content
  .wm-channels-page-info
  .wm-channels-name {
  font-size: 28rpx;
  font-weight: bold;
  line-height: 1;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wm-channels-page
  .wm-channels-page-content
  .wm-channels-page-info
  .wm-channels-des {
  font-size: 24rpx;
  color: #888;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 12rpx;
}

.wm-channels-page .wm-channels-page-footer {
  border-top: 1px dashed #eee;
  padding-top: 20rpx;
  margin-top: 20rpx;
  font-size: 24rpx;
  line-height: 1;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.wm-channels-page .wm-channels-page-footer .iconfont {
  font-size: 32rpx;
  color: #fa9d3b;
}
</style>