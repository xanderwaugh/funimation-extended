const { merge } = require("webpack-merge");
const config = require("./webpack.config");
const ZipPlugin = require("zip-webpack-plugin");

module.exports = merge(config, {
  mode: "production",
  // ZIP
  plugins: [
    new ZipPlugin({
      filename: "build.zip",
      path: "../",
    }),
  ],
});
