const path = require('path');
const fs = require('fs-extra');
const init = require('../../lib/init');
const libJest = require('../../libJest');

const dir = path.join(__dirname, 'dirToJest');

beforeAll(() => {
  fs.removeSync(dir);
  init(dir, () => { });
});

afterAll(() => {
  fs.removeSync(dir);
});

jest.setTimeout(30000);
describe('libJest/index.js should run well', () => {
  test('should run well', async () => {
    expect.assertions(1);
    const data = await libJest({ cwd: dir });
    expect(data).toBeTruthy();
  });
});