#!/usr/bin/env node

const chalk = require("chalk");
const ora = require("ora");

const Server = require("@mese/Server");

const builder = require("../lib/builder");
const CliArgvChecker = require("../lib/CliArgvChecker");
const getWebpackConfig = require("../lib/getWebpackConfig");

CliArgvChecker.check(({ mode, meseConfigUrl, outputPath, host, port }) => {
  let server = null;

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
  // 等待构建完成，启动或重启web服务
  compiler.hooks.done.tap("所有编译完成", async () => {
    if (server) {
      server.close(async () => {
        server = await startServer([outputPath, host, port]);
      });
    } else {
      server = await startServer([outputPath, host, port]);
    }
  });
});

function startServer(options) {
  if (startServer.id) clearTimeout(startServer.id);

  return new Promise((resolve) => {
    startServer.id = setTimeout(() => {
      const spinner = ora("Starting server...").start();
      const [meseAppDir, host, port] = options;
      const server = new Server({
        meseAppDir,
        host,
        port,
        success: (port) => {
          resolve(server);
          spinner.stop();

          const arr = [
            chalk.bgGreenBright.black(" Mese "),
            "Listening on",
            chalk.greenBright.underline(`http://${host}:${port}`),
          ];
          console.log("\n", ...arr, "\n");
        },
        fail: (e, port) => {
          resolve(null);
          spinner.stop();

          Server.startUpUnsuccessfully(e, port);
        },
      });
    }, 500);
  });
}
startServer.id = null;
