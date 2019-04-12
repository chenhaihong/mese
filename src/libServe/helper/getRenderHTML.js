
const ReactDOMServer = require('react-dom/server');

module.exports = getStaticMarkup;

function getStaticMarkup(associatedFiles) {
  let cache = getStaticMarkup.cache.get(name);
  if (cache) return cache;

  const { js, css, node } = associatedFiles;
  const { default: application, pageConfig } = require(node); // Critical dependency: the request of a dependency is an expression
  const {
    beforePageCSS, afterPageCSS, beforePageJs, afterPageJs
  } = formatPageConfig(pageConfig);
  cache = `<!DOCTYPE html>
<html lang="zh">
<head>
  ${beforePageCSS}
  <link rel="stylesheet" href="${css}">
  ${afterPageCSS}
</head>
<body>
  <div id="root">${ReactDOMServer.renderToStaticMarkup(application)}</div>
  ${beforePageJs}
  <script src="${js}"></script>
  ${afterPageJs}
  <script>
    ReactDOM.hydrate(mese_${name}.default, document.getElementById('root'));
  </script>
</body>
</html>`;

  getStaticMarkup.cache.set(name, cache);
  return cache;
}
getStaticMarkup.cache = new Map();

/**
 * 包含这个页面[name]的结果
 * @param {String} name 页面的名称
 * @returns {Boolean} 是否包含指定页面的结果
 */
function hasPage(name) {
  let pages = hasPage.pages;
  if (!pages) {
    pages = new Set();
    const keys = Object.keys(_manifest);
    keys.forEach(item => { // item example: home.js home.css
      const name = item.split('.')[0];
      pages.add(name);
    });
    hasPage.pages = pages;
  }
  return pages.has(name);
}
hasPage.pages = null;

/**
 * 获取页面的关联文件
 * @param {String} name 页面的名称
 * @returns {Object} 关联的文件
 */
function getAssociatedFiles(name) {
  return {
    js: '/' + _manifest[`${name}.js`],
    css: '/' + _manifest[`${name}.css`],
    node: path.join(_staticDir, `${name}.node.js`)
  };
}

/**
 * 格式化当前页面的配置对象
 * 
 * @param {Object|null} pageConfig 当前页面的配置对象
 * @returns {Object} 一个格式化后的配置对象
 * 
 * @private
 */
function formatPageConfig(pageConfig) {
  let beforePageCSS = '',
    afterPageCSS = '',
    beforePageJs = '',
    afterPageJs = '';
  if (pageConfig) {
    const { head = {}, body = {} } = pageConfig;
    beforePageCSS = head.beforePageCSS || '';
    afterPageCSS = head.afterPageCSS || '';
    beforePageJs = body.beforePageJs || '';
    afterPageJs = body.afterPageJs || '';
  }
  return { beforePageCSS, afterPageCSS, beforePageJs, afterPageJs };
}