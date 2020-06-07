/*eslint no-console: 0 */

const getBrowserAppConf = require("./config/webpack.browserApp");
const getNodeAppConf = require("./config/webpack.nodeApp");
const getNodeMeseConfigConf = require("./config/webpack.nodeMeseConfig");

module.exports = getWebpackConfig;

/**
 * 获取构建配置
 * @param {String} mode 构建模式
 * @param {String} meseConfigUrl mese配置地址，绝对路径
 * @param {String} outputPath 存放构建结果的目录路径，绝对路径。
 * @returns {Array} 一个包含2个构建配置对象的数组
 */
function getWebpackConfig({ mode, meseConfigUrl, outputPath }) {
  return [
    getBrowserAppConf({ mode, meseConfigUrl, outputPath }),
    getNodeAppConf({ mode, meseConfigUrl, outputPath }),
    getNodeMeseConfigConf({ mode, meseConfigUrl, outputPath }),
  ];
}
