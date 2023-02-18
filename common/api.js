import http from '../libs/http'
const wp = 'wp-json/wp/v2/'
const wm = 'wp-json/minapper/v1/'

// =================================================================== 登录注册
// 用户名密码注册|post
// username,password
export const userRegister = params => http.post(`${wm}users/registeruser`, params)

// 用户名密码登录|post
// username,password
export const userLogin = params => http.post(`${wm}users/registeruserlogin`, params)

// 微信绑定手机号|post
// code，openid
export const wxBindPhone = params => http.post(`${wm}weixin/phonebind`, params)

// 微信绑定用户名密码|post
// username,password,openid
export const wxBindUserNamePassword = params => http.post(`${wm}weixin/binduser`, params)

// QQ绑定手机号|post
// export const qqBindPhone = params => http.post(`${wm}qq/phonebind`, params)

// QQ绑定用户名密码|post
export const qqBindUserNamePassword = params => http.post(`${wm}qq/binduser`, params)

// 百度绑定手机号|post
export const bdBindPhone = params => http.post(`${wm}baidu/phonebind`, params)

// 百度绑定用户名密码|post
export const bdBindUserNamePassword = params => http.post(`${wm}baidu/binduser`, params)

// 头条绑定手机号|post
export const ttBindPhone = params => http.post(`${wm}toutiao/phonebind`, params)

// 头条绑定用户名密码|post
export const ttBindUserNamePassword = params => http.post(`${wm}toutiao/binduser`, params)

// 支付宝绑定手机号|post
export const alipayBindPhone = params => http.post(`${wm}alipay/phonebind`, params)

// 支付宝绑定用户名密码|post
export const alipayBindUserNamePassword = params => http.post(`${wm}alipay/binduser`, params)

// 快手绑定手机号|post
export const ksBindPhone = params => http.post(`${wm}kuaishou/phonebind`, params)

// 快手绑定用户名密码|post
export const ksBindUserNamePassword = params => http.post(`${wm}kuaishou/binduser`, params)

// 修改用户名|post
export const updateUserName = params => http.post(`${wm}users/updatenickname`, params)

// 修改用户密码|post
export const updatePassword = params => http.post(`${wm}users/updatepassword`, params)

// 修改用户头像|post
export const updateAvatar = params => http.post(`${wm}users/updateavatar`, params)

// =================================================================== 用户
// 登录|post
export const login = params => http.post(`${wm}weixin/webchatuserlogin`, params)

// 百度登录|post
export const loginBD = params => http.post(`${wm}baidu/webchatuserlogin`, params)

// 阿里登录|post
export const loginAL = params => http.post(`${wm}alipay/webchatuserlogin`, params)

// QQ登录|post
export const loginQQ = params => http.post(`${wm}qq/webchatuserlogin`, params)

// 头条登录|post
export const loginTT = params => http.post(`${wm}toutiao/webchatuserlogin`, params)

// 快手登录|post
export const loginKS = params => http.post(`${wm}kuaishou/webchatuserlogin`, params)

// 授权手机号登录|post
export const phoneLogin = params => http.post(`${wm}weixin/phonelogin`, params)

// 用户名密码登录|post
export const passwordLogin = params => http.post(`${wm}weixin/registeruserlogin`, params)

// 注册|post
export const register = params => http.post(`${wm}weixin/registeruser`, params)

// 获取用户信息|get
export const getUserInfo = params => http.post(`${wm}weixin/updateuserinfo`, params)

// =================================================================== 公共
// 获取应用信息|get
export const getAppInfo = params => http.get(`${wm}options/config`, params)

// 上传图片|post
export const uploadImg = params => http.post(`${wm}attachments`, params)

// 获取wp页面详情|get
export const getWpPageDetail = id => http.get(`${wp}pages/${id}`)

// 获取标签详情|get
export const getTagDetail = id => http.get(`${wp}tags/${id}`)

// 获取百度 seo 信息|get
export const getBaiduSeo = id => http.get(`${wm}options/baiduseo`)

// =================================================================== 首页
// 获取轮播|get
export const getOptionsExpand = params => http.get(`${wm}settings/homeconfig`, params)

// 获取首页文章列表：根据插件设置要显示的分类|get
export const getHomeArticle = params => http.get(`${wm}posts/items`, params)

// 获取文章列表|get
export const getArticleList = params => http.get(`${wm}posts/items`, params)

// 获取标签列表|get
export const getTagList = params => http.get(`${wp}tags?per_page=7&orderby=count&order=desc&page=1`)

// 获取最新评论|get
export const getCommentList = params => http.get(`${wm}comment/new`)

// =================================================================== 分类
// 获取分类树|get
export const getCategory = params => http.get(`${wm}category`, params)

// 获取分类信息|get
export const getCategoryInfo = id => http.get(`${wp}categories/${id}`)

// 订阅分类|post
export const subscribeCate = params => http.post(`${wm}category/addsubscription`, params)

// =================================================================== 热门
// 获取热门文章|get
export const getHotArticle = params => http.get(`${wm}post/${params.type}?apptype=wx`, params)

// =================================================================== 我的
// 阅读记录-我的评论|get
export const getCommentArticle = params => http.get(`${wm}comment/getmyitems`)

// 阅读记录-我的点赞|get
export const getLikeArticle = params => http.get(`${wm}post/getmylikes`)

// 阅读记录-我的赞赏|get
export const getPraiseArticle = params => http.get(`${wm}post/mypraise?openid=${params.openid}&apptype=${params.apptype}`)

// 阅读记录-我的订阅|get
export const getSubscribeArticle = params => http.get(`${wm}category/getmysubscription`)

// 鼓励获取支付密钥|post
export const postPraiseUrl = params => http.post(`${wm}payment`, params)

// 更新鼓励数据|post
export const updatePraiseUrl = params => http.post(`${wm}post/praise`)

// 获取关于我们页面数据|post
export const getAboutPage = params => http.get(`${wm}pages/about`)

// 获取赞赏用户|post
export const getPraiseUser = params => http.get(`${wm}post/allpraise`)

// =================================================================== 文章详情
// 获取文章详情|get
export const getArticleDetail = (params, config) => http.get(`${wm}posts/${params.id}`, params, config)

// 获取文章是否可以评论|get
export const getCanComment = (params, config) => http.get(`${wm}options/enableComment`, params, config)

// 获取文章评论|get
export const getArticleComment = params => http.get(`${wm}comment/getcomments`, params)

// 提交评论|get
export const submitComment = params => http.post(`${wm}comment/post`, params)

// 获取标签相关文章|get
export const getTagArticle = params => http.get(`${wp}posts`, params)

// 点赞|post
export const submitLike = params => http.post(`${wm}post/presslike`, params)

// 获取是否点赞|post
export const getIsLike = params => http.post(`${wm}post/islike`, params)

// =================================================================== 广告
// 获取自定义广告|get
export const getCustomAd = params => http.get(`${wm}options/adconfig`, params)

// 获取插屏广告|get
export const getInterstitialAd = params => http.get(`${wm}options/enableOption`, params)

// =================================================================== 直播
// 获取直播数据|get
export const getLiveInfo = params => http.get(`${wm}live/weixin/getliveinfo`)

// 更新直播数据|get
export const updateLiveInfo = params => http.get(`${wm}live/weixin/refreshliveinfo`, params)

// =================================================================== 留言
// 获取我的留言|get
export const getMyLeaveword = params => http.get(`${wm}form/mymessage`, params)

// 提交留言|post
export const submitLeaveword = params => http.post(`${wm}form/message`, params)

// =================================================================== 付费插件
// 扫码登录|post
export const scanLogin = params => http.post(`${wm}users/scanqrcode`, params)

// 获取视频号信息|get
export const getChannelsInfo = params => http.get('wp-json/minapper/v1/channels', params)

// 获取视频号视频|get
export const getChannelsActivity = params => http.get('wp-json/minapper/v1/channels/activity', params)

// 获取视频号活动|get
export const getChannelsEvent = params => http.get('wp-json/minapper/v1/channels/event', params)
