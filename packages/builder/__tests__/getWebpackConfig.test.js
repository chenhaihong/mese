/*global beforeAll afterAll describe expect test:true*/
const { join } = require("path");

const getWebpackConfig = require("../lib/getWebpackConfig");

const dirBoilerplate = join(
  __dirname,
  "../../../",
  "__temp_fixtures__/sc-mese-app"
);

describe("@mese/builder/lib/getWebpackConfig", () => {
  const [mode, meseConfigUrl, outputPath] = [
    "development",
    join(dirBoilerplate, "mese.config.js"),
    join(dirBoilerplate, "dist"),
  ];

  test("webpack.browserApp 配置应该包含这些属性", () => {
    const all = getWebpackConfig({ mode, meseConfigUrl, outputPath });
    const first = all[0];

    expect(first).toHaveProperty("name");

    expect(first).toHaveProperty("target");
    expect(first).toHaveProperty("mode");
    expect(first).toHaveProperty("watch");
    expect(first).toHaveProperty("devtool");

    expect(first).toHaveProperty("entry");
    expect(first).toHaveProperty("output");
    expect(first).toHaveProperty("module");
    expect(first).toHaveProperty("plugins");

    expect(first).toHaveProperty("resolve");
    expect(first).toHaveProperty("resolveLoader");
    expect(first).toHaveProperty("stats");
    expect(first).toHaveProperty("externals");
  });

  test("webpack.nodeApp 配置应该包含这些属性", () => {
    const all = getWebpackConfig({ mode, meseConfigUrl, outputPath });
    const second = all[1];

    expect(second).toHaveProperty("name");

    expect(second).toHaveProperty("target");
    expect(second).toHaveProperty("mode");
    expect(second).toHaveProperty("watch");
    expect(second).toHaveProperty("devtool");

    expect(second).toHaveProperty("entry");
    expect(second).toHaveProperty("output");
    expect(second).toHaveProperty("module");

    expect(second).toHaveProperty("resolve");
    expect(second).toHaveProperty("resolveLoader");
    expect(second).toHaveProperty("stats");
  });

  test("webpack.api 配置应该包含这些属性", () => {
    const all = getWebpackConfig({ mode, meseConfigUrl, outputPath });
    const third = all[2];

    expect(third).toHaveProperty("name");

    expect(third).toHaveProperty("target");
    expect(third).toHaveProperty("mode");
    expect(third).toHaveProperty("watch");
    expect(third).toHaveProperty("devtool");

    expect(third).toHaveProperty("entry");
    expect(third).toHaveProperty("output");

    expect(third).toHaveProperty("resolve");
    expect(third).toHaveProperty("resolveLoader");
    expect(third).toHaveProperty("stats");
  });

  test("webpack.nodeMeseConfig 配置应该包含这些属性", () => {
    const all = getWebpackConfig({ mode, meseConfigUrl, outputPath });
    const fourth = all[3];

    expect(fourth).toHaveProperty("name");

    expect(fourth).toHaveProperty("target");
    expect(fourth).toHaveProperty("mode");
    expect(fourth).toHaveProperty("watch");
    expect(fourth).toHaveProperty("devtool");

    expect(fourth).toHaveProperty("entry");
    expect(fourth).toHaveProperty("output");

    expect(fourth).toHaveProperty("resolve");
    expect(fourth).toHaveProperty("resolveLoader");
    expect(fourth).toHaveProperty("stats");
  });
});
