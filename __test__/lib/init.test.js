/*global afterAll test:true*/

const path = require('path');
const fse = require('fs-extra');
const init = require('../../lib/init');

const dir = path.join(__dirname, 'dirToInit');

beforeAll(() => {
  require('../cleanExample');
});

afterAll(() => {
  fse.removeSync(dir);
});

test('init should run well', (done) => {
  init(dir, function () {
    done();
  });
});