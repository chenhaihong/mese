/*eslint no-console: 0 */

const webpack = require('webpack');

module.exports = build;

function build(config, callback) {
  const compiler = webpack(config);
  compiler.run((err, stats) => {
    // 展示错误信息
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
    } else {
      // stats 统计信息 https://webpack.docschina.org/configuration/stats
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
    }

    callback && callback(err);
  });
}