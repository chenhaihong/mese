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
    this.browserAppManifestUrl = resolve(
      meseAppDir,
      "browserApp", // 存放浏览器环境上的脚本的一个目录
      "manifest.json"
    );

    // 相关对象
    this.nodeMeseConfig = null;
    this.browserAppManifest = null; // meseConfig对象
    // 衍生的对象
    this.routePathSet = null; // 页面路由的集合
    this.apiMap = null; // api的map对象
  }

  /**
   * 检测构建出来的项目是否就绪，否则退出程序。
   * 1 检测配置是否存在
   * 2 检测配置里的pages页面数据是否正确
   * 3 检测构建出来的manifest.json文件
   */
  checkIsAllReadyOtherwiseExit() {
    const { nodeMeseConfigUrl, browserAppManifestUrl } = this;

    // （1）检测：必须存在mese配置
    if (!fse.pathExistsSync(nodeMeseConfigUrl)) {
      console.log(`[Mese] mese.config.node.js not found.`);
      process.exit(-1);
    }

    // （2）检测：页面数组不能为空
    const { pages } = compatibleRequire(nodeMeseConfigUrl);
    if (!Array.isArray(pages) || pages.length === 0) {
      console.log("[Mese] pages not found.");
      process.exit(-1);
    }

    // （3）检测：必须存在manifest.json文件
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
    return this.getPascalCasedPageName(path);
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
  getApiFiles() {
    const { meseAppDir } = this;
    const { api = [] } = this.getNodeMeseConfig();
    // api文件存放在api目录里
    return api.map((item) => join(meseAppDir, "api", item));
  }

  /**
   * 获取api的map对象
   */
  getApiMap() {
    let { apiMap } = this;
    if (!apiMap) {
      // （1）api目录下所有的js文件，把他们全部合并到apiMap里
      apiMap = new Map();
      const files = this.getApiFiles();
      files.forEach((file) => {
        const apiItem = compatibleRequire(file);
        for (const [routePath, resultConfig] of apiItem) {
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
  hasRoutePath(routePath) {
    let { routePathSet } = this;
    if (!routePathSet) {
      routePathSet = new Set();
      const { pages } = this.getNodeMeseConfig();
      pages.forEach(({ path }) => {
        routePathSet.add(path);
      });
      this.routePathSet = routePathSet;
    }
    return routePathSet.has(routePath);
  }

  /**
   * 获取页面的关联文件
   * @param {String} pascalCaseName 页面路由的pascalCase字符串
   * @returns {Object} 关联的文件
   */
  getAssociatedFiles(pascalCaseName) {
    const [{ meseAppDir }, nodeMeseConfig] = [this, this.getNodeMeseConfig()];
    return {
      js: "/" + nodeMeseConfig[`${pascalCaseName}.js`],
      css: "/" + nodeMeseConfig[`${pascalCaseName}.css`],
      node: join(meseAppDir, `${pascalCaseName}.node.js`),
    };
  }
}

module.exports = Preparer;
