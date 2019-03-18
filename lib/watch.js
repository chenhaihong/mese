const webpack = require('webpack');

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
    poll: 1000,
    aggregateTimeout: 300,
    ignored: /node_modules/,
  };
  const watching = compiler.watch(watchOptions, (err, stats) => {
    callback(err, stats, watching);
  });
}