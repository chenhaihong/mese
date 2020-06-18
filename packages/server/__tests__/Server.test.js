/*global beforeAll afterAll jest describe expect test:true*/

// TODO 测试dev模式构建出来的文件
// @mese/create copy出来的sc-mese-app代码中覆盖了下面几种情况
//
// getPageConfig 不存在
// getPageConfig onMemoryChche 无值、true、false
// getPageConfig onSSR、onCSR 无值、true、false
// getPageConfig head
// getPageConfig body

const { join } = require("path");

const axios = require("axios");
const adapter = require("axios/lib/adapters/http");

const builder = require("@mese/builder");
const getWebpackConfig = require("@mese/builder/lib/getWebpackConfig");

const MeseServer = require("../lib/Server");

const dirBoilerplate = join(
  __dirname,
  "../../../",
  "__temp_fixtures__/sc-mese-app"
);
const dirDist = join(dirBoilerplate, "dist-for-MeseServer");
const [meseAppDir, host, port] = [dirDist, "127.0.0.1", "3000"];

let server;
beforeAll(() => {
  const [mode, meseConfigUrl, outputPath] = [
    "development",
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

describe("@mese/server", () => {
  test("应该包含以下静态属性", () => {
    expect(MeseServer).toHaveProperty("startUpSuccessfully");
    expect(MeseServer).toHaveProperty("startUpUnsuccessfully");
  });
});

describe("@mese/server 正常用例", () => {
  test("应该正常访问 /", async (done) => {
    expect.assertions(2);
    const res = await axios.get(`http://${host}:${port}`, { adapter });
    expect(res.status).toBe(200);
    expect(res.data).toMatch(/<!DOCTYPE html>/);

    done();
  });

  test("应该正常访问 pages", async (done) => {
    expect.assertions(6);

    const [url1, url2] = [
      `http://${host}:${port}/index`,
      `http://${host}:${port}/pageWithPreloadedState`,
    ];
    const res1 = await axios.get(url1, { adapter });
    const res2 = await axios.get(url2, { adapter });

    expect(res1.status).toBe(200);
    expect(res2.status).toBe(200);

    expect(res1.data).toMatch(/<!DOCTYPE html>/);
    expect(res1.data).toMatch(/一个简易的 React ssr 框架。/);

    expect(res2.data).toMatch(/<!DOCTYPE html>/);
    expect(res2.data).toMatch(/这个页面包含有预加载数据的逻辑。/);

    done();
  });

  // 测试 apis 服务
  test("应该正常访问 api", async (done) => {
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
    expect(res1.data).toEqual({ success: true, message: "这是纯json格式数据" });
    expect(res2.data).toEqual({ success: true, messag: "这是一个纯函数" });
    expect(res3.data).toEqual({ success: true, message: "这是一个异步函数" });

    done();
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

  test("当访问不存在的url时，应该进入404", async (done) => {
    expect.assertions(2);
    try {
      await axios.get(`http://${host}:${port}/unknown`, { adapter });
    } catch (error) {
      expect(error.response.status).toBe(404);
      expect(error.response.data).toMatch(/404/);
    }

    done();
  });

  test("当访问api，但method不匹配时，应该进入404", async (done) => {
    try {
      await axios.post(`http://${host}:${port}/get/json`, { adapter });
    } catch (error) {
      expect(error.response.status).toBe(404);
      expect(error.response.data).toMatch(/404/);
    }

    done();
  });

  test("当访问的api出错时，应该进入500", async (done) => {
    try {
      await axios.get(`http://${host}:${port}/get/pureFunction/withError`, {
        adapter,
      });
    } catch (error) {
      expect(error.response.status).toBe(500);
      expect(error.response.data).toMatch(/500/);
      expect(error.response.data).toMatch(
        /ReferenceError: message is not defined/
      );
    }

    done();
  });
});
