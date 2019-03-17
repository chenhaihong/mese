/*global expect test:true*/

const path = require('path');
const build = require('../build');
const getConfig = require('../getWebpackConfig');

beforeEach(() => {
  removeDir();
});

afterEach(() => {
  // removeDir();
});

test('build should run well', (done) => {
  const mode = 'development';
  const meseUrl = path.join(__dirname, '../../example/mese.config.js');
  const outputPath = path.join(__dirname, '../../example/dist');
  const config = getConfig({ mode, meseUrl, outputPath });
  build(config);
  done();
});

function removeDir() {
  fs.removeSync(dir);
}
