const ManifestPlugin = require("webpack-manifest-plugin");

module.exports = () => ({
  plugins: [new ManifestPlugin({ fileName: "manifest.json" })],
});
