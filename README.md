# mese

[![npm](https://img.shields.io/npm/v/@mese/create-sc-mese-app.svg)](https://www.npmjs.com/package/@mese/create-sc-mese-app)

一个简陋的 React SSR 框架。阅读文档 [https://mese.tiiit.cn](https://mese.tiiit.cn) 了解更多。

## 快速开始

```bash
$ mkdir myapp && cd myapp
$ npx @mese/create-sc-mese-app

# 或者
$ npx @mese/create-sc-mese-app myapp
```

## 项目配置

下面这个示例是 @mese/create-sc-mese-app 生成的默认配置。

```javascript
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
};
```

## 页面入口

```javascript
import "./common.less";
import React from "react";
export function createPage({ path, query, preloadedStateString, error }) {
  // path 请求地址的路径部分
  // query 查询参数
  // preloadedStateString 预加载数据，字符串格式
  // error 500页面独有的字段，结构为 { message: string, stack: string }
  if (preloadedStateString) {
    const preloadedState = JSON.parse(preloadedStateString);
    console.log(preloadedState);
  }
  return (
    <div className="app">
      <h1 className="title">mese</h1>
      <p className="description">这个页面包含有预加载数据的逻辑。</p>
    </div>
  );
}

export async function getPageConfig({ path, query, fetch }) {
  // path 请求地址的路径部分
  // query 查询参数
  // fetch node-fetch
  return {
    onMemoryCache: false,
    head: {
      beforePageCSS: [
        '<meta charSet="utf-8" />',
        "<title>mese</title>",
        '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />',
      ].join(""),
      afterPageCSS: "",
    },
    body: {
      beforePageJs: [
        '<script src="https://cdn.bootcss.com/react/16.8.4/umd/react.development.js"></script>',
        '<script src="https://cdn.bootcss.com/react-dom/16.8.4/umd/react-dom.development.js"></script>',
        '<script src="https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"></script>',
      ].join(""),
      afterPageJs: "",
    },
  };
}

export async function getPreloadedStateString({ path, query, fetch }) {
  // path 请求地址的路径部分
  // query 查询参数
  // fetch node-fetch
  // 服务端执行，预加载数据
  return await fetch("http://localhost:3000/get/json", {
    method: "GET",
  }).then((res) => res.text());
}
```

## 接口入口

```javascript
module.exports = {
  "/get/json": {
    method: "get", // 请求类型
    result: {
      success: true,
      message: "这是纯json格式数据",
    },
  },
  "/post/pureFunction": {
    method: "post",
    result(req, res) {
      // 支持纯函数类型，返回结果为纯函数执行结果
      res.set({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
      });
      return {
        success: true,
        messag: "这是一个纯函数",
      };
    },
  },
  "/get/delayFunction": {
    method: "get",
    async result() {
      // 支持async函数类型
      const sleep = function (delay) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, delay);
        });
      };
      await sleep(50);
      return {
        success: true,
        message: "这是一个异步函数",
      };
    },
  },
};
```
