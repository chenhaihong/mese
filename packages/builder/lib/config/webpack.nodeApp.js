/**
 * 这个配置用于构建出给node服务使用的js文件，格式为`[name].node.js`，
 * `ReactDOMServer.renderToStaticMarkup`方法会用到它。
 * 处理样式时，不会抽出样式。
 *
 * @Author: erye
 * @Date: 2020-06-02 18:40:35
 * @Last Modified by: erye
 * @Last Modified time: 2020-06-07 22:34:34
 */

const merge = require("webpack-merge");

const _common = require("./cell/webpack.common");
const _entry = require("./cell/webpack.entry");
const _jsx = require("./cell/webpack.jsx.js");
const _isomorphicStyle = require("./cell/webpack.isomorphic.style");

module.exports = ({ mode, meseConfigUrl, outputPath }) => {
  return merge(_common(), _entry(meseConfigUrl), _jsx(), _isomorphicStyle(), {
    name: "APP_NODE",
    target: "node",
    mode,
    devtool: false,
    output: {
      path: outputPath,
      filename: "[name].node.js",
      chunkFilename: "[name].node.js",
      libraryTarget: "umd",
    },
  });
};
