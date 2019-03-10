/**
 * 配置文件
 */

module.exports = {
  // 页面层级组件的入口
  app: [
    './app/Index.js'
  ],
  // 客户端的页面js入口
  page: [
    './page/index.js'
  ],
  // 服务渲染页面的入口
  server: [
    './server/index.js'
  ],
  port: 8080,
};