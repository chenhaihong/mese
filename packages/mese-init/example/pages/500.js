import './common.less';

import React from 'react';

class InternalServerError extends React.Component {
  render() {
    return (
      <div className="app">
        <h1 className="title">500</h1>
        <p className="description">Internal Server Error.</p>
      </div>
    );
  }
}

export default <InternalServerError />;

// export const pageConfig = {
//   body: { // 因为没有导出 beforePageJs，所以无法完成ReactDOM.hydrate操作
//     beforePageJs: [
//       '<script src="https://cdn.bootcss.com/react/16.8.4/umd/react.development.js"></script>',
//       '<script src="https://cdn.bootcss.com/react-dom/16.8.4/umd/react-dom.development.js"></script>',
//     ].join(''),
//   }
// };