module.exports = compatibleRequire;

/**
 * Return the expected module.
 * 这个方法暂时未有特殊的使用目的。
 * 因为这里的代码有多处使用了动态的路径，（如这些引用构建出来的文件，mese.config.node.js文件、api文件、browserApp文件、nodeApp文件），
 * 所以在未来可能需要删除require缓存的地方，都先用了这个方法来做引入，方便后面移除缓存。
 *
 * @param {string} dynamicPath
 */
function compatibleRequire(dynamicPath) {
  return require(dynamicPath);
}
