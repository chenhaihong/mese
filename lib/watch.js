
const webpack = require('webpack');

module.exports = (config) => {
  const compiler = webpack(config);
  const watchOptions = {
    poll: 1000,
    aggregateTimeout: 300,
    ignored: /node_modules/,
  };

  compiler.watch(watchOptions, (err, stats) => {
    // 在这里处理错误
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
};