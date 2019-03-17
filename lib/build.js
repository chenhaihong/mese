/*eslint no-console: 0 */

const webpack = require('webpack');

module.exports = build;

function build(config) {
  const compiler = webpack(config);
  compiler.run((err, stats) => {
    // 在这里处理错误
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
      return;
    }

    // 统计信息
    // https://webpack.docschina.org/configuration/stats
    console.log(stats.toString({
      all: false,
      assets: !stats.hasErrors(),
      chunks: false,
      colors: true,
      errors: true,
      errorDetails: true,
      maxModules: 15,
      modules: false,
      moduleTrace: true,
      warnings: true,
    }));
  });
}