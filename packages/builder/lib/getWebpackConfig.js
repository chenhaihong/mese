/*eslint no-console: 0 */

const getNodeApiConf = require("./config/webpack.nodeApi");
const getNodePageConf = require("./config/webpack.nodePage");
const getBrowserPageConf = require("./config/webpack.browserPage");

module.exports = getWebpackConfig;

/**
 * 获取构建配置
 * @param {String} mode 构建模式
 * @param {String} meseConfigUrl mese配置地址，绝对路径
 * @param {String} outputPath 存放构建结果的目录路径，绝对路径。
 * @returns {Array} 一个包含2个构建配置对象的数组
 */
function getWebpackConfig({ mode, meseConfigUrl, outputPath }) {
  if (!["production", "development"].includes(mode)) {
    mode = "production";
  }

  return [
    getNodeApiConf({ mode, meseConfigUrl, outputPath }),
    getNodePageConf({ mode, meseConfigUrl, outputPath }),
    getBrowserPageConf({ mode, meseConfigUrl, outputPath }),
  ];
}
