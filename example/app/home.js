import './common.less';

import React from 'react';

class Home extends React.Component {
  handleClick = () => {
    alert('点击事件生效');
  }

  render() {
    return (
      <div>
        <h1>hello world</h1>
        <p onClick={this.handleClick}>点击我，看点击事件是否生效</p>
      </div>
    );
  }
}

export default <Home />;