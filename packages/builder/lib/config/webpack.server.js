/**
 * 这个配置用于构建出`web server`的js文件，格式为`server.js`，
 * 通过`node server.js`或`pm2 start server.js`启动web服务的时候会用到它。
 *
 * @Author: erye
 * @Date: 2020-06-02 17:54:13
 * @Last Modified by: erye
 * @Last Modified time: 2020-06-19 13:57:09
 */

const merge = require("webpack-merge");

const _common = require("./cell/webpack.common");
const _entryServer = require("./cell/webpack.entryServer");

module.exports = ({ mode, meseConfigUrl, outputPath }) => {
  return merge(_common(), _entryServer(meseConfigUrl), {
    name: "SERVER",
    target: "node",
    mode,
    devtool: false,
    output: {
      path: outputPath,
      filename: "[name].js",
      libraryTarget: "commonjs2",
    },
  });
};
