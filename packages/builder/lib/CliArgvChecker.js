const path = require("path");
const fse = require("fs-extra");
const minimist = require("minimist");

// 解析命令行参数
module.exports = class CliArgvChecker {
  static _parse() {
    // 1 读取用户的输入值
    let {
      // mese-build mese-watch mese-dev-server 共同需要
      mode = "production",
      meseConfigUrl = "mese.config.js",
      outputPath = "dist",

      // mese-dev-server 单独需要
      host = "127.0.0.1",
      port = 3000,
    } = minimist(process.argv.slice(2));

    // 2 规范化参数
    if (!["production", "development"].includes(mode)) {
      mode = "production";
    }
    meseConfigUrl = path.join(process.cwd(), meseConfigUrl);
    outputPath = path.join(process.cwd(), outputPath);

    // 3 返回结果
    return { mode, meseConfigUrl, outputPath, host, port };
  }

  static check(callback) {
    const inputs = CliArgvChecker._parse();
    const { meseConfigUrl } = inputs;
    if (!fse.pathExistsSync(meseConfigUrl)) {
      console.log("[MESE] meseConfigUrl not found.");
      return;
    }

    callback && callback(inputs);
  }
};
