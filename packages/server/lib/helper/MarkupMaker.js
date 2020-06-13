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
      head: { beforePageCSS, afterPageCSS },
      body: { beforePageJs, afterPageJs },
    } = this.makeUpPageConfig(pageConfig);
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
   * 填充当前页面的配置对象，补充默认值
   *
   * @param {Object|undefined} pageConfig 当前页面的配置对象
   * @returns {Object} 一个格式化后的配置对象
   */
  makeUpPageConfig(pageConfig = {}) {
    let { onMemoryCache = false, head = {}, body = {} } = pageConfig;
    const [defaultHead, defaultBody] = [
      { beforePageCSS: "", afterPageCSS: "" },
      { beforePageJs: "", afterPageJs: "" },
    ];
    return {
      onMemoryCache,
      head: { ...defaultHead, ...head },
      body: { ...defaultBody, ...body },
    };
  }
}

module.exports = MarkupMaker;
