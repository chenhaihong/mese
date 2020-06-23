#!/usr/bin/env node

const path = require("path");
const execa = require("execa");

const builder = require("../lib/builder");
const CliArgvChecker = require("../lib/CliArgvChecker");
const getWebpackConfig = require("../lib/getWebpackConfig");

CliArgvChecker.check(({ mode, meseConfigUrl, outputPath, host, port }) => {
  const [subprocess, devServerPath] = [
    null,
    path.join(__dirname, "devServer.js"),
  ];

  const config = getWebpackConfig({ mode, meseConfigUrl, outputPath });
  const compiler = builder.watch(config, (err, stats) => {
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
      return;
    }

    const info = stats.toJson({
      all: false,
      assets: false,
      chunks: false,
      colors: true,
      errors: true,
      errorDetails: true,
      maxModules: 15,
      modules: false,
      moduleTrace: true,
      warnings: true,
    });

    if (stats.hasErrors()) {
      console.error(info.errors.toString({ colors: true }));
    }
    if (stats.hasWarnings()) {
      console.warn(info.warnings.toString({ colors: true }));
    }
  });
  // 构建前，关闭subprocess
  compiler.hooks.beforeCompile.tap("构建开始前", async () => {
    if (subprocess) {
      subprocess.cancel();
    }
  });
  // 等待构建完成，启动subprocess
  compiler.hooks.done.tap("所有编译完成", async () => {
    if (subprocess) {
      subprocess.cancel();
    }
    subprocess = execa("node", [devServerPath], {
      cleanup: true,
      env: { meseAppDir: outputPath, host, port },
      extendEnv: false,
    });
  });
});
