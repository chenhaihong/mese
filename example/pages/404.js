import './common.less';

import React from 'react';

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