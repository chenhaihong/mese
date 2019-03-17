
/**
 * 导出构建方法
 */

const init = require('./lib/init');
const build = require('./lib/build');
const watch = require('./lib/watch');
const serve = require('./lib/serve');

module.exports = {
  init,
  build,
  watch,
  serve
};
