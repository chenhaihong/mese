/**
 * 导出方法
 */

const init = require('./lib/init');
const build = require('./lib/build');
const watch = require('./lib/watch');
const serve = require('./lib/serve');
const getWebpackConfig = require('./lib/getWebpackConfig');

module.exports = {
  init,
  build,
  watch,
  serve,
  getWebpackConfig
};