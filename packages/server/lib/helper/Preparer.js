const { join, resolve, parse } = require("path");
const fse = require("fs-extra");

const { pascalCase } = require("pascal-case");

const compatibleRequire = require("./compatibleRequire");

class Preparer {
  /**
   * @param {String} meseAppDir 存放构建后的文件的目录
   */
  constructor(meseAppDir) {
    // 目录、文件路径
    this.meseAppDir = meseAppDir; // 存放builder构建出来文件的目录
    this.nodeMeseConfigUrl = resolve(meseAppDir, "mese.config.node.js");
    this.browserAppDir = resolve(meseAppDir, "browserApp"); // 存放浏览器环境上的应用的一个目录
    this.nodeAppDir = resolve(meseAppDir, "nodeApp"); // 存放node环境上的pages应用的一个目录
    this.browserAppManifestUrl = resolve(this.browserAppDir, "manifest.json");

    // 相关对象
    this.nodeMeseConfig = null;
    this.browserAppManifest = null; // meseConfig对象
    // 衍生的对象
    this.pagePathSet = null; // 页面路由的集合
    this.apiMap = null; // api的map对象
  }

  /**
   * 检测构建出来的项目是否就绪，否则退出程序。
   * 1 检测是否存在 —— meseAppDir目录
   * 2 检测是否存在 —— mese.config.node.js配置
   * 3 检测是否正确 —— 配置里的pages页面数据
   * 4 检测是否存在 —— 构建出来的manifest.json文件
   */
  checkIsAllReadyOtherwiseExit() {
    const { meseAppDir, nodeMeseConfigUrl, browserAppManifestUrl } = this;

    // （1）检测：必须存在meseAppDir目录
    if (!fse.pathExistsSync(meseAppDir)) {
      console.log(`[Mese] meseAppDir not found.`);
      process.exit(-1);
    }

    // （2）检测：必须meseAppDir目录下必须存在mese配置
    if (!fse.pathExistsSync(nodeMeseConfigUrl)) {
      console.log(`[Mese] mese.config.node.js not found.`);
      process.exit(-1);
    }

    // （3）检测：页面数组不能为空
    const { pages } = compatibleRequire(nodeMeseConfigUrl);
    if (!Array.isArray(pages) || pages.length === 0) {
      console.log("[Mese] pages not found.");
      process.exit(-1);
    }

    // （4）检测：必须存在manifest.json文件
    if (!fse.pathExistsSync(browserAppManifestUrl)) {
      console.log("[Mese] manifest.json not found.");
      process.exit(-1);
    }
  }

  /**
   * 获取mese.config.node.js的内容
   */
  getNodeMeseConfig() {
    if (!this.nodeMeseConfig) {
      this.nodeMeseConfig = compatibleRequire(this.nodeMeseConfigUrl);
    }
    return this.nodeMeseConfig;
  }

  /**
   * 获取manifest.json的内容
   */
  getBrowserAppManifest() {
    if (!this.browserAppManifest) {
      this.browserAppManifest = compatibleRequire(this.browserAppManifestUrl);
    }
    return this.browserAppManifest;
  }

  /**
   * 获取路由的pascal case字符串，
   * 它作为{meseAppDir}/browserApp/manifest.json中的名称
   */
  getPascalCasePageName(routePath) {
    return pascalCase(routePath);
  }

  /**
   * 计算出首页的pascal case字符串，
   * 它作为{meseAppDir}/browserApp/manifest.json中的名称
   */
  getPascalCasePageNameOfIndex() {
    const { pages } = this.getNodeMeseConfig();
    const { path } = pages[0];
    return this.getPascalCasePageName(path);
  }

  /**
   * 计算出404页面的pascal case字符串，
   * 它作为{meseAppDir}/browserApp/manifest.json中的名称
   */
  getPascalCasePageNameOf404() {
    return "404";
  }

  /**
   * 计算出500页面的pascal case字符串，
   * 它作为{meseAppDir}/browserApp/manifest.json中的名称
   */
  getPascalCasePageNameOf500() {
    return "500";
  }

  /**
   * 获取api文件列表，{meseAppDir}/api目录里面寻找。
   */
  _getApiFiles() {
    const { meseAppDir } = this;
    const { apiFiles = [] } = this.getNodeMeseConfig();
    // api文件存放在api目录里
    return apiFiles.map((item) => join(meseAppDir, "api", pascalCase(item)));
  }

  /**
   * 获取api的map对象
   */
  getApiMap() {
    let { apiMap } = this;
    if (!apiMap) {
      // （1）api目录下所有的js文件，把他们全部合并到apiMap里
      apiMap = new Map();
      const files = this._getApiFiles();
      files.forEach((file) => {
        const apiItem = compatibleRequire(file);
        const entries = Object.entries(apiItem);
        for (const [routePath, resultConfig] of entries) {
          apiMap.set(routePath, resultConfig);
        }
      });

      this.apiMap = apiMap;
    }
    return this.apiMap;
  }

  /**
   * 判断在pages配置中，是否存在这个路由
   */
  hasPagePath(routePath) {
    let { pagePathSet } = this;
    if (!pagePathSet) {
      pagePathSet = new Set();
      const { pages } = this.getNodeMeseConfig();
      pages.forEach(({ path }) => {
        pagePathSet.add(path);
      });
      pagePathSet.add("/");
      this.pagePathSet = pagePathSet;
    }
    return pagePathSet.has(routePath);
  }

  /**
   * 获取页面的关联文件
   * @param {String} pascalCaseName 页面路由的pascalCase字符串
   * @returns {Object} 关联的文件
   */
  getAssociatedFiles(pascalCaseName) {
    const [{ nodeAppDir }, browserAppManifest] = [
      this,
      this.getBrowserAppManifest(),
    ];
    const [vendorJs, commonJs, pageJs, vendorCss, commonCss, pageCss] = [
      browserAppManifest["vendor.js"],
      browserAppManifest["common.js"],
      browserAppManifest[`${pascalCaseName}.js`],
      browserAppManifest["vendor.css"],
      browserAppManifest["common.css"],
      browserAppManifest[`${pascalCaseName}.css`],
    ];

    return {
      // 客户端所需 for CSR
      vendorJs: vendorJs ? join("/", vendorJs) : "",
      commonJs: commonJs ? join("/", commonJs) : "",
      pageJs: pageJs ? join("/", pageJs) : "",

      vendorCss: vendorCss ? join("/", vendorCss) : "",
      commonCss: commonCss ? join("/", commonCss) : "",
      pageCss: pageCss ? join("/", pageCss) : "",

      // 服务端所需 for SSR
      nodeJs: join(nodeAppDir, `${pascalCaseName}.node.js`),
    };
  }
}

module.exports = Preparer;
