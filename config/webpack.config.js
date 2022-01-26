/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
/** @type {import('webpack').options} */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");

const rootDir = path.join(__dirname, "../src");

const options = {
  entry: {
    "js/popup": path.join(rootDir, "index.tsx"),
    "js/content": path.join(rootDir, "scripts", "content.ts"),
    // "js/options": pages_dir("Options"),
    // "js/sw": path.join(rootDir, "scripts", "sw.ts"),
  },
  output: {
    path: path.resolve(__dirname, "../build"),
    filename: "[name].js",
    assetModuleFilename: "assets/fonts/[hash][ext][query]", // fonts
    clean: true,
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        // ? TS / TSX
        test: /\.(js|jsx|ts|tsx)$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
        exclude: /node_modules/,
      },
      {
        // ? CSS
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        // ? Fonts
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new ProgressBarPlugin(),
    // * HTML Index Template
    new HtmlWebpackPlugin({
      template: path.join(rootDir, "index.html"),
      chunks: ["popup"],
      filename: "popup.html",
      cache: false,
    }),
    // * Public Assets
    new CopyPlugin({
      patterns: [
        { from: "public/manifest.json" },
        {
          from: "public",
          to: "assets",
          globOptions: {
            ignore: ["**/manifest.json"],
          },
        },
      ],
    }),
    // * Extract CSS Separately
    new MiniCssExtractPlugin({
      filename: "assets/styles/[name].css",
    }),
  ],
  stats: { warnings: false },
};
module.exports = options;
