import http from '../libs/http'

// ---------------------------------------- 公共
// 登录
export const login = (params) => http.post('/login', params)

// 获取用户信息
export const getUserInfo = (params) => http.get('/user-info', params)

// ---------------------------------------- 首页
// 获取轮播
export const getBanner = (params, config = {}) => http.get('/banner', params, config)
