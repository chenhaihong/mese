import "./common.less";

import React from "react";

class Home extends React.Component {
  handleClick() {
    alert("React.hydrate 成功啦~");
  }

  render() {
    return (
      <div className="app">
        <button className="btn" onClick={this.handleClick}>
          M
        </button>
        <h1 className="title">mese</h1>
        <p className="description">
          <span>一个简陋的 React ssr 框架。</span>
        </p>
        <p className="description">
          <span>使用指南：</span>
          <a className="link--erye" href="https://mese.tiiit.cn" target="blank">
            https://mese.tiiit.cn
          </a>
        </p>
      </div>
    );
  }
}

export function createPage() {
  return <Home />;
}

export async function getPageConfig() {
  return {
    onMemoryCache: false,
    docType: "<!DOCTYPE html>",
    html: {
      beginTag: "<html>",
      endTag: "</html>",
    },
    head: {
      beginTag: "<head>",
      endTag: "</head>",
      beforePageCSS: [
        '<meta charset="utf-8" />',
        "<title>mese</title>",
        '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />',
      ].join(""),
      afterPageCSS: "",
    },
    body: {
      beginTag: '<body class="helloworld">',
      endTag: "</body>",
      beforePageJs: [
        '<script src="https://cdn.bootcss.com/react/16.8.4/umd/react.development.js"></script>',
        '<script src="https://cdn.bootcss.com/react-dom/16.8.4/umd/react-dom.development.js"></script>',
        '<script src="https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"></script>',
      ].join(""),
      afterPageJs: "",
    },
  };
}
