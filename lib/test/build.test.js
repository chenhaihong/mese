/*global expect test:true*/

const path = require('path');
const fs = require('fs-extra')
const build = require('../build');
const getConfig = require('../getWebpackConfig');

const mode = 'development';
const meseUrl = path.join(__dirname, '../../example/mese.config.js');
const outputPath = path.join(__dirname, '../../example/dist');

beforeEach(() => {
  removeDir();
});

afterEach(() => {
  removeDir();
});

jest.setTimeout(30000);
test('build should run well', (done) => {
  const config = getConfig({ mode, meseUrl, outputPath });
  build(config, function(err) {
    expect(err).toBeNull();
    done();
  });
});

function removeDir() {
  fs.removeSync(outputPath);
}
