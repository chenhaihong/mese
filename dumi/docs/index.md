---
title: Home | mese
hero:
  title: mese
  desc: 一个简陋的 React SSR 框架
  actions:
    - text: 快速开始
      link: /guide/get-started
# features:
#   - icon: https://gw.alipayobjects.com/zos/bmw-prod/881dc458-f20b-407b-947a-95104b5ec82b/k79dm8ih_w144_h144.png
#     title: Feature 1
#     desc: Balabala
#   - icon: https://gw.alipayobjects.com/zos/bmw-prod/d60657df-0822-4631-9d7c-e7a869c2f21c/k79dmz3q_w126_h126.png
#     title: Feature 2
#     desc: Balabala
#   - icon: https://gw.alipayobjects.com/zos/bmw-prod/d1ee0c6f-5aed-4a45-a507-339a4bfe076c/k7bjsocq_w144_h144.png
#     title: Feature 3
#     desc: Balabala
footer:
  本网站属于个人技术分享网站，使用 [dumi](https://d.umijs.org) 工具构建生成，是一个纯静态网站<br />
  [粤ICP备18035177号-1](http://www.beian.miit.gov.cn/) |
  [粤公网安备 44011302002141号](http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44011302002141)
---

<br />

```javascript
import './common.less';
import React from 'react';

export function createPage({ path, query, preloadedStateString }) {
  const { helloworld } = JSON.parse(preloadedStateString);
  return (
    <div className="app">
      <h1 className="title">mese</h1>
      <p className="description">{helloworld}</p>
    </div>
  );
}

export async function getPreloadedStateString({ path, query, fetch }) {
  const { type } = query;
  return await fetch(`http://localhost:3000/get/json?type=${type}`, {
    method: 'GET',
  }).then(res => res.text());
}

export async function getPageConfig({ path, query, fetch }) {
  return {
    onMemoryCache: false,
    onSSR: true,
    onCSR: false,
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
