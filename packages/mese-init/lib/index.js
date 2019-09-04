const path = require("path");
const fse = require("fs-extra");

module.exports = meseInit;

/**
 * 拷贝模板文件到指定的目录
 * @param {String} dir 等待初始化的目录，必须是绝对路径
 * @param {Function} callback 拷贝完成后，执行的函数
 * @returns {void}
 */
function meseInit(dir, callback) {
  fse.copySync(path.join(__dirname, "../example"), dir);
  callback && callback();
}
