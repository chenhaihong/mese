module.exports = compatibleRequire;

function compatibleRequire(dynamicPath) {
  return dynamicRequire(dynamicPath);
}

/**
 * Return the expected module.
 *
 * @param {string} dynamicPath
 */
function dynamicRequire(dynamicPath) {
  let r = dynamicRequire.require;
  if (!r) {
    r =
      typeof __webpack_require__ !== "undefined"
        ? __webpack_require__
        : eval("require");
  }
  return r(dynamicPath);
}
dynamicRequire.require = null;
