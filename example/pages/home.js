import './common.less';

import React from 'react';

class Home extends React.Component {
  handleClick() {
    alert('React.hydrate 成功啦~');
  }

  render() {
    return (
      <div className="app">
        <button className="btn" onClick={this.handleClick}>M</button>
        <h1 className="title">mese</h1>
        <p className="description">一个简易的 React ssr 框架。</p>
      </div>
    );
  }
}

export default <Home />;

export const pageConfig = {
  head: {
    beforePageCSS: [
      '<meta charset="utf-8">',
      '<title>mese</title>',
      '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">'
    ].join(''),
    afterPageCSS: '',
  },
  body: {
    beforePageJs: [
      '<script src="https://cdn.bootcss.com/react/16.8.4/umd/react.development.js"></script>',
      '<script src="https://cdn.bootcss.com/react-dom/16.8.4/umd/react-dom.development.js"></script>',
      '<script src="https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"></script>'
    ].join(''),
    afterPageJs: '',
  }
};