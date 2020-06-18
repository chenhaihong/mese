import "./common.less";

import React from "react";

function InternalServerError(props) {
  const { message, stack } = props;
  return (
    <div className="app">
      <h1 className="title">500</h1>
      <p className="description">{message || "Internal Server Error."}</p>
      <pre>{stack}</pre>
    </div>
  );
}

export function createPage({ error }) {
  // error对象不是一个Error实例，而是一个简单的boject而已，结构如下
  // const { message, stack } = error;
  return <InternalServerError {...error} />;
}
