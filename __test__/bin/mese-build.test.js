/*global beforeEach afterEach jest test expect:true*/
const path = require('path');
const execSh = require('exec-sh');
const fs = require('fs-extra');
const init = require('../../lib/init');

const dir = path.join(__dirname, 'dirToBuild');
const mese = path.resolve(__dirname, '../../bin/mese');

beforeAll(() => {
  fs.removeSync(dir);
  init(dir, () => { });
});

afterAll(() => {
  fs.removeSync(dir);
});

jest.setTimeout(20000);
test('mese-build should run well', (done) => {
  expect.assertions(1);
  execSh(`node ${mese} build -d`, { cwd: dir }, function (err) {
    expect(err).toBeNull();
    done();
  });
});