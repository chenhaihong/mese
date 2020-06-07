const { join, parse } = require("path");
const fse = require("fs-extra");

const compatibleRequire = require("./compatibleRequire");

class Preparer {
  /**
   * 检测项目是否就绪，否则退出程序。
   * 1 检测配置是否存在
   * 2 检测配置里的pages页面数据是否正确
   * 3 检测构建出来的manifest.json文件
   */
  static checkIsAllReadyOtherwiseExit(meseConfigUrl) {
    // （1）检测：必须存在mese配置
    if (!fse.pathExistsSync(meseConfigUrl)) {
      console.log("[Mese] mess.config.js not found.");
      process.exit(-1);
    }

    // （2）检测：页面数组不能为空
    const { pages } = compatibleRequire(meseConfigUrl);
    if (!Array.isArray(pages) || pages.length === 0) {
      console.log("[Mese] pages not found.");
      process.exit(-1);
    }

    // （3）检测：必须存在manifest.json文件
    const { dir: staticDir } = parse(meseConfigUrl);
    const manifest = join(staticDir, "manifest.json");
    if (!fse.pathExistsSync(manifest)) {
      console.log("[Mese] manifest.json not found.");
      process.exit(-1);
    }
  }

  /**
   * 获取首页的名称字符串
   * @returns {String} 首页文件的名称
   */
  static getIndexName(meseConfigUrl) {
    // TODO 重写逻辑，从构建完成的页面文件重，读取页面配置
    const { pages } = compatibleRequire(meseConfigUrl);
    const { name } = parse(pages[0]);
    return name;
  }

  /**
   * 获取api文件列表
   * @returns {Object} mese.config.js里的apiFiles对象
   */
  static getApiFiles(meseConfigUrl) {
    const { api } = compatibleRequire(meseConfigUrl) || [];
    const { dir: meseAppDir } = parse(meseConfigUrl);
    return api.map((item) => join(meseAppDir, item));
  }

  /**
   * 获取manifest.json的内容
   * @returns {Object} manifest.json的内容
   */
  static getManifest(meseConfigUrl) {
    const { dir: meseAppDir } = parse(meseConfigUrl);
    const url = join(meseAppDir, "dist", "manifest.json");
    return compatibleRequire(url);
  }

  /**
   * 包含这个页面[name]的结果
   * @param {Object} manifest manifest配置对象
   * @param {String} pageName 页面的名称
   * @returns {Boolean} 是否包含指定页面的结果
   */
  static hasPage(manifest, pageName) {
    let set = Preparer.pagesSet;
    if (!set) {
      set = new Set();
      const keys = Object.keys(manifest);
      keys.forEach((item) => {
        // item example: home.js home.css
        const name = item.split(".")[0];
        set.add(name);
      });
      Preparer.pagesSet = set;
    }
    return set.has(pageName);
  }

  /**
   * 获取页面的关联文件
   * @param {String} pageName 页面的名称
   * @returns {Object} 关联的文件
   */
  static getAssociatedFiles(pageName) {
    return {
      js: "/" + _manifest[`${pageName}.js`],
      css: "/" + _manifest[`${pageName}.css`],
      node: join(_staticDir, `${pageName}.node.js`),
    };
  }
}
Preparer.pagesSet = null;

module.exports = Preparer;
