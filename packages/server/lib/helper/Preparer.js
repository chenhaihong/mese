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
    this.manifestUrl = resolve(meseAppDir, "manifest.json");

    // 相关对象
    this.manifest = null; // meseConfig对象
    this.apiFiles = null; // api文件列表
    this.routePathSet = null; // 页面路由集合
    this.pagesSet = null; // 页面列表集合
  }

  /**
   * 检测构建出来的项目是否就绪，否则退出程序。
   * 1 检测配置是否存在
   * 2 检测配置里的pages页面数据是否正确
   * 3 检测构建出来的manifest.json文件
   */
  checkIsAllReadyOtherwiseExit() {
    const { nodeMeseConfigUrl, manifestUrl } = this;

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
    if (!fse.pathExistsSync(manifestUrl)) {
      console.log("[Mese] manifest.json not found.");
      process.exit(-1);
    }
  }

  /**
   * 获取manifest.json的内容
   */
  getManifest() {
    if (!this.manifest) {
      const { meseAppDir } = this;
      const url = join(meseAppDir, "manifest.json");
      this.manifest = compatibleRequire(url);
    }
    return this.manifest;
  }

  /**
   * 从mese.config.node.js中，计算出页面在manifest.json中的名称
   */
  getManifestPageName(routePath) {
    return pascalCase(routePath);
  }

  /**
   * 从mese.config.node.js中，计算出首页在manifest.json中的名称
   */
  getManifestPageIndexName() {
    const { nodeMeseConfigUrl } = this;
    const { pages } = compatibleRequire(nodeMeseConfigUrl);
    const { path } = pages[0];
    return this.getManifestPageName(path);
  }

  /**
   * 获取api文件列表，meseAppDir上层目录里面寻找。
   */
  getApiFiles() {
    const { meseAppDir, nodeMeseConfigUrl } = this;
    const { api = [] } = compatibleRequire(nodeMeseConfigUrl);
    return api.map((item) => join(meseAppDir, "..", item));
  }

  /**
   * 包含这个页面[name]的结果
   * @param {String} pageName 页面的名称
   * @returns {Boolean} 是否包含指定页面的结果
   */
  hasPage(pageName) {
    let { pagesSet } = this;
    if (!pagesSet) {
      pagesSet = new Set();
      const { pages } = this.getManifest();
      const keys = Object.keys(pages);
      keys.forEach((item) => {
        // item example: home.js home.css
        const name = item.split(".")[0];
        pagesSet.add(name);
      });
      this.pagesSet = pagesSet;
    }
    return pagesSet.has(pageName);
  }

  /**
   * 获取页面的关联文件
   * @param {String} pageName 页面的名称
   * @returns {Object} 关联的文件
   */
  getAssociatedFiles(pageName) {
    return {
      js: "/" + _manifest[`${pageName}.js`],
      css: "/" + _manifest[`${pageName}.css`],
      node: join(_meseAppDir, `${pageName}.node.js`),
    };
  }
}

module.exports = Preparer;
