"use strict";

const { join, resolve } = require("path");
const fse = require("fs-extra");

const { pascalCase } = require("pascal-case");

const compatibleRequire = require("./compatibleRequire");

class Preparer {
  /**
   * @param {String} meseConfigUrl 项目配置文件地址
   * @param {String} distDir 存放@mese/builder所有构建出来文件的目录
   */
  constructor(meseConfigUrl, distDir) {
    //////////////////
    // 目录、文件路径 //
    //////////////////
    this.meseConfigUrl = meseConfigUrl;
    this.distDir = distDir;
    // api
    this.nodeApiDir = resolve(distDir, "nodeApi"); // 存放node环境上的api文件的一个目录
    // node page
    this.nodePageDir = resolve(distDir, "nodePage"); // 存放node环境上的pages应用的一个目录
    this.nodePageManifestUrl = resolve(this.nodePageDir, "manifest.json");
    // browser page
    this.browserPageDir = resolve(distDir, "browserPage"); // 存放浏览器环境上的应用的一个目录
    this.browserPageManifestUrl = resolve(this.browserPageDir, "manifest.json");

    // 相关对象
    this.meseConfig = null; // meseConfig对象
    this.nodePageManifest = null; // node page 关联的 manifest.json
    this.browserPageManifest = null; // browser page 关联的 manifest.json
    // 衍生的对象
    this.pagePathSet = null; // 页面——静态路由的集合
    this.dynamicPagePathSet = null; // 页面——动态路由的集合
    this.apiMap = null; // api的静态路由的map对象
    this.dynamicApiMap = null; // api的动态路由的map对象
  }

  /**
   * 检测构建出来的项目是否就绪，否则退出程序。
   * 1 检测是否存在 —— mese.config.js配置
   * 2 检测是否正确 —— 配置里的pages页面数据
   * 3 检测是否存在 —— meseAppDir目录
   * 4 检测是否存在 —— nodePageDir目录
   * 5 检测是否存在 —— nodePageDir关联的manifest.json文件
   * 6 检测是否存在 —— browserPageDir目录
   * 7 检测是否存在 —— browserPage关联的manifest.json文件
   */
  isReady() {
    const {
      meseConfigUrl,
      distDir: meseAppDir,
      nodePageDir,
      nodePageManifestUrl,
      browserPageDir,
      browserPageManifestUrl,
    } = this;

    // 1
    if (!fse.pathExistsSync(meseConfigUrl)) {
      throw new Error(`[Mese] mese.config.js not found.`);
    }

    // 2
    const { pages } = compatibleRequire(meseConfigUrl);
    if (!Array.isArray(pages) || pages.length === 0) {
      throw new Error("[Mese] pages not found.");
    }

    // 3
    if (!fse.pathExistsSync(meseAppDir)) {
      throw new Error(`[Mese] meseAppDir not found.`);
    }

    // 4
    if (!fse.pathExistsSync(nodePageDir)) {
      throw new Error(`[Mese] nodePageDir not found.`);
    }

    // 5
    if (!fse.pathExistsSync(nodePageManifestUrl)) {
      throw new Error(`[Mese] nodePage manifest.json not found.`);
    }

    // 6
    if (!fse.pathExistsSync(browserPageDir)) {
      throw new Error(`[Mese] browserPageDir not found.`);
    }

    // 7
    if (!fse.pathExistsSync(browserPageManifestUrl)) {
      throw new Error("[Mese] browserPage manifest.json not found.");
    }
  }

  /**
   * 获取mese.config.js的内容
   */
  getMeseConfig() {
    if (!this.meseConfig) {
      this.meseConfig = compatibleRequire(this.meseConfigUrl);
    }
    return this.meseConfig;
  }

  /**
   * 获取nodePage关联的manifest.json
   */
  getNodePageManifest() {
    if (!this.nodePageManifest) {
      this.nodePageManifest = compatibleRequire(this.nodePageManifestUrl);
    }
    return this.nodePageManifest;
  }

  /**
   * 获取browserPage关联的manifest.json
   */
  getBrowserPageManifest() {
    if (!this.browserPageManifest) {
      this.browserPageManifest = compatibleRequire(this.browserPageManifestUrl);
    }
    return this.browserPageManifest;
  }

  /**
   * 获取路由的pascal case字符串，
   * 它作为{meseAppDir}/browserApp/manifest.json中的名称
   */
  getPascalCasePageName(route) {
    return pascalCase(route);
  }

  /**
   * 计算出首页的pascal case字符串，
   * 它作为{meseAppDir}/browserApp/manifest.json中的名称
   */
  getPascalCasePageNameOfIndex() {
    const { pages } = this.getMeseConfig();
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
    const { distDir: meseAppDir } = this;
    const { apiFiles = [] } = this.getMeseConfig();
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
      const { pages } = this.getMeseConfig();
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
    const [{ nodePageDir: nodeAppDir }, browserAppManifest] = [
      this,
      this.getBrowserPageManifest(),
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
