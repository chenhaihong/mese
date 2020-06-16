const { join, resolve } = require("path");
const fse = require("fs-extra");
const minimist = require("minimist");

const argv = minimist(process.argv.slice(2));

const dirRoot = resolve(__dirname, "..");
let dirTarget = resolve(dirRoot, "packages");

// 指定包测试
if (argv.package) {
  dirTarget = join(dirTarget, argv.package);
}

if (!fse.pathExistsSync(dirTarget)) {
  return console.error("路径不存在:", dirTarget);
}

console.info("路径:", dirTarget);

const args = [
  // "--no-cache",
  "--runInBand", // 顺序执行
  "--passWithNoTests",
  "--detectOpenHandles",
  // "--silent", // Prevent tests from printing messages through the console.
  "--config",
  resolve(dirRoot, "jest.config.js"),
  `--rootDir`,
  dirTarget,
];
console.info(`运行: jest ${args.join(" ")}\n`);
require("jest").run(args);
