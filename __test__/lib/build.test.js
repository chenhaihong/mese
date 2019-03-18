/*global beforeAll afterAll jest expect test:true*/

const path = require('path');
const fs = require('fs-extra');
const init = require('../../lib/init');
const build = require('../../lib/build');
const getConfig = require('../../lib/getWebpackConfig');

const dir = path.join(__dirname, 'dirToBuild');

beforeAll(() => {
  fs.removeSync(dir);
  init(dir, () => { });
});

afterAll(() => {
  fs.removeSync(dir);
});

jest.setTimeout(20000);
test('build should run well', (done) => {
  expect.assertions(2);
  const mode = 'development';
  const meseUrl = path.join(dir, 'mese.config.js');
  const outputPath = path.join(dir, 'dist');
  const config = getConfig(mode, meseUrl, outputPath);
  build(config, function (err, stats) {
    expect(err).toBeNull();
    expect(stats.hasErrors()).toBeFalsy();
    done();
  });
});