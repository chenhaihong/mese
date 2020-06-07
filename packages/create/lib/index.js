'use strict';

const { join } = require('path');
const { copySync } = require('fs-extra');

module.exports = meseCreate;

/**
 * 拷贝模板文件到指定的目录
 * @param {String} dirTarget 等待初始化的目录，必须是绝对路径
 * @param {Function} callback 拷贝完成后，执行的函数
 * @returns {void}
 */
function meseCreate(dirTarget, callback) {
  copySync(join(__dirname, '..', 'boilerplate'), dirTarget);
  callback && callback();
}
