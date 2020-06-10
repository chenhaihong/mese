const ReactDOMServer = require("react-dom/server");

const compatibleRequire = require("./compatibleRequire");

class MarkupMaker {
  /**
   * 构造方法
   */
  constructor() {
    this.cacheMap = new Map();
  }

  makeString(pascalCasePageName, associatedFiles) {
    let cache = this.cacheMap.get(pascalCasePageName);
    if (cache) return cache;

    const { js, css, node } = associatedFiles;
    const { default: nodeApp, pageConfig } = compatibleRequire(node);
    const {
      onMemoryCache, // 该页面启用内存缓存
      beforePageCSS,
      afterPageCSS,
      beforePageJs,
      afterPageJs,
    } = this.transformPageConfig(pageConfig);
    cache = `<!DOCTYPE html>
<html lang="zh">
<head>
  ${beforePageCSS}
  <link rel="stylesheet" href="${css}">
  ${afterPageCSS}
</head>
<body>
  <div id="root">${ReactDOMServer.renderToStaticMarkup(nodeApp)}</div>
  ${beforePageJs}
  <script src="${js}"></script>
  ${afterPageJs}
  <script>
    ReactDOM.hydrate(Mese${pascalCasePageName}.default, document.getElementById('root'));
  </script>
</body>
</html>`;

    if (onMemoryCache) this.cacheMap.set(pascalCasePageName, cache);
    return cache;
  }

  /**
   * 格式化当前页面的配置对象
   *
   * @param {Object|null} pageConfig 当前页面的配置对象
   * @returns {Object} 一个格式化后的配置对象
   */
  transformPageConfig(pageConfig) {
    let [
      onMemoryCache,
      beforePageCSS,
      afterPageCSS,
      beforePageJs,
      afterPageJs,
    ] = [false, "", "", "", ""];
    if (pageConfig) {
      const { head = {}, body = {} } = pageConfig;
      [
        onMemoryCache,
        beforePageCSS,
        afterPageCSS,
        beforePageJs,
        afterPageJs,
      ] = [
        pageConfig.onMemoryCache || false,
        head.beforePageCSS || "",
        head.afterPageCSS || "",
        body.beforePageJs || "",
        body.afterPageJs || "",
      ];
    }
    return {
      onMemoryCache,
      beforePageCSS,
      afterPageCSS,
      beforePageJs,
      afterPageJs,
    };
  }
}

module.exports = MarkupMaker;
