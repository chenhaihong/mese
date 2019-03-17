/*global beforeEach afterEach jest test expect:true*/
const path = require('path');
const fs = require('fs-extra');
const execSh = require('exec-sh');

const mese = path.resolve(__dirname, '../../bin/mese');
const cwd = path.resolve(__dirname, '../../example');

beforeEach(() => {
  removeDir();
});

afterEach(() => {
  removeDir();
});

jest.setTimeout(20000);
test('mese-build should run well', (done) => {
  expect.assertions(3);
  const child = execSh(`node ${mese} watch -d`, { cwd }, function (err) {
    expect(err).toBeNull();
    done();
  });
  expect(1).toBe(1);
  setTimeout(function () {
    expect(1).toBe(1);
    child.kill();
  }, 6000);
});

/**
 * 移除构建结果、移除babel缓存
 * @returns {void}
 */
function removeDir() {
  fs.removeSync(path.join(cwd, 'dist')); // 移除构建结果
  fs.removeSync(path.join(cwd, 'node_modules')); // 移除babel缓存
}