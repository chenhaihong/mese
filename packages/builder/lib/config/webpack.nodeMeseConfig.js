/**
 * 这个配置用于构建出给node服务使用的mese配置文件，格式为`meseConfig.node.js`，
 * @mese/server中的多个类会使用到它，比如，获取pages、获取api等功能。
 *
 * @Author: erye
 * @Date: 2020-06-02 18:40:35
 * @Last Modified by: erye
 * @Last Modified time: 2020-06-08 18:16:09
 */

const merge = require("webpack-merge");

const _common = require("./cell/webpack.common");

module.exports = ({ mode, meseConfigUrl, outputPath }) => {
  return merge(_common(), {
    name: "NODE_MESE_CONFIG",
    target: "node",
    mode,
    devtool: false,
    entry: meseConfigUrl,
    output: {
      path: outputPath,
      filename: "mese.config.node.js",
      libraryTarget: "commonjs2",
    },
  });
};
