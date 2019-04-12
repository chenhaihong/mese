

module.exports = compatibleRequire;

function compatibleRequire(variablePath) {
  let file = '';
  // 
  // () 在 `${cwd}/dist/` 查找
  // () 在 `${cwd}` 查找

  return require(file);
}

/**
 * Return the expected module.
 *
 * @param {string} variablePath
 * @return {Object}
 * @private
 */
function variableRequire(variablePath) {
  let r = variableRequire.require;
  if (!r) {
    r = typeof __webpack_require__ !== 'undefined' ? __webpack_require__ : eval('require');
  }
  return r(variablePath);
}
variableRequire.require = null;