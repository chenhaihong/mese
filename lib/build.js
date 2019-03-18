const webpack = require('webpack');

module.exports = build;

/**
 * 构建
 * @param {Array} config 构建配置
 * @param {Function} callback 拷贝完成后，执行的函数
 * @returns {void}
 */
function build(config, callback) {
  const compiler = webpack(config);
  compiler.run(function (err, stats) {
    callback(err, stats);
  });
}