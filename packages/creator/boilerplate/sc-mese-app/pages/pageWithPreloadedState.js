import "./common.less";

import React from "react";

export function createPage({ path, query, preloadedStateString }) {
  if (preloadedStateString) {
    preloadedState = JOSN.parse(preloadedStateString);
  }
  return (
    <div className="app">
      <h1 className="title">mese</h1>
      <p className="description">一个简易的 React ssr 框架。</p>
    </div>
  );
}

export async function getPreloadedStateString(nodeFetch) {
  // 服务端执行，预加载数据
  // 使用的node-fetch
  return await nodeFetch("http://lohost:3000/get/json", {
    method: "GET",
  });
  // .then((res) => res.json());
}

export async function getPageConfig(nodeFetch) {
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
