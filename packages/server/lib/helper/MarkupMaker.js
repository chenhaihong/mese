const nodeFetch = require("node-fetch");
const ReactDOMServer = require("react-dom/server");

const compatibleRequire = require("./compatibleRequire");

class MarkupMaker {
  /**
   * 构造方法
   */
  constructor() {
    this.htmlStringCacheMap = new Map();
  }

  /**
   * 生成html字符串
   * @param {String} pascalCasePageName 帕斯卡格式的页面名称
   * @param {Object} options 生成页面所需的选项
   */
  async makeString(pascalCasePageName, options) {
    let cache = this.htmlStringCacheMap.get(pascalCasePageName);
    if (cache) return cache;

    const { associatedFiles, path, query } = options;
    const { js, css, node } = associatedFiles;
    const {
      getPageConfig,
      getPreloadedStateString,
      createPage,
    } = compatibleRequire(node);

    const {
      onMemoryCache = false,
      head: { beforePageCSS, afterPageCSS },
      body: { beforePageJs, afterPageJs },
    } = await this.makeUpPageConfig(getPageConfig);

    const preloadedStateString = await this.makeUpPreloadedStateString(
      getPreloadedStateString
    );

    // pageConfig包含跟下面结构相似的字段
    // docType
    cache = ["<!DOCTYPE html>"];

    // html.beginTag
    cache.push('<html lang="zh">');

    // head.beginTag
    cache.push(`<head>`);
    cache.push(beforePageCSS);
    cache.push(`<link rel="stylesheet" href="${css}">`);
    cache.push(afterPageCSS);
    // head.endTag
    cache.push(`</head>`);

    // body.beginTag
    cache.push(`<body>`);
    cache.push(
      '<div id="root">', // body.beginRoot
      ReactDOMServer.renderToStaticMarkup(
        createPage({ path, query, preloadedStateString })
      ),
      "</div>" // body.endRoot
    );
    cache.push(beforePageJs);
    cache.push(
      `<script src="${js}"></script>`,
      `<script>ReactDOM.hydrate(Mese${pascalCasePageName}.createPage(`,
      this._fastJsonStringify({ path, query, preloadedStateString }),
      `), document.getElementById("root"));</script>`
    );
    cache.push(afterPageJs);
    // body.endTag
    cache.push(`</body>`);

    // html.endTag
    cache.push(`</html>`);

    cache = cache.join("");

    if (onMemoryCache) this.htmlStringCacheMap.set(pascalCasePageName, cache);
    return cache;
  }

  /**
   * 因为原生JSON.stringify()性能稍差，所以换用这种性能高一点的方式
   */
  _fastJsonStringify({ path, query, preloadedStateString }) {
    return `{"path":"${path}","query":${JSON.stringify(
      query
    )},"preloadedStateString":'${preloadedStateString}'}`;
  }

  /**
   * 填充当前页面的配置对象，补充默认值
   *
   * @param {Object|undefined} getPageConfig 获取当前页面配置对象的方法
   * @returns {Object} 一个格式化后的配置对象
   */
  async makeUpPageConfig(getPageConfig) {
    let pageConfig = {};
    if (getPageConfig) {
      pageConfig = await getPageConfig({ nodeFetch });
    }
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

  /**
   * 获取当前页面的预加载数据
   *
   * @param {Object|undefined} getPreloadedStateString 获取当前页面的预加载数据的方法
   * @returns {String} 数据字符串
   */
  async makeUpPreloadedStateString(getPreloadedStateString) {
    let preloadedStateString = undefined;
    if (getPreloadedStateString) {
      preloadedStateString = await getPreloadedStateString({ nodeFetch });
    }
    return preloadedStateString;
  }
}

module.exports = MarkupMaker;
