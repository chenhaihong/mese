const path = require('path');
const fs = require('fs-extra');
const init = require('../../lib/init');
const _jest = require('../../lib/jest');

const dir = path.join(__dirname, 'dirToJest');

beforeAll(() => {
  require('../cleanExample');
  fs.removeSync(dir);
  init(dir, () => { });
});

afterAll(() => {
  // fs.removeSync(dir);
});

jest.setTimeout(30000);
describe('lib/jest.js should run well', () => {
  test('should run well', (done) => {
    expect.assertions(1);
    _jest({ cwd: dir }, (err) => {
      expect(err).toBeNull();
      done();
    });
  });
});