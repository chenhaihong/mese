import "./common.less";

import React from "react";

function InternalServerError() {
  return (
    <div className="app">
      <h1 className="title">500</h1>
      <p className="description">Internal Server Error.</p>
    </div>
  );
}

export function createPage() {
  return <InternalServerError />;
}
