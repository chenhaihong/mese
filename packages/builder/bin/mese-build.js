#!/usr/bin/env node

const path = require("path");
const fse = require("fs-extra");

const builder = require("../lib/builder");
const getWebpackConfig = require("../lib/getWebpackConfig");

// 1 解析参数
const argv = require("minimist")(process.argv.slice(2));
let {
  mode = "production",
  meseConfigUrl = "mese.config.js",
  outputPath = "dist",
} = argv;

// 2 规范化参数
if (!["production", "development"].includes(mode)) {
  mode = "production";
}
meseConfigUrl = path.join(process.cwd(), meseConfigUrl);
outputPath = path.join(process.cwd(), outputPath);

// 3 验证参数
if (!fse.pathExistsSync(meseConfigUrl)) {
  console.log("[MESE] meseConfigUrl not found.");
  return;
}

// 4 执行构建
const config = getWebpackConfig({ mode, meseConfigUrl, outputPath });
builder.build(config, (err, stats) => {
  if (err) {
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    return;
  }

  // stats 统计信息 https://v4.webpack.docschina.org/configuration/stats
  console.log(
    stats.toString({
      all: false,
      assets: !stats.hasErrors(),
      chunks: false,
      colors: true,
      errors: true,
      errorDetails: true,
      maxModules: 15,
      modules: false,
      moduleTrace: true,
      warnings: true,
    })
  );
});
