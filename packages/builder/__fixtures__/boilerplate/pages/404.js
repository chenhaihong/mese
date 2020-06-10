import "./common.less";

import React from "react";

class NotFound extends React.Component {
  render() {
    return (
      <div className="app">
        <h1 className="title">404</h1>
        <p className="description">Page not found.</p>
      </div>
    );
  }
}

export default <NotFound />;

export const pageConfig = {
  body: {
    beforePageJs: [
      '<script src="https://cdn.bootcss.com/react/16.8.4/umd/react.development.js"></script>',
      '<script src="https://cdn.bootcss.com/react-dom/16.8.4/umd/react-dom.development.js"></script>',
    ].join(""),
  },
  onMemoryCache: true,
};
