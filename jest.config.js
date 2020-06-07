const { resolve } = require("path");

const ROOT = resolve(__dirname);

module.exports = {
  verbose: true,
  testEnvironment: "node",
  setupFiles: [
    resolve(ROOT, "scripts/setup/setup-unit-test-timeout.js"),
    resolve(ROOT, "scripts/setup/setup-clean-fixture.js"),
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    // 指定收集覆盖率的目录文件，只收集每个包的lib目录
    "**/lib/**",
  ],
  coverageDirectory: resolve(ROOT, "coverage"), // 指定输出覆盖信息文件的目录
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "coverage",
    "dirToCreate",
    "dist",
  ],
  coverageThreshold: {
    // 配置测试最低阈值
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testMatch: [
    // 测试文件匹配规则
    "**/__tests__/**/*.test.js",
  ],
  testPathIgnorePatterns: [
    // 忽略测试路径
    "/node_modules/",
    "/__fixtures__/",
    "/boilerplate/",
  ],
};
