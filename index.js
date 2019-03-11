
/**
 * 导出构建方法
 */

module.exports = {
  build(mode) {
    const build = require('./lib/build');
    build(require('./lib/webpack.config')(mode));
  },
  watch(mode) {
    const watch = require('./lib/watch');
    watch(require('./lib/webpack.config')(mode));
  },
  serve: require('./lib/serve')
};
