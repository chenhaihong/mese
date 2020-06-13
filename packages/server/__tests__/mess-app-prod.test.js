/*global beforeAll afterAll jest describe expect test:true*/

// TODO 测试prod模式构建出来的文件
// @mese/create copy出来的sc-mese-app代码中覆盖了下面几种情况
// 1 mese.cofig.js onMemoryChche 无值、true、false
// 2 [page].js pageConfig 无值、有部分字段、有全部字段

const { join } = require("path");

const axios = require("axios");
const adapter = require("axios/lib/adapters/http");

const builder = require("@mese/builder");
const getWebpackConfig = require("@mese/builder/lib/getWebpackConfig");

const MeseServer = require("..");

const dirBoilerplate = join(
  __dirname,
  "../../../",
  "__temp_fixtures__/sc-mese-app"
);
const dirDist = join(dirBoilerplate, "dist-prod-for-MeseServer");
const [meseAppDir, host, port] = [dirDist, "127.0.0.1", "3001"];

let server;
beforeAll(() => {
  const [mode, meseConfigUrl, outputPath] = [
    "production",
    join(dirBoilerplate, "mese.config.js"),
    dirDist,
  ];
  const config = getWebpackConfig({ mode, meseConfigUrl, outputPath });

  return new Promise((resolve) => {
    builder.build(config, function (err, stats) {
      server = new MeseServer({
        meseAppDir,
        host,
        port,
        success: () => {
          resolve(server);
        },
        fail: () => {},
      });
    });
  });
});

afterAll(() => {
  server.close(() => {});
});

describe("@mese/server 正常用例", () => {
  test("应该正常访问 /", async () => {
    expect.assertions(2);
    const res = await axios.get(`http://${host}:${port}`, { adapter });
    expect(res.status).toBe(200);
    expect(res.data).toMatch(/<!DOCTYPE html>/);
  });

  test("应该正常访问 pages", async () => {
    expect.assertions(2);

    const res = await axios.get(`http://${host}:${port}/index`, { adapter });
    expect(res.status).toBe(200);
    expect(res.data).toMatch(/<!DOCTYPE html>/);
  });

  test("应该正常访问 404", async () => {
    expect.assertions(2);
    try {
      const res = await axios.get(`http://${host}:${port}/unknown`, {
        adapter,
      });
    } catch (error) {
      expect(error.response.status).toBe(404);
      expect(error.response.data).toMatch(/404/);
    }
  });

  // 测试 apis 服务
  test("应该正常访问 api", async () => {
    expect.assertions(6);
    const [url1, url2, url3] = [
      `http://${host}:${port}/get/json`,
      `http://${host}:${port}/post/pureFunction`,
      `http://${host}:${port}/get/delayFunction`,
    ];
    const res1 = await axios.get(url1, { adapter });
    const res2 = await axios.post(url2, { adapter });
    const res3 = await axios.get(url3, { adapter });
    expect(res1.status).toBe(200);
    expect(res2.status).toBe(200);
    expect(res3.status).toBe(200);
    expect(res1.data).toEqual({ success: true, title: "mese" });
    expect(res2.data).toEqual({ success: true });
    expect(res3.data).toEqual({ success: true });
  });
});

describe("@mese/server 错误用例", () => {
  test(`已经使用了${port}端口，不能重用端口`, (done) => {
    expect.assertions(1);
    // 开启服务
    new MeseServer({
      meseAppDir,
      host,
      port,
      success: () => {},
      fail: (err) => {
        // 3000端口被占用，无法启动，进入错误回调
        expect(err).toBeTruthy();
        done();
      },
    });
  });
});
