/*global beforeAll afterAll jest describe expect test:true*/

const path = require('path');
const axios = require('axios');
const adapter = require('axios/lib/adapters/http');
const fs = require('fs-extra');

const init = require('../../lib/init');
const getConfig = require('../../lib/getWebpackConfig');
const build = require('../../lib/build');
const serve = require('../../lib/serve');

const dir = path.join(__dirname, 'dirToServe');

let server;
beforeAll(() => {
  return new Promise(resolve => {
    // 生成模板文件
    fs.removeSync(dir);
    init(dir, function () { });
    // 构建
    const mode = 'development';
    const meseUrl = path.join(dir, 'mese.config.js');
    const outputPath = path.join(dir, 'dist');
    const config = getConfig(mode, meseUrl, outputPath);
    build(config, function () {
      // 开启服务
      const index = 'home';
      const apiFiles = require(meseUrl).api.map(item => path.join(dir, item));
      const manifest = require(path.join(dir, 'dist/manifest.json'));
      const staticDir = path.join(dir, 'dist');
      const port = 3000;
      const success = (_server) => {
        server = _server;
        resolve(server);
      };
      const fail = () => { };
      serve({ index, apiFiles, manifest, staticDir, port, success, fail });
    });
  });
});

afterAll(() => {
  server.close(() => {
    fs.removeSync(dir);
  });
});

jest.setTimeout(30000);
describe('serve should run well', () => {
  test('get / should run well', async () => {
    expect.assertions(2);
    const res = await axios.get('http://localhost:3000', { adapter });
    expect(res.status).toBe(200);
    expect(res.data).toMatch(/<!DOCTYPE html>/);
  });

  test('get /:page should run well', async () => {
    expect.assertions(2);
    const res = await axios.get('http://localhost:3000/home', { adapter });
    expect(res.status).toBe(200);
    expect(res.data).toMatch(/<!DOCTYPE html>/);
  });

  test('get page-unknown should run well', async () => {
    expect.assertions(2);
    try {
      await axios.get('http://localhost:3000/unknown', { adapter });
    } catch (error) {
      expect(error.response.status).toBe(404);
      expect(error.response.data).toMatch(/404/);
    }
  });

  // 测试 apis 服务
  test('get apis should run well', async () => {
    expect.assertions(6);
    const res1 = await axios.get('http://localhost:3000/get/json', { adapter });
    const res2 = await axios.post('http://localhost:3000/post/pureFunction', { adapter });
    const res3 = await axios.get('http://localhost:3000/get/delayFunction', { adapter });
    expect(res1.status).toBe(200);
    expect(res2.status).toBe(200);
    expect(res3.status).toBe(200);
    expect(res1.data).toEqual({ success: true, title: 'mese' });
    expect(res2.data).toEqual({ success: true });
    expect(res3.data).toEqual({ success: true });
  });
});


jest.setTimeout(30000);
describe('serve should not run well', () => {
  test('should not start server', (done) => {
    expect.assertions(1);
    // 开启服务
    const index = 'home';
    const meseUrl = path.join(dir, 'mese.config.js');
    const apiFiles = require(meseUrl).api.map(item => path.join(dir, item));
    const manifest = require(path.join(dir, 'dist/manifest.json'));
    const staticDir = path.join(dir, 'dist');
    const port = 3000;
    const success = () => { };
    const fail = (err) => { // 3000端口被占用，无法启动，进入错误回调
      expect(err).toBeTruthy();
      done();
    };
    serve({ index, apiFiles, manifest, staticDir, port, success, fail });
  });
});