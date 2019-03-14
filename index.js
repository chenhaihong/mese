
/**
 * 导出构建方法
 */

module.exports = {
  build: function (mode) {
    const build = require('./lib/build');
    const config = require('./lib/webpack.config')(mode);
    build(config);
  },
  watch: function (mode) {
    const watch = require('./lib/watch');
    const config = require('./lib/webpack.config')(mode);
    watch(config);
  },
  serve: function (port, open) {
    require('./lib/serve')(port, open);
  }
};
