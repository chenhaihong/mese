/**
 * Node.js API的使用文档 https://webpack.docschina.org/api/node/
 */

const webpack = require("webpack");

module.exports = watch;

/**
 * 监听构建的文件，文件变化时自动再次构建
 * @param {Array} config 构建配置
 * @param {Function} callback 构建完成后，执行的函数
 * @returns {void}
 */
function watch(config, callback) {
  const compiler = webpack(config);
  const watchOptions = {
    poll: 2000,
    aggregateTimeout: 500, // ms，重新构建前增加延迟，将这段时间内进行的任何其他更改都聚合到一次重新构建里
    ignored: /node_modules/,
  };
  // 错误处理 https://webpack.docschina.org/api/node/#%E9%94%99%E8%AF%AF%E5%A4%84%E7%90%86-error-handling-
  // stats 统计信息 https://webpack.docschina.org/configuration/stats
  const watching = compiler.watch(watchOptions, (err, stats) => {
    callback(err, stats, watching);
  });
}
