/**
 * Node.js API的使用文档 https://webpack.docschina.org/api/node/
 */

const webpack = require("webpack");

module.exports = build;

/**
 * 构建
 * @param {Array} config 构建配置
 * @param {Function} callback 拷贝完成后，执行的函数
 * @returns {void}
 */
function build(config, callback) {
  // 错误处理 https://webpack.docschina.org/api/node/#%E9%94%99%E8%AF%AF%E5%A4%84%E7%90%86-error-handling-
  // stats 统计信息 https://webpack.docschina.org/configuration/stats
  const compiler = webpack(config);
  compiler.run((err, stats) => {
    callback(err, stats);
  });
}
