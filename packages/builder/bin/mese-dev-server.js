#!/usr/bin/env node

const path = require("path");
const execa = require("execa");

const builder = require("../lib/builder");
const CliArgvChecker = require("../lib/CliArgvChecker");
const getWebpackConfig = require("../lib/getWebpackConfig");

CliArgvChecker.check(({ mode, meseConfigUrl, outputPath, host, port }) => {
  let [subprocess, devServerPath] = [
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
  // 触发时机：监听模式下，一个新的编译(compilation)触发之后，执行一个插件，但是是在实际编译开始之前。
  // 任务：关闭subprocess
  compiler.hooks.watchRun.tap("编译开始之前", () => {
    if (subprocess) {
      subprocess.cancel();
    }
  });
  // 触发时机：编译(compilation)完成。
  // 任务：启动subprocess
  compiler.hooks.done.tap("所有编译完成", () => {
    subprocess = execa("node", [devServerPath], {
      cleanup: true,
      env: { meseAppDir: outputPath, host, port },
      stdio: "inherit",
    });
    subprocess.stdout.pipe(process.stdout);
  });
});
