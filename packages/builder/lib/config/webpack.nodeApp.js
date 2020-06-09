/**
 * 这个配置用于构建出给node服务使用的js文件，格式为`[name].node.js`，
 * `ReactDOMServer.renderToStaticMarkup`方法会用到它。
 * 处理样式时，不会抽出样式。
 *
 * @Author: erye
 * @Date: 2020-06-02 18:40:35
 * @Last Modified by: erye
 * @Last Modified time: 2020-06-09 17:56:59
 */

const { resolve } = require("path");
const merge = require("webpack-merge");

const _common = require("./cell/webpack.common");
const _entryPages = require("./cell/webpack.entryPages");
const _jsx = require("./cell/webpack.jsx.js");
const _isomorphicStyle = require("./cell/webpack.isomorphicStyle");

module.exports = ({ mode, meseConfigUrl, outputPath }) => {
  return merge(
    _common(),
    _entryPages(meseConfigUrl),
    _jsx(),
    _isomorphicStyle(),
    {
      name: "NODE_APP",
      target: "node",
      mode,
      devtool: false,
      output: {
        path: resolve(outputPath, "nodeApp"),
        filename: "[name].node.js",
        chunkFilename: "[name].node.js",
        libraryTarget: "commonjs2",
      },
    }
  );
};
