/*eslint no-console: 0 */

const path = require('path');
const fse = require('fs-extra');

module.exports = function (dir, callback) {
  let error = null;
  try {
    fse.copySync(path.join(__dirname, '../example'), dir.trim());
    console.log('[Mese] Initialized successfully.');
  } catch (err) {
    error = err;
  }
  callback && callback(error);
};