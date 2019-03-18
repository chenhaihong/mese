/*global beforeEach afterEach jest test expect:true*/
const path = require('path');
const execSh = require('exec-sh');
const fs = require('fs-extra');
const init = require('../../lib/init');
const getConfig = require('../../lib/getWebpackConfig');
const build = require('../../lib/build');

const dir = path.join(__dirname, 'dirToServe');
const mese = path.resolve(__dirname, '../../bin/mese');

beforeAll(() => {
  return new Promise(resolve => {
    // 生成模板文件
    fs.removeSync(dir);
    init(dir, function () { });
    // 构建
    const mode = 'development';
    const meseUrl = path.join(dir, 'mese.config.js');
    const outputPath = path.join(dir, 'dist');
    const config = getConfig(mode, meseUrl, outputPath);
    build(config, function (err, stats) {
      resolve();
    });
  });
});

// Error: EBUSY: 
//  resource busy or locked, 
//  rmdir 'F:\WWW\mese\__test__\bin\dirToWatch'
// afterAll(() => {
//   fs.removeSync(dir);
// });

jest.setTimeout(20000);
test('mese-serve should run well', (done) => {
  expect.assertions(1);
  const child = execSh(`node ${mese} serve --port 8080`, { cwd: dir }, function (err) {
    expect(err).toBeNull();
    done();
  });
  setTimeout(function () {
    child.kill();
  }, 5000);
});