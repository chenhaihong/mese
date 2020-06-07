const { resolve } = require("path");

const dirRoot = resolve(__dirname, "../../../");

module.exports = () => {
  return {
    target: "web",
    mode: "production",
    watch: false,
    devtool: false,
    resolve: {
      extensions: [
        ".js",
        ".json",
        ".jsx",
        ".css",
        ".less",
        ".m.css",
        ".m.less",
        "*",
      ],
      // 模块的解析路径：从以下两个位置读取
      modules: ["node_modules", resolve(dirRoot, "node_modules")],
    },
    resolveLoader: {
      // loader的解析路径：从以下两个位置读取
      modules: [resolve(dirRoot, "node_modules"), "node_modules"],
    },
    stats: {
      // copied from `'minimal'`
      // all: false,
      modules: true,
      maxModules: 0,
      errors: true,
      warnings: true,
      // our additional options
      entrypoints: true,
      children: false,
      moduleTrace: true,
      errorDetails: true,
    },
  };
};
