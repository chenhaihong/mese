/*global expect test:true*/

const path = require('path');
const fs = require('fs-extra')
const watch = require('../watch');
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
test('watch should run well', (done) => {
  const config = getConfig({ mode, meseUrl, outputPath });
  watch(config, function (err, watcher) {
    expect(err).toBeNull();
    watcher.close(function() {
      done();
    });
  });
});

function removeDir() {
  fs.removeSync(outputPath);
}
