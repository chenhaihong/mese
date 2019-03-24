const path = require('path');
const execSh = require('exec-sh');

module.exports = test;

function test(options, callback) {
  const jestDir = path.dirname(require.resolve('jest/package.json'));
  const { bin } = require('jest/package.json');
  const jest = path.join(jestDir, bin.jest);
  const config = require.resolve('./jestConfig.js');
  const shell = [
    `node ${jest}`,
    '--passWithNoTests',
    '--bail',
    '--no-cache',
    '--runInBand',
    '--detectOpenHandles',
    '--forceExit',
    `--config ${config}`
  ].join(' ');
  execSh(shell, options, function (err) {
    callback && callback(err);
  });
}