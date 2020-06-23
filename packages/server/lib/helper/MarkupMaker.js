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
      // for CSR
      vendorJs,
      commonJs,
      pageJs,
      vendorCss,
      commonCss,
      pageCss,
      // for SSR
      nodeJs,
    } = associatedFiles;
    const {
      getPageConfig,
      getPreloadedStateString,
      createPage,
    } = compatibleRequire(nodeJs);

    const {
      onMemoryCache, // 服务端的内存缓存
      onSSR, // 启用服务端渲染
      onCSR, // 启用客户端渲染

      docType,
      html: { beginTag: htmlBeginTag, endTag: htmlEndTag },
      head: {
        beginTag: headBeginTag,
        endTag: headEndTag,
        beforePageCSS,
        afterPageCSS,
      },
      body: {
        beginTag: bodyBeginTag,
        endTag: bodyEndTag,
        beforePageJs,
        afterPageJs,
      },
    } = await this.makeUpPageConfig(getPageConfig, { path, query });

    const preloadedStateString = await this.makeUpPreloadedStateString(
      getPreloadedStateString,
      { path, query }
    );

    // pageConfig包含跟下面结构相似的字段
    cache = [docType, htmlBeginTag];

    // head
    cache.push(
      headBeginTag,
      beforePageCSS,
      vendorCss ? `<link rel="stylesheet" href="${vendorCss}" />` : "",
      commonCss ? `<link rel="stylesheet" href="${commonCss}" />` : "",
      pageCss ? `<link rel="stylesheet" href="${pageCss}" />` : "",
      afterPageCSS,
      headEndTag
    );

    // body
    cache.push(bodyBeginTag, '<div id="root">');
    if (onSSR) {
      cache.push(
        ReactDOMServer.renderToStaticMarkup(
          createPage({ path, query, preloadedStateString, error })
        )
      );
    }
    cache.push("</div>", beforePageJs);
    if (onCSR) {
      vendorJs && cache.push(`<script src="${vendorJs}"></script>`);
      commonJs && cache.push(`<script src="${commonJs}"></script>`);
      pageJs &&
        cache.push(
          `<script src="${pageJs}"></script>`,
          `<script>ReactDOM.hydrate(Mese${pascalCasePageName}.createPage(`,
          JSON.stringify({ path, query, preloadedStateString, error }),
          `), document.getElementById("root"));</script>`
        );
    }
    cache.push(afterPageJs, bodyEndTag, htmlEndTag);

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
      // 功能性相关的字段
      onMemoryCache = false,
      onSSR = true,
      onCSR = true,

      // 跟文档结构相关的字段
      docType = "<!DOCTYPE html>",
      html = {},
      head = {},
      body = {},
    } = pageConfig;
    const [defaultHtml, defaultHead, defaultBody] = [
      { beginTag: '<html lang="zh">', endTag: "</html>" },
      {
        beginTag: "<head>",
        endTag: "</head>",
        beforePageCSS: "",
        afterPageCSS: "",
      },
      {
        beginTag: "<body>",
        endTag: "</body>",
        beforePageJs: "",
        afterPageJs: "",
      },
    ];
    return {
      onMemoryCache,
      onSSR,
      onCSR,

      docType,
      html: { ...defaultHtml, ...html },
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
