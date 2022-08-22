import { CleanWebpackPlugin } from "clean-webpack-plugin";
import { Configuration } from "webpack";
import * as path from "path";
import * as Server from "webpack-dev-server";
import HtmlWebpackPlugin = require("html-webpack-plugin");

const config: Configuration = {
  mode: "development",
  devtool: "inline-source-map",

  entry: path.join(__dirname, "/example/app.tsx"),
  output: {
    filename: "bundle.js",
    path: path.resolve("./dist"),
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ["./dist"],
    }),
    new HtmlWebpackPlugin({
      template: "./index.html",
      inject: "body",
    }),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx", ".json"],
  },
  stats: "errors-only",

  devServer: {
    open: false,
    proxy: {},
    liveReload: true,
    compress: false,
    host: "localhost",
    port: 8013,
  } as Server.Configuration,
};
export default config;
