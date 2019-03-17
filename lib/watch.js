/*eslint no-console: 0 */

const webpack = require('webpack');

module.exports = function (config) {
  const compiler = webpack(config);
  const watchOptions = {
    poll: 1000,
    aggregateTimeout: 300,
    ignored: /node_modules/,
  };

  const watching = compiler.watch(watchOptions, (err, stats) => {
    // err 对象只会包含 webpack 相关的问题，比如配置错误等。
    // 在这里处理 err 错误。
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
      return;
    }

    // 统计信息(stats)文档
    // https://webpack.docschina.org/configuration/stats
    const info = stats.toJson('none');

    if (stats.hasErrors()) {
      info.errors.forEach((item) => {
        console.error(item);
      });
      return;
    }

    if (stats.hasWarnings()) {
      info.warnings.forEach((item) => {
        console.warn(item);
      });
    }

    // 记录结果...
    console.log(stats.toString({
      colors: true,
    }));
  });

  return watching;
};