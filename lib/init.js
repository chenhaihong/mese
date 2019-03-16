/*eslint no-console: 0 */

const path = require('path');
const fse = require('fs-extra');

module.exports = (directory) => {
  if (directory) {
    directory = safePath(directory);
  } else {
    directory = process.cwd();
  }

  const template = path.resolve(__dirname, '../template');
  fse.copySync(template, directory);
  console.log('[Mese] Initialized successfully.');
};

/**
 * 返回绝对路径
 * @param {String} dir 当前工作目录下的路径
 * @returns {String} 安全的路径
 */
function safePath(dir) {
  dir = dir.trim();

  // 如果是 / 或 \ 开头的目录，加上 . 前缀，避免对根目录进行清空操作
  /^(\/|\\)/.test(dir) && (dir = '.' + dir);

  return path.resolve(process.cwd(), dir);
}