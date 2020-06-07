"use strict";

const builder = require("..");
describe("@mese/builder", () => {
  test("导出对象应该包含这些属性", () => {
    expect(builder).toHaveProperty("build");
    expect(builder).toHaveProperty("watch");
  });
});
