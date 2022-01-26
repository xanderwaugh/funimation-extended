/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
/** @type {import('webpack').options} */
const { merge } = require("webpack-merge");
const config = require("./webpack.config");

const options = merge(config, {
  mode: "development",
  devtool: "inline-source-map",
});

module.exports = options;
