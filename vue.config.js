const path = require('path')
const isProd = process.env.NODE_ENV === 'production'
const resolve = dir => path.join(__dirname, dir)

module.exports = {
  // 生产环境关闭 sourceMap, 以加速构建
  productionSourceMap: !isProd,

  // 如果不需要使用 eslint，把 lintOnSave 设为 false 即可
  // lintOnSave: false,

  // 需要编译的依赖包名
  transpileDependencies: ['@dcloudio/uni-ui', 'uview-ui'],

  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@c', resolve('src/components'))
  },

  css: {
    loaderOptions: {
      sass: {
        implementation: require('sass'), // Dart Sass 须加此配置
      },

      // 自动化导入变量定义文件
      stylus: {
        import: ['~@/styles/var'],
      },
    },
  },

  configureWebpack: config => {
    if (isProd) {
      // 线上环境打包时移除 console 和 debugger
      const { terserOptions } = config.optimization.minimizer[0].options
      terserOptions.compress.drop_console = true
      terserOptions.compress.drop_debugger = true
    }
  },

  // 代理放到 rewrite 中处理
  devServer: {
    // open: process.platform === 'darwin',
    // host: '0.0.0.0',
    // port: 8080,
    // https: false,
    // hotOnly: false,
    proxy: {
      '/api': {
        // target: process.env.API_ROOT,
        target: 'http://dev.xxx.com',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
}
