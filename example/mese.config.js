/**
 * 配置文件
 */

module.exports = {
  pages: [
    './pages/home.js', // 数组第一个作为首页，文件名称是页面名称
    './pages/404.js', // 名称为404的页面将作为404页面
    './pages/500.js' // 名称为500的页面将作为500页面
  ],
  api: [
    './apis/json.js',
    './apis/pureFunction.js',
    './apis/delayFunction.js'
  ],
  webpackOption: {
    output: '', // 构建配置选项
  },
};