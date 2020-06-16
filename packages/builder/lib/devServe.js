/**
 * Node.js API的使用文档 https://webpack.docschina.org/api/node/
 */

const webpack = require("webpack");

module.exports = devServe;

/**
 * 构建
 * @param {Array} config 构建配置
 * @param {Function} callback 拷贝完成后，执行的函数
 * @returns {void}
 */
function devServe(config, callback) {
  const compiler = webpack(config);
  compiler.run((err, stats) => {
    callback(err, stats);
  });
}
