const fetch = require("node-fetch");
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

    const { associatedFiles, path, query, error = undefined } = options;
    const {
      vendorJs,
      commonJs,
      js,
      vendorCss,
      commonCss,
      css,
      node,
    } = associatedFiles;
    const {
      getPageConfig,
      getPreloadedStateString,
      createPage,
    } = compatibleRequire(node);

    const {
      onMemoryCache, // 服务端的内存缓存
      onSSR, // server side render
      onCSR, // client side render

      head: { beforePageCSS, afterPageCSS },
      body: { beforePageJs, afterPageJs },
    } = await this.makeUpPageConfig(getPageConfig, { path, query });

    const preloadedStateString = await this.makeUpPreloadedStateString(
      getPreloadedStateString,
      { path, query }
    );

    // pageConfig包含跟下面结构相似的字段
    // docType
    cache = ["<!DOCTYPE html>"];

    // html.beginTag
    cache.push('<html lang="zh">');

    // head.beginTag
    cache.push(`<head>`);
    cache.push(beforePageCSS);
    vendorCss && cache.push(`<link rel="stylesheet" href="${vendorCss}">`);
    commonCss && cache.push(`<link rel="stylesheet" href="${commonCss}">`);
    cache.push(`<link rel="stylesheet" href="${css}">`);
    cache.push(afterPageCSS);
    // head.endTag
    cache.push(`</head>`);

    // body.beginTag
    cache.push(`<body>`);
    // body.beginRoot
    cache.push('<div id="root">');
    if (onSSR) {
      cache.push(
        ReactDOMServer.renderToStaticMarkup(
          createPage({ path, query, preloadedStateString, error })
        )
      );
    }
    // body.endRoot
    cache.push("</div>");
    cache.push(beforePageJs);
    if (onCSR) {
      vendorJs && cache.push(`<script src="${vendorJs}"></script>`);
      commonJs && cache.push(`<script src="${commonJs}"></script>`);
      cache.push(
        `<script src="${js}"></script>`,
        `<script>ReactDOM.hydrate(Mese${pascalCasePageName}.createPage(`,
        JSON.stringify({ path, query, preloadedStateString, error }),
        `), document.getElementById("root"));</script>`
      );
    }
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
   * 填充当前页面的配置对象，补充默认值
   *
   * @param {Object|undefined} getPageConfig 获取当前页面配置对象的方法
   * @param {Object} options
   * @returns {Object} 一个格式化后的配置对象
   */
  async makeUpPageConfig(getPageConfig, options) {
    let pageConfig = {};
    if (getPageConfig) {
      const { path, query } = options;
      pageConfig = await getPageConfig({ fetch, path, query });
    }
    let {
      onMemoryCache = false,
      onSSR = true,
      onCSR = true,

      // docType, // future feature
      // html, // future feature
      head = {},
      body = {},
    } = pageConfig;
    const [defaultHead, defaultBody] = [
      { beforePageCSS: "", afterPageCSS: "" },
      { beforePageJs: "", afterPageJs: "" },
    ];
    return {
      onMemoryCache,
      onSSR,
      onCSR,

      head: { ...defaultHead, ...head },
      body: { ...defaultBody, ...body },
    };
  }

  /**
   * 获取当前页面的预加载数据
   *
   * @param {Object|undefined} getPreloadedStateString 获取当前页面的预加载数据的方法
   * @param {Object} options
   * @returns {String} 数据字符串
   */
  async makeUpPreloadedStateString(getPreloadedStateString, options) {
    let preloadedStateString = undefined;
    if (getPreloadedStateString) {
      const { path, query } = options;
      preloadedStateString = await getPreloadedStateString({
        fetch,
        path,
        query,
      });
    }
    return preloadedStateString;
  }
}

module.exports = MarkupMaker;
