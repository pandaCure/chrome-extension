/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const env = process.env.NODE_ENV;
const { getWebpackBaseConfig } = require('./webpack.config.base');
const config = getWebpackBaseConfig({isNoExtractCss: false})
module.exports = {
  mode: env,

  entry: {
    options: './option-src/index.tsx',
    popup: './popup-src/index.tsx',
    theme: './theme-src/index.tsx',
    'devtools-panel': './devtools-src/index.tsx',
    'sidebar': './sidebar-src/index.tsx',
  },
  output: {
    path: path.join(__dirname, 'chrome-extension'),
    filename: 'js/[name].[contenthash:8].js',
    chunkFilename: 'js/[name].[contenthash:8].chunk.js',
    publicPath: '/',
  },
  ...config,
  // 插件
  plugins: [
    ...['options', 'popup', 'theme', 'devtools-panel', 'sidebar'].map(
      (v) =>
        new HtmlWebpackPlugin({
          inject: true,
          template: path.resolve(__dirname, `${v}.html`),
          filename: `${v}.html`,
          chunks: [v],
          ...(env === 'production'
            ? {
                minify: {
                  removeComments: true,
                  collapseWhitespace: true,
                  removeRedundantAttributes: true,
                  useShortDoctype: true,
                  removeEmptyAttributes: true,
                  removeStyleLinkTypeAttributes: true,
                  keepClosingSlash: true,
                  minifyJS: true,
                  minifyCSS: true,
                  minifyURLs: true,
                },
              }
            : undefined),
        }),
    ),
    ...config.plugins
    // TODO eslint plugin & TypeScript type check
  ].filter(Boolean),
  // 其他配置
  // target: ['browserslist'],
  // stats: 'errors-warnings',
  // bail: true,
  // devtool: 'source-map',
  // performance: false,
  // infrastructureLogging: {
  //   level: 'none',
  // },
  // dev
  // devServer: {
  //   port: 9000,
  // }
};
