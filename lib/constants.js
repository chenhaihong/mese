const path = require('path');
const cwd = process.cwd();

module.exports = {
  mese: path.join(cwd, 'mese.config.js'),
  dist: path.join(cwd, 'dist'),
  manifest: path.join(cwd, 'dist/manifest.json'),
  manifestName: 'manifest.json',
};