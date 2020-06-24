import "./common.less";

import React from "react";

function BookDetail(props) {
  const { id, title, author } = props.data;
  return (
    <div className="app">
      <h1 className="title">{title}</h1>
      <p className="description">ID: {id}</p>
      <p className="description">Author: {author}</p>
    </div>
  );
}

export function createPage({ preloadedStateString }) {
  const data = JSON.parse(preloadedStateString);
  return <BookDetail data={data} />;
}

export async function getPreloadedStateString({ params }) {
  // 从动态参数集中拿出id
  const { id } = params;

  // 服务端执行，预加载数据
  return JSON.stringify({
    id,
    title: "《JavaScript高级程序设计》",
    author: "Nicholas C.Zakas",
  });
}
