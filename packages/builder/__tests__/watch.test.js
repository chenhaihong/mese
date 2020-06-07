/*global beforeAll afterAll jest expect test:true*/

const { resolve } = require("path");
const fse = require("fs-extra");

const watch = require("../lib/watch");
const getWebpackConfig = require("../lib/getWebpackConfig");

const dirBoilerplate = resolve(__dirname, "..", "__fixtures__/boilerplate");
const dirDistDev = resolve(dirBoilerplate, "dist-watch-dev");
const dirDistProd = resolve(dirBoilerplate, "dist-watch-prod");

beforeAll(() => {
  fse.emptyDirSync(dirDistDev);
  fse.emptyDirSync(dirDistProd);
});

afterAll(() => {
  fse.emptyDirSync(dirDistDev);
  fse.emptyDirSync(dirDistProd);
});

jest.setTimeout(20e3);
describe("@mese/builder/lib/watch", () => {
  test("执行开发模式构建", (done) => {
    expect.assertions(4);

    const [mode, meseConfigUrl, outputPath] = [
      "development",
      resolve(dirBoilerplate, "mese.config.js"),
      dirDistDev,
    ];
    const config = getWebpackConfig({ mode, meseConfigUrl, outputPath });
    watch(config, (err, stats, watching) => {
      expect(err).toBeNull();
      expect(stats.hasErrors()).toBeFalsy();
      expect(watching).toBeTruthy();
      watching.close(function () {
        expect(1).toBe(1);
        done();
      });
    });
  });
  test("执行生产模式构建", (done) => {
    expect.assertions(4);

    const [mode, meseConfigUrl, outputPath] = [
      "production",
      resolve(dirBoilerplate, "mese.config.js"),
      dirDistProd,
    ];
    const config = getWebpackConfig({ mode, meseConfigUrl, outputPath });
    watch(config, (err, stats, watching) => {
      expect(err).toBeNull();
      expect(stats.hasErrors()).toBeFalsy();
      expect(watching).toBeTruthy();
      watching.close(function () {
        expect(1).toBe(1);
        done();
      });
    });
  });
});
