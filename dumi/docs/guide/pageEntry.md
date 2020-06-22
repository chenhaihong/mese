---
order: 3000
title: 页面入口
---

这是 `mese` 中的很重要的部分。你需要仔细阅读这块内容。在 `mese` 中，一个页面的入口需要暴露出这 3 个方法，

- `getPageConfig`，1 个异步函数，只在服务端执行，用于获取页面的配置，是一个可选项
- `getPreloadedStateString`，1 个异步函数，只在服务端执行，用于获取预加载数据，是一个可选项
- `createPage`，用于获取页面应用，是一个必选项

## 方法介绍

### getPageConfig

```javascript
export async function getPageConfig({ path, query, fetch }) {
  // path 请求地址的路径部分
  // query 查询参数
  // fetch node-fetch

  return {
    onMemoryCache: false,
    onSSR: true,
    onCSR: true,
    head: {
      beforePageCSS: '',
      afterPageCSS: '',
    },
    body: {
      beforePageJs: '',
      afterPageJs: '',
    },
  };
}
```

### getPreloadedStateString

```javascript
export async function getPreloadedStateString({ path, query, fetch }) {
  // path 请求地址的路径部分
  // query 查询参数
  // fetch node-fetch

  // 服务端执行，预加载数据
  return await fetch('http://localhost:3000/get/json', {
    method: 'GET',
  }).then(res => res.text());
}
```

### createPage

```javascript
import './common.less';
import React from 'react';

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
```

## 执行顺序

服务端上的执行顺序如下，

```
getPageConfig --> getPreloadedStateString --> createPage
```

客户端上只执行下面 1 个方法，

```
createPage
```
