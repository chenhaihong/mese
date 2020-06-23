---
order: 2000
title: 项目配置
---

默认使用 `mese.config.js` 来作为项目的配置文件。它主要用于：

- 确认页面入口文件的路径，以及对应的路由
- 确认 api 入口文件的路径

## 配置示例

下面这个示例是 `@mese/create-sc-mese-app` 生成的默认配置。

还未支持动态路由。

```javascript
/**
 * 配置文件
 */

module.exports = {
  pages: [
    { path: '/index', component: '/pages/home.js' }, // 数组第一个作为首页
    { path: '/404', component: '/pages/404.js' }, // 作为404页面
    { path: '/500', component: '/pages/500.js' }, // 作为500页面
    {
      path: '/pageWithPreloadedState',
      component: '/pages/pageWithPreloadedState.js',
    },
  ],
  apiFiles: ['/api/json.js', '/api/pureFunction.js', '/api/asyncFunction.js'],
};
```

## 配置规则

为了顺利使用 `mese`，你必须知道配置文件的这几个规则：

- 根路径 `/` 是配置文件的所在目录
- `pages` 数组的第一个作为首页
- `pages` 中的 `/404` 页面作为 `404` 页面
- `pages` 中的 `/500` 页面作为 `500` 页面

还未支持动态路由。
