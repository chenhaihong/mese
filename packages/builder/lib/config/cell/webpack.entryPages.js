const { join, parse } = require("path");

const { pascalCase } = require("pascal-case");

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
  const { dir: appRoot } = parse(meseConfigUrl);

  const { pages } = require(meseConfigUrl);
  pages.forEach(({ path, component }) => {
    const [pascalCasedKey, pageAbsolutePath] = [
      pascalCase(path), // 1 帕斯卡格式化的路由作为entry的key
      join(appRoot, component), // 2 拼接出页面组件的绝对路径
    ];
    entry[pascalCasedKey] = pageAbsolutePath;
  });
  return entry;
}
