/**
 * 这个配置用于构建出给web浏览器使用的文件，格式为`[name].[hash:6].js`、`[name].[hash:6].css`，
 * `ReactDOM.hydrate`方法会用到它。
 * 同时会抽出样式文件，格式为`[name].[hash:6].css`。
 *
 * @Author: erye
 * @Date: 2020-06-02 17:54:13
 * @Last Modified by: erye
 * @Last Modified time: 2020-06-25 22:12:14
 */
const { resolve } = require("path");
const merge = require("webpack-merge");

const _common = require("./cell/webpack.common");
const _progressBar = require("./cell/webpack.progressBar");
const _clean = require("./cell/webpack.clean");
const _entryPages = require("./cell/webpack.entryPages");
const _jsx = require("./cell/webpack.jsx.js");
const _optimizeStyle = require("./cell/webpack.optimizeStyle");
const _manifest = require("./cell/webpack.manifest");
const _optimization = require("./cell/webpack.optimization");

module.exports = ({ mode, meseConfigUrl, outputPath }) => {
  const [isProd, name] = [mode === "production", "BROWSER_PAGE"];

  return merge(
    _common(),
    _progressBar({ name }),
    _clean(),
    _entryPages(meseConfigUrl),
    _jsx(),
    _optimizeStyle(isProd),
    _manifest(),
    _optimization(),
    {
      name,
      target: "web",
      mode,
      devtool: isProd ? false : "source-map",
      output: {
        path: resolve(outputPath, "browserPage"),
        filename: "[name].[hash:6].js",
        chunkFilename: "[name].[hash:6].js",
        library: "Mese[name]",
        libraryTarget: "umd",
      },
    }
  );
};
