
const path = require('path');
const fse = require('fs-extra');
const serve = require('./serve');

const cwd = process.cwd();
const meseUrl = path.join(cwd, process.env.config || 'mese.config.js');
const staticDir = path.join(cwd, process.env.staticDir || 'dist');
const port = process.env.port || 3000;

checkIsAllReadyOrExit();

const index = getIndex();
const apiFiles = getApiFiles();
const manifest = getManifest();

serve({
  index,
  apiFiles,
  manifest,
  staticDir,
  port,
  success() {
    console.log(`[Mese] Listening on port ${port}`);
  },
  fail: onError
});

/**
 * 检测是否就绪，否则退出程序
 */
function checkIsAllReadyOrExit() {
  // （1）检测：必须存在mese配置
  if (!fse.pathExistsSync(meseUrl)) {
    console.log('[Mese] mess.js not found.');
    process.exit(-1);
  }

  // （2）检测：页面数组不能为空
  const pages = variableRequire(meseUrl).pages;
  if (!pages) {
    console.log('[Mese] pages not found.');
    process.exit(-1);
  }

  // （3）检测：必须存在manifest.json文件
  const url = path.join(staticDir, 'manifest.json');
  if (!fse.pathExistsSync(url)) {
    console.log('[Mese] manifest.json not found.');
    process.exit(-1);
  }
}

/**
 * 获取首页的名称字符串
 * @returns {String} 首页文件的名称
 */
function getIndex() {
  const pages = variableRequire(meseUrl).pages;
  return path.parse(pages[0]).name;
}

/**
 * 获取manifest.json的内容
 * @returns {Object} manifest.json的内容
 */
function getApiFiles() {
  const apiFiles = variableRequire(meseUrl).api || [];
  return apiFiles.map(item => path.join(cwd, item));
}

/**
 * 获取manifest.json的内容
 * @returns {Object} manifest.json的内容
 */
function getManifest() {
  const url = path.join(staticDir, 'manifest.json');
  return variableRequire(url);
}

/**
 * 监听http错误
 * @param {Error} error 错误
 * @returns {void}
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Return the expected module.
 *
 * @param {string} variablePath
 * @return {Object}
 */
function variableRequire(variablePath) {
  // let r = variableRequire.require;
  // if (!r) {
  //   r = typeof __webpack_require__ !== 'undefined' ? __webpack_require__ : eval('require');
  // }
  // return r(variablePath);
  return require(variablePath);
}
// variableRequire.require = null;