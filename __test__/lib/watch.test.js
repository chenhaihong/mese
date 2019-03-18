/*global expect test:true*/

const path = require('path');
const fse = require('fs-extra');
const init = require('../../lib/init');
const getConfig = require('../../lib/getWebpackConfig');
const watch = require('../../lib/watch');

const dir = path.join(__dirname, 'dirToWatch');

beforeAll(() => {
  fse.removeSync(dir);
  init(dir, () => { });
});

afterAll(() => {
  fse.removeSync(dir);
});

jest.setTimeout(20000);
test('watch should run well', (done) => {
  expect.assertions(4);
  const mode = 'development';
  const meseUrl = path.join(dir, 'mese.config.js');
  const outputPath = path.join(dir, 'dist');
  const config = getConfig(mode, meseUrl, outputPath);
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