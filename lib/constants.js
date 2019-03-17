const path = require('path');
const cwd = process.cwd();

module.exports = {
  mese: path.join(cwd, 'mese.config.js'),
  dist: path.join(cwd, 'dist'),
  manifest: path.join(cwd, 'dist/manifest.json'),

  // 确认值
  exampleDir: path.join(__dirname, '../example'), // 模板目录
  manifestName: 'manifest.json', // manifest的名称
};