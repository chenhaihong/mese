import "./common.less";

import React from "react";

export function createPage({ path, query, preloadedStateString }) {
  // path 请求地址的路径部分
  // query 查询参数
  // preloadedStateString 预加载数据，字符串格式
  if (preloadedStateString) {
    const preloadedState = JSON.parse(preloadedStateString);
    console.log(preloadedState);
  }
  return (
    <div className="app">
      <h1 className="title">mese</h1>
      <p className="description">一个简易的 React ssr 框架。</p>
    </div>
  );
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

export async function getPageConfig({ path, query, fetch }) {
  // path 请求地址的路径部分
  // query 查询参数
  // fetch node-fetch

  return {
    onMemoryCache: false,
    head: {
      beforePageCSS: [
        '<meta charset="utf-8">',
        "<title>mese</title>",
        '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">',
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
