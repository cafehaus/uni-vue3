import http from '../libs/http'
const wp = 'wp-json/wp/v2/'
const wm = 'wp-json/minapper-plus/v1/'

// ---------------------------------------- 公共
// 登录|post
export const login = params => http.post(`${wm}weixin/userlogin`, params)

// 获取用户信息|get
export const getUserInfo = params => http.get(`${wm}users/session`, params)

// =================================================================== 首页
// 获取轮播、精选|get
export const getOptionsExpand = params => http.get(`${wm}options/expand`, params)

// 获取自定义广告|get
export const getCustomAd = params => http.get(`${wm}options/adconfig`, params)

// 获取文章列表|get
export const getArticleList = params => http.get(`${wp}posts`, params)

// 获取文章详情|get
export const getArticleDetail = id => http.get(`${wp}posts/${id}`)

// 获取标签列表|get
export const getTagList = params => http.get(`${wp}tags?per_page=7&orderby=count&order=desc&page=1`)

// =================================================================== 分类
// 获取分类树|get
export const getCategory = params => http.get(`${wm}category?apptype=wx`, params)

// 获取分类信息|get
export const getCategoryInfo = id => http.get(`${wp}categories/${id}`)

// 获取分类文章|get
export const getCateArticle = params => http.get(`${wp}posts`, params)

// =================================================================== 热门
// 获取热门文章|get
export const getHotArticle = params => http.get(`${wm}post/${params.type}?apptype=wx`, params)

// =================================================================== 我的
// 获取wp页面详情|get
export const getWpPageDetail = id => http.get(`${wp}pages/${id}`)
