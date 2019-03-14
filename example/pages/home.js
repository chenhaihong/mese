import './common.less';

import React from 'react';

class Home extends React.Component {
  handleClick = () => {
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