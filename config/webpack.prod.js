/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
/** @type {import('webpack').options} */
const ZipPlugin = require("zip-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { merge } = require("webpack-merge");
const config = require("./webpack.config");

const options = merge(config, {
  mode: "production",
  plugins: [
    new ZipPlugin({
      filename: "build.zip",
      path: "../",
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
});

module.exports = options;
