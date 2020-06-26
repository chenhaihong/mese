/**
 * 这个配置用于构建出`[mese.config.js].api`里的js文件，格式为`[pascalCaseCase(route)].js`，
 *
 * @Author: erye
 * @Date: 2020-06-02 17:54:13
 * @Last Modified by: erye
 * @Last Modified time: 2020-06-26 15:21:25
 */

const { resolve } = require("path");
const merge = require("webpack-merge");

const _common = require("./cell/webpack.common");
const _progressBar = require("./cell/webpack.progressBar");
const _clean = require("./cell/webpack.clean");
const _entryApi = require("./cell/webpack.entryApi");
const _manifest = require("./cell/webpack.manifest");
const _nodeExternals = require("./cell/webpack.nodeExternals");

module.exports = ({ mode, meseConfigUrl, outputPath }) => {
  const name = "NODE_API";
  return merge(
    _common(),
    _progressBar({ name }),
    _clean(),
    _entryApi(meseConfigUrl),
    _manifest(),
    _nodeExternals(),
    {
      name,
      target: "node",
      mode,
      devtool: false,
      output: {
        path: resolve(outputPath, "nodeApi"),
        filename: "[name].js",
        libraryTarget: "commonjs2",
      },
    }
  );
};
