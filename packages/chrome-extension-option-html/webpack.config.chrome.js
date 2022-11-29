/* eslint-disable @typescript-eslint/no-require-imports */
const { getWebpackBaseConfig } = require('./webpack.config.base');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const env = process.env.NODE_ENV;
const config = getWebpackBaseConfig({ isNoExtractCss: true });
module.exports = {
  mode: env,
  entry: {
    background: './chrome-runtime/background/background.ts',
    content: './chrome-runtime/content/content.ts',
    devtools: './chrome-runtime/devtools/devtools.ts',
  },
  output: {
    path: path.join(__dirname, 'chrome-extension'),
    filename: '[name].js',
    chunkFilename: 'js/[name].[contenthash:8].chunk.js',
    publicPath: '/',
  },
  ...config,
  plugins: [
    env ==='development' && new HtmlWebpackPlugin({
      inject: true,
      filename: `content.html`,
      chunks: ['content'],
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, `devtools.html`),
      filename: `devtools.html`,
      chunks: ['devtools'],
    }),
    ...config.plugins,
  ].filter(Boolean),
};
