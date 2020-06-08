/**
 * 这个配置用于构建出`[mese.config.js].api`里的js文件，格式为`api/[name].js`，
 *
 * @Author: erye
 * @Date: 2020-06-02 17:54:13
 * @Last Modified by: erye
 * @Last Modified time: 2020-06-09 00:52:41
 */

const { resolve } = require("path");
const merge = require("webpack-merge");

const _common = require("./cell/webpack.common");
const _entryApi = require("./cell/webpack.entryApi");

module.exports = ({ mode, meseConfigUrl, outputPath }) => {
  return merge(_common(), _entryApi(meseConfigUrl), {
    name: "API",
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
