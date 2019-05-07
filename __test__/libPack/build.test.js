/*global beforeAll afterAll jest expect test:true*/

const path = require('path');
const fs = require('fs-extra');
const init = require('../../src/libInit/init');
const build = require('../../src/libPack/build');
const getWebpackConfig = require('../../src/libPack/getWebpackConfig');

const dir = path.join(__dirname, 'dirToBuild');

beforeAll(() => {
  fs.removeSync(dir);
  init(dir, () => { });
});

afterAll(() => {
  fs.removeSync(dir);
});

jest.setTimeout(20000);
test('[libPack] build() should run well', (done) => {
  expect.assertions(2);
  const mode = 'development';
  const meseUrl = path.join(dir, 'mese.config.js');
  const outputPath = path.join(dir, 'dist');
  const config = getWebpackConfig(mode, meseUrl, outputPath);
  build(config, function (err, stats) {
    expect(err).toBeNull();
    expect(stats.hasErrors()).toBeFalsy();
    done();
  });
});