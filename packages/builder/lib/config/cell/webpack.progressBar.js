const WebpackBar = require("webpackbar");

module.exports = ({ name = "webpack", profile = false }) => {
  return {
    plugins: [new WebpackBar({ name, profile })],
  };
};
