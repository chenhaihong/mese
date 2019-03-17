/*global expect test:true*/

const path = require('path');
const fs = require('fs-extra');
const init = require('../init');
const dir = path.join(__dirname, 'dirToInit');

beforeEach(() => {
  removeDir();
});

afterEach(() => {
  removeDir();
});

test('init should run well', (done) => {
  init(dir);
  done();
});

function removeDir() {
  fs.removeSync(dir);
}
