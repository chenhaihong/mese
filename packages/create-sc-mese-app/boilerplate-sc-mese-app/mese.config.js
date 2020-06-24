/**
 * 配置文件
 */

module.exports = {
  pages: [
    { path: "/index", component: "/pages/index.js" }, // 数组第一个作为首页
    { path: "/404", component: "/pages/404.js" }, // 作为404页面
    { path: "/500", component: "/pages/500.js" }, // 作为500页面
    {
      path: "/page/preloadedState", // 预加载数据的示例页面
      component: "/pages/preloadedState.js",
    },
    {
      path: "/page/book/:id",
      component: "/pages/bookDetail.js",
      dynamic: true, // 使用动态路由
    },
  ],
  apiFiles: ["/api/json.js", "/api/pureFunction.js", "/api/asyncFunction.js"],
};
