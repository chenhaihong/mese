/*global beforeAll afterAll jest expect test:true*/

const path = require('path');
const fse = require('fs-extra');
const init = require('../../src/libInit/init');
const watch = require('../../src/libPack/watch');
const getWebpackConfig = require('../../src/libPack/getWebpackConfig');

const dir = path.join(__dirname, 'dirToWatch');

beforeAll(() => {
  fse.removeSync(dir);
  init(dir, () => { });
});

afterAll(() => {
  fse.removeSync(dir);
});

jest.setTimeout(20000);
test('[libPack] watch() should run well', (done) => {
  expect.assertions(4);
  const mode = 'development';
  const meseUrl = path.join(dir, 'mese.config.js');
  const outputPath = path.join(dir, 'dist');
  const config = getWebpackConfig(mode, meseUrl, outputPath);
  watch(config, (err, stats, watching) => {
    expect(err).toBeNull();
    expect(stats.hasErrors()).toBeFalsy();
    expect(watching).toBeTruthy();
    watching.close(function () {
      expect(1).toBe(1);
      done();
    });
  });
});