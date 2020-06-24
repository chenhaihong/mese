/**
 * 这个配置用于构建出`[mese.config.js].api`里的js文件，格式为`[pascalCaseCase(routePath)].js`，
 *
 * @Author: erye
 * @Date: 2020-06-02 17:54:13
 * @Last Modified by: erye
 * @Last Modified time: 2020-06-24 16:32:59
 */

const { resolve } = require("path");
const merge = require("webpack-merge");

const _common = require("./cell/webpack.common");
const _progressBar = require("./cell/webpack.progressBar");
const _entryApi = require("./cell/webpack.entryApi");

module.exports = ({ mode, meseConfigUrl, outputPath }) => {
  const name = "API";
  return merge(_common(), _progressBar({ name }), _entryApi(meseConfigUrl), {
    name,
    target: "node",
    mode,
    devtool: false,
    output: {
      path: resolve(outputPath, "api"),
      filename: "[name].js",
      libraryTarget: "commonjs2",
    },
  });
};
