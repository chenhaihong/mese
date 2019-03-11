
/**
 * 导出构建方法
 */

const watch = require('./lib/watch');
const build = require('./lib/build');

module.exports = {
  watch: () => { watch(require('./lib/webpack.config')) },
  build: () => { build(require('./lib/webpack.config')) },
};
