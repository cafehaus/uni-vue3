let tagList = [
    'minappershortcode',
    'minapperad',
    'minappermap',
    'minapperglobalgoods',
    'minappergoods',
    'minappergallery'
    // #ifdef MP-weixin
    ,'baidupan',
    'minapperqqvideo',
    'minapperchannelsactivity',
    'minapperchannelsevent',
    'minapperchannels'
    // #endif
]
let tagListTxt = tagList.join(',')

export default {
    tagList,
    tagListTxt
}