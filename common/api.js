import http from '../libs/http'
const wp = 'wp-json/wp/v2/'
const wm = 'wp-json/minapper-plus/v1/'

// ---------------------------------------- 公共
// 登录|post
export const login = params => http.post(`${wm}weixin/userlogin`, params)

// 百度登录|post
export const loginBD = params => http.post(`${wm}baidu/getopenid`, params)

// 阿里登录|post
export const loginAL = params => http.post(`${wm}alipay/getUserid`, params)

// QQ登录|post
export const loginQQ = params => http.post(`${wm}qq/getopenid`, params)

// 头条登录|post
export const loginTT = params => http.post(`${wm}toutiao/getopenid`, params)

// 获取应用信息|get
export const getAppInfo = params => http.get(`${wm}options/config`, params)

// 获取用户信息|get
export const getUserInfo = params => http.post(`${wm}weixin/updateuserinfo`, params)

// =================================================================== 首页
// 获取轮播、精选|get
export const getOptionsExpand = params => http.get(`${wm}options/expand`, params)

// 获取自定义广告|get
export const getCustomAd = params => http.get(`${wm}options/adconfig`, params)

// 获取插屏广告|get
export const getInterstitialAd = params => http.get(`${wm}options/enableOption`, params)

// 获取文章列表|get
export const getArticleList = params => http.get(`${wp}posts`, params)

// 获取文章详情|get
export const getArticleDetail = (params, config) => http.get(`${wm}posts/${params.id}`, params, config)

// 获取文章是否可以评论|get
export const getCanComment = (params, config) => http.get(`${wm}options/enableComment`, params, config)

// 获取标签列表|get
export const getTagList = params => http.get(`${wp}tags?per_page=7&orderby=count&order=desc&page=1`)

// 获取最新评论|get
export const getCommentList = params => http.get(`${wm}comment/new`)

// =================================================================== 分类
// 获取分类树|get
export const getCategory = params => http.get(`${wm}category?apptype=wx`, params)

// 获取分类信息|get
export const getCategoryInfo = id => http.get(`${wp}categories/${id}`)

// 订阅分类|post
export const subscribeCate = params => http.post(`${wm}category/postsubscription`, params)

// =================================================================== 热门
// 获取热门文章|get
export const getHotArticle = params => http.get(`${wm}post/${params.type}?apptype=wx`, params)

// =================================================================== 我的
// 获取wp页面详情|get
export const getWpPageDetail = id => http.get(`${wp}pages/${id}`)

// 获取文章评论|get
export const getArticleComment = params => http.get(`${wm}comment/getcomments`, params)

// 提交评论|get
export const submitComment = params => http.post(`${wm}comment/add`, params)

// 获取标签相关文章|get
export const getTagArticle = params => http.get(`${wp}posts`, params)

// 点赞|post
export const submitLike = params => http.post(`${wm}post/like`, params)

// 获取是否点赞|post
export const getIsLike = params => http.post(`${wm}post/islike`, params)

// 获取标签详情|get
export const getTagDetail = id => http.get(`${wp}tags/${id}`)

// 阅读记录-我的评论|get
export const getCommentArticle = params => http.get(`${wm}comment/get?openid=${params.openid}&apptype=${params.apptype}`)

// 阅读记录-我的点赞|get
export const getLikeArticle = params => http.get(`${wm}post/mylike?openid=${params.openid}&apptype=${params.apptype}`)

// 阅读记录-我的赞赏|get
export const getPraiseArticle = params => http.get(`${wm}post/mypraise?openid=${params.openid}&apptype=${params.apptype}`)

// 阅读记录-我的订阅|get
export const getSubscribeArticle = params => http.get(`${wm}category/getsubscription?openid=${params.openid}`)

// 鼓励,获取支付密钥|post
export const postPraiseUrl = params => http.post(`${wm}payment`, params)

// 更新鼓励数据|post
export const updatePraiseUrl = params => http.post(`${wm}post/praise`)

// 获取关于我们页面数据|post
export const getAboutPage = params => http.get(`${wm}pages/about`)

// 获取赞赏用户|post
export const getPraiseUser = params => http.get(`${wm}post/allpraise`)
