/*eslint no-console: 0 */

const fse = require('fs-extra');
const constants = require('./constants');

module.exports = function (dir, callback) {
  let error = null;
  try {
    fse.copySync(constants.exampleDir, dir.trim());
    console.log('[Mese] Initialized successfully.');
  } catch (err) {
    error = err;
  }
  callback && callback(error);
};