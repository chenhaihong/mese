"use strict";

const babelPresetReact = require("..");

if (!process.env) {
  process.env = {};
}

// 偷懒型测试，只验证了输出必须包含的字段和长度。
// 没有严格测试各个提案的输入和输出是否正确。
describe("@mese/babel-preset-react", () => {
  test("with NODE_ENV=production", () => {
    process.env.NODE_ENV = "production";

    const opts = babelPresetReact();
    expect(opts).toHaveProperty("plugins");
    expect(opts).toHaveProperty("presets");

    expect(opts.plugins.length).toEqual(18);
    expect(opts.presets.length).toEqual(2);
  });

  test("without NODE_ENV=production", () => {
    process.env.NODE_ENV = null;

    const opts = babelPresetReact();
    expect(opts).toHaveProperty("plugins");
    expect(opts).toHaveProperty("presets");

    expect(opts.plugins.length).toEqual(17);
    expect(opts.presets.length).toEqual(2);
  });
});
