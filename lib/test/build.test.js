/*global expect test:true*/

const path = require('path');
const fs = require('fs-extra');
const build = require('../build');
const constants = require('../lib/constants');
const getConfig = require('../lib/webpack.config');

beforeEach(() => {
  removeDir();
});

afterEach(() => {
  removeDir();
});

test('build should run well', (done) => {
  // init(dir);
  done();
});

function removeDir() {
  // fs.removeSync(dir);
}
