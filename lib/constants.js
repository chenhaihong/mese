const path = require('path');
const cwd = process.cwd();

module.exports = {
  manifest: path.join(cwd, 'dist/manifest.json'),

  // 构建配置的相关名称
  mese: 'mese.config.js', // mese配置文件
  dist: 'dist', // 存放构建结果的目录
  manifestName: 'manifest.json', // manifest的名称
};