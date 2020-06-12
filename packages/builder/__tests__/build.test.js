/*global beforeAll afterAll jest expect test:true*/

const { join } = require("path");
const fse = require("fs-extra");

const build = require("../lib/build");
const getWebpackConfig = require("../lib/getWebpackConfig");

const dirBoilerplate = join(
  __dirname,
  "../../../",
  "__temp_fixtures__/sc-mese-app"
);
const dirDistDev = join(dirBoilerplate, "dist-dev-MeseBuilder.build");
const dirDistProd = join(dirBoilerplate, "dist-prod-MeseBuilder.build");

beforeAll(() => {
  fse.emptyDirSync(dirDistDev);
  fse.emptyDirSync(dirDistProd);
});

afterAll(() => {
  // fse.emptyDirSync(dirDistDev);
  // fse.emptyDirSync(dirDistProd);
});

jest.setTimeout(20e3);
describe("@mese/builder/lib/build", () => {
  test("执行开发模式构建", (done) => {
    expect.assertions(2);

    const [mode, meseConfigUrl, outputPath] = [
      "development",
      join(dirBoilerplate, "mese.config.js"),
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
      join(dirBoilerplate, "mese.config.js"),
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
