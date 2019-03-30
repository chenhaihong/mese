/*global afterAll beforeAll jest test expect:true*/
const path = require('path');
const execSh = require('exec-sh');
const fs = require('fs-extra');
const kill = require('tree-kill');
const init = require('../../lib/init');

const dir = path.join(__dirname, 'dirToWatch');
const mese = path.resolve(__dirname, '../../bin/mese');

let child;
beforeAll(() => {
  return new Promise(resolve => {
    fs.removeSync(dir);
    // 生成模板文件
    init(dir, () => { });
    // 构建
    child = execSh(`node ${mese} watch -d`, { cwd: dir });
    setTimeout(() => { // 延迟resolve，等待watch构建服务子进程启动
      resolve();
    }, 5000);
  });
});

afterAll(() => {
  kill(child.pid, () => {
    fs.removeSync(dir);
  });
});

jest.setTimeout(30000);
test('mese-watch should run well', () => {
  expect.assertions(1);
  const pathMamifest = path.join(dir, 'dist/manifest.json');
  expect(fs.pathExistsSync(pathMamifest)).toBeTruthy();
});