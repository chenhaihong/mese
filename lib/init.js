/*eslint no-console: 0 */

const path = require('path');
const fse = require('fs-extra');

module.exports = function (dir) {
  dir = dir.trim();
  const template = path.resolve(__dirname, '../template');
  fse.copySync(template, dir);
  console.log('[Mese] Initialized successfully.');
};