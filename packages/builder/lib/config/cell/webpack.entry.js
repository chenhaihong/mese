const { join, parse } = require("path");

module.exports = (meseConfigUrl) => {
  return {
    entry: getEntry(meseConfigUrl),
  };
};

/**
 * 获取APP_CLIENT与APP_NODE的文件入口
 * @param {String} meseConfigUrl 配置文件的地址
 * @returns {Object} 一个用于获取构建入口配置的对象
 */
function getEntry(meseConfigUrl) {
  const entry = {};
  const { dir: dirApp } = parse(meseConfigUrl);

  const { pages } = require(meseConfigUrl);
  pages.forEach((pageUrl) => {
    pageUrl = join(dirApp, pageUrl);
    const { name } = parse(pageUrl);
    entry[name] = pageUrl;
  });
  return entry;
}
