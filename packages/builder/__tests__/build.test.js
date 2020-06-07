/*global beforeAll afterAll jest expect test:true*/

const { resolve } = require("path");
const fse = require("fs-extra");

const build = require("../lib/build");
const getWebpackConfig = require("../lib/getWebpackConfig");

const dirBoilerplate = resolve(__dirname, "..", "__fixtures__/boilerplate");
const dirDistDev = resolve(dirBoilerplate, "dist-build-dev");
const dirDistProd = resolve(dirBoilerplate, "dist-build-prod");

beforeAll(() => {
  fse.emptyDirSync(dirDistDev);
  fse.emptyDirSync(dirDistProd);
});

afterAll(() => {
  fse.emptyDirSync(dirDistDev);
  fse.emptyDirSync(dirDistProd);
});

jest.setTimeout(20e3);
describe("@mese/builder/lib/build", () => {
  test("执行开发模式构建", (done) => {
    expect.assertions(2);

    const [mode, meseConfigUrl, outputPath] = [
      "development",
      resolve(dirBoilerplate, "mese.config.js"),
      dirDistDev,
    ];
    const config = getWebpackConfig({ mode, meseConfigUrl, outputPath });
    build(config, function (err, stats) {
      expect(err).toBeNull();
      expect(stats.hasErrors()).toBeFalsy();
      done();
    });
  });
  test("执行生产模式构建", (done) => {
    expect.assertions(2);

    const [mode, meseConfigUrl, outputPath] = [
      "production",
      resolve(dirBoilerplate, "mese.config.js"),
      dirDistProd,
    ];
    const config = getWebpackConfig({ mode, meseConfigUrl, outputPath });
    build(config, function (err, stats) {
      expect(err).toBeNull();
      expect(stats.hasErrors()).toBeFalsy();
      done();
    });
  });
});
