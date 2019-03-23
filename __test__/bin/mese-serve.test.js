/*global afterAll beforeAll describe jest test expect:true*/
const path = require('path');
const axios = require('axios');
const adapter = require('axios/lib/adapters/http');
const execSh = require('exec-sh');
const fs = require('fs-extra');
const kill = require('tree-kill');

const init = require('../../lib/init');
const getConfig = require('../../lib/getWebpackConfig');
const build = require('../../lib/build');

const dir = path.join(__dirname, 'dirToServe');
const mese = path.resolve(__dirname, '../../bin/mese');

let child;
beforeAll(() => {
  return new Promise(resolve => {
    fs.removeSync(dir);
    // 生成模板文件
    init(dir, function () { });
    // 构建
    const mode = 'development';
    const meseUrl = path.join(dir, 'mese.config.js');
    const outputPath = path.join(dir, 'dist');
    const config = getConfig(mode, meseUrl, outputPath);
    build(config, function () {
      child = execSh(`node ${mese} serve --port 8080`, { cwd: dir });
      setTimeout(() => { // 延迟resolve，等待http服务子进程启动
        resolve();
      }, 5000);
    });
  });
});

afterAll(() => {
  kill(child.pid, () => {
    fs.removeSync(dir);
  });
});

jest.setTimeout(30000);
describe('mese-serve should run well', () => {
  test('get / should run well', async () => {
    expect.assertions(2);
    const res = await axios.get('http://localhost:8080', { adapter });
    expect(res.status).toBe(200);
    expect(res.data).toMatch(/Hello home!/);
  });

  test('get /:page should run well', async () => {
    expect.assertions(2);
    const res = await axios.get('http://localhost:8080/home', { adapter });
    expect(res.status).toBe(200);
    expect(res.data).toMatch(/Hello home!/);
  });

  test('get page-unknown should run well', async () => {
    expect.assertions(2);
    try {
      await axios.get('http://localhost:8080/unknown', { adapter });
    } catch (error) {
      expect(error.response.status).toBe(404);
      expect(error.response.data).toMatch(/404/);
    }
  });
});