const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
    entry: {
        index: ["./src/index.tsx"],
        "scripts/content": "./src/scripts/content.ts",
        serviceWorker: "./src/scripts/serviceWorker.ts",
        utils: "./src/utils.ts",
    },
    output: {
        path: path.resolve(__dirname, "../build"),
        filename: "[name].js",
        clean: true,
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                    },
                },
            },
            {
                test: /\.css$/,
                use: [
                    { loader: "style-loader" },
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            localsConvention: "camelCase",
                            sourceMap: true,
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        // * Loading Bar
        new ProgressBarPlugin(),
        // * Clean Old Builds
        new CleanWebpackPlugin(),
        // * HTML Template
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            favicon: "./public/favicon.ico",
            filename: "index.html",
        }),
        // * Public Assets
        new CopyPlugin({
            patterns: [{ from: "public" }],
        }),
    ],
    devServer: {
        client: {
            progress: true,
        },
    },
};
