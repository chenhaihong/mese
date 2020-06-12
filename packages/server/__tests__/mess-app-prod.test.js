/*global beforeAll afterAll jest describe expect test:true*/

// TODO 测试prod模式构建出来的文件
// @mese/create copy出来的sc-mese-app代码中覆盖了下面几种情况
// 1 mese.cofig.js onMemoryChche 无值、true、false
// 2 [page].js pageConfig 无值、有部分字段、有全部字段

const { resolve } = require("path");
const axios = require("axios");
const fse = require("fs-extra");

const adapter = require("axios/lib/adapters/http");

const MeseServer = require("../lib/server");

const dirBoilerplate = join(
  __dirname,
  "../../../",
  "__temp_fixtures__/sc-mese-app"
);
const dirDist = join(dirBoilerplate, "dist-prod-for-MeseServer");
const [meseAppDir, host, port] = [dirDist, "127.0.0.1", "3000"];

// let server;
// beforeAll(() => {
//   // return new Promise((resolve) => {
//   //   server = new Server({
//   //     meseAppDir,
//   //     host,
//   //     port,
//   //     success: () => {
//   //       resolve(server);
//   //     },
//   //     fail: () => {},
//   //   });
//   // });
// });

// afterAll(() => {
//   // server.close(() => {});
// });

// describe("@mese/server", () => {
//   test("1 = 1", () => {
//     expect(1).toBe(1);
//   });
// });

// jest.setTimeout(30000);
// describe("serve should run well", () => {
//   test("get / should run well", async () => {
//     expect.assertions(2);
//     const res = await axios.get("http://localhost:3000", { adapter });
//     expect(res.status).toBe(200);
//     expect(res.data).toMatch(/<!DOCTYPE html>/);
//   });

//   test("get /:page should run well", async () => {
//     expect.assertions(2);
//     const res = await axios.get("http://localhost:3000/home", { adapter });
//     expect(res.status).toBe(200);
//     expect(res.data).toMatch(/<!DOCTYPE html>/);
//   });

//   test("get page-unknown should run well", async () => {
//     expect.assertions(2);
//     try {
//       await axios.get("http://localhost:3000/unknown", { adapter });
//     } catch (error) {
//       expect(error.response.status).toBe(404);
//       expect(error.response.data).toMatch(/404/);
//     }
//   });

//   // 测试 apis 服务
//   test("get apis should run well", async () => {
//     expect.assertions(6);
//     const res1 = await axios.get("http://localhost:3000/get/json", { adapter });
//     const res2 = await axios.post("http://localhost:3000/post/pureFunction", {
//       adapter,
//     });
//     const res3 = await axios.get("http://localhost:3000/get/delayFunction", {
//       adapter,
//     });
//     expect(res1.status).toBe(200);
//     expect(res2.status).toBe(200);
//     expect(res3.status).toBe(200);
//     expect(res1.data).toEqual({ success: true, title: "mese" });
//     expect(res2.data).toEqual({ success: true });
//     expect(res3.data).toEqual({ success: true });
//   });
// });

// jest.setTimeout(30000);
// describe("serve should not run well", () => {
//   test("should not start server", (done) => {
//     expect.assertions(1);
//     // 开启服务
//     const index = "home";
//     const meseUrl = path.join(dir, "mese.config.js");
//     const apiFiles = require(meseUrl).api.map((item) => path.join(dir, item));
//     const manifest = require(path.join(dir, "dist/manifest.json"));
//     const staticDir = path.join(dir, "dist");
//     const port = 3000;
//     const success = () => {};
//     const fail = (err) => {
//       // 3000端口被占用，无法启动，进入错误回调
//       expect(err).toBeTruthy();
//       done();
//     };
//     serve({ index, apiFiles, manifest, staticDir, port, success, fail });
//   });
// });
