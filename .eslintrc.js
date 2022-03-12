module.exports = {
  root: true,
  env: {
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: [
    'plugin:vue/strongly-recommended',
    '@vue/standard',
  ],
  rules: {
    'vue/script-indent': ['error', 2, { baseIndent: 1, switchCase: 1 }], // 控制 vue 文件 script 标签语句缩进
    'vue/max-attributes-per-line': ['error', {
      singleline: 5,
    }],
    'vue/singleline-html-element-content-newline': 'off',
    'vue/no-use-v-if-with-v-for': ['error', {
      allowUsingIterationVar: true,
    }],
    'vue/component-name-in-template-casing': ['error', 'PascalCase', {
      ignores: [],
    }],
    'vue/name-property-casing': 'off',
    'vue/require-default-prop': 'off',
    'comma-dangle': ['error', 'always-multiline'], // 要求使用拖尾逗号
    'prefer-const': 'off', // 关闭建议使用 const 的规则
    'generator-star-spacing': 'off', // allow async-await
    'space-before-function-paren': 'off', // 关闭函数括号前的空格验证
    'arrow-parens': 'off', // 不强制使用圆括号括住箭头函数参数
    quotes: ['error', 'single'], // 强制使用单引号
    semi: ['error', 'never'], // 强制结尾不使用分号
    // 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
  overrides: [{
    files: ['*.vue'],
    rules: {
      indent: 'off',
    },
  }],
  globals: {
    App: false,
    Page: false,
    getApp: false,
    getPage: false,
    getCurrentPages: false,
    __wxConfig: false,
    wx: true,
    uni: true,
    plus: true,
    ROUTES: false,
  },
}
