module.exports = compatibleRequire;

/**
 * Return the expected module.
 * 避免webpack构建时报这个警告，Critical dependency: the request of a dependency is an expression
 *
 * @param {string} dynamicPath
 */
function compatibleRequire(dynamicPath) {
  let r = compatibleRequire.require;
  if (!r) {
    r =
      typeof __webpack_require__ !== "undefined"
        ? __webpack_require__
        : eval("require");
  }
  return r(dynamicPath);
}
compatibleRequire.require = null;
