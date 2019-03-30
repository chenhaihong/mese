/*global beforeAll afterAll describe test expect:true*/
const path = require('path');
const execSh = require('exec-sh');
const fs = require('fs-extra');
const init = require('../../lib/init');

const dir = path.resolve(__dirname, 'dirToMeseTest');
const mese = path.resolve(__dirname, '../../bin/mese');

beforeAll(() => {
  fs.removeSync(dir);
  init(dir, () => { });
});

afterAll(() => {
  // fs.removeSync(dir);
});

jest.setTimeout(30000);
describe('mese-test should run well', () => {
  test('should run well', (done) => {
    expect.assertions(1);
    execSh(`node ${mese} test`, { cwd: dir }, function (err) {
      expect(err).toBeNull();
      done();
    });
  });
});