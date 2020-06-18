/**
 * 配置文件
 */

module.exports = {
  pages: [
    { path: "/index", component: "/pages/home.js" }, // 数组第一个作为首页，文件名称是path的pascalCase格式
    { path: "/404", component: "/pages/404.js" }, // 作为404页面
    { path: "/500", component: "/pages/500.js" }, // 作为500页面
    {
      path: "/pageWithPreloadedState",
      component: "/pages/pageWithPreloadedState.js",
    },
  ],
  apiFiles: ["/api/json.js", "/api/pureFunction.js", "/api/asyncFunction.js"],
  // TODO 还未添加支持，自定义的构建配置选项
  webpackOption: {
    output: {},
  },
};
