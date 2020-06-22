#!/usr/bin/env node

const CliArgvChecker = require("../lib/CliArgvChecker");
const getWebpackConfig = require("../lib/getWebpackConfig");
const builder = require("../lib/builder");

CliArgvChecker.check(({ mode, meseConfigUrl, outputPath }) => {
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
});
