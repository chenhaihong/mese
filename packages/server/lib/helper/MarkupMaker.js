const ReactDOMServer = require("react-dom/server");

const compatibleRequire = require("./compatibleRequire");

class MarkupMaker {
  static makeString(pascalCasePageName, associatedFiles) {
    let cache = MarkupMaker.cacheMap.get(pascalCasePageName);
    if (cache) return cache;

    const { js, css, node } = associatedFiles;
    const { default: application, pageConfig } = compatibleRequire(node); // Critical dependency: the request of a dependency is an expression
    const {
      beforePageCSS,
      afterPageCSS,
      beforePageJs,
      afterPageJs,
    } = MarkupMaker.transformPageConfig(pageConfig);
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
    ReactDOM.hydrate(mese_${pascalCasePageName}.default, document.getElementById('root'));
  </script>
</body>
</html>`;

    MarkupMaker.cacheMap.set(pascalCasePageName, cache);
    return cache;
  }

  /**
   * 格式化当前页面的配置对象
   *
   * @param {Object|null} pageConfig 当前页面的配置对象
   * @returns {Object} 一个格式化后的配置对象
   *
   * @private
   */
  static transformPageConfig(pageConfig) {
    let beforePageCSS = "",
      afterPageCSS = "",
      beforePageJs = "",
      afterPageJs = "";
    if (pageConfig) {
      const { head = {}, body = {} } = pageConfig;
      beforePageCSS = head.beforePageCSS || "";
      afterPageCSS = head.afterPageCSS || "";
      beforePageJs = body.beforePageJs || "";
      afterPageJs = body.afterPageJs || "";
    }
    return { beforePageCSS, afterPageCSS, beforePageJs, afterPageJs };
  }
}
MarkupMaker.cacheMap = new Map();

module.exports = MarkupMaker;
