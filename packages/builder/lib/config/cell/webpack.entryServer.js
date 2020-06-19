const { join, parse } = require("path");

const { pascalCase } = require("pascal-case");

module.exports = (meseConfigUrl) => {
  return {
    entry: getEntryServer(meseConfigUrl),
  };
};

/**
 * 获取APP_CLIENT与APP_NODE的文件入口
 * @param {String} meseConfigUrl 配置文件的地址
 * @returns {Object} 一个用于获取构建入口配置的对象
 */
function getEntryServer(meseConfigUrl) {
  const { dir: appRoot } = parse(meseConfigUrl);
  const { server } = require(meseConfigUrl);
  const entry = {
    server: join(appRoot, server),
  };
  return entry;
}
