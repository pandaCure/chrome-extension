/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const env = process.env.NODE_ENV;
module.exports = {
  mode: env,

  entry: './src/index.tsx',
  output: {
    path: path.join(__dirname, 'chorme-extension'),
    filename: 'js/[name].[contenthash:8].js',
    chunkFilename: 'js/[name].[contenthash:8].chunk.js',
    publicPath: '/',
  },
  // 缓存
  cache: {
    type: 'filesystem',
    version: '1234567890',
    cacheDirectory: path.join(__dirname, 'node_modules/.cache'),
    store: 'pack',
    buildDependencies: {
      defaultWebpack: ['webpack/lib/'],
      config: [__filename],
      tsconfig: [path.join(__dirname, 'tsconfig.json')],
    },
  },
  // 线上压缩
  optimization: {
    minimize: true,
    minimizer: [
      // TODO esbuild
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          keep_classnames: true,
          keep_fnames: true,
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
      }),
      new CssMinimizerPlugin(),
    ],
  },
  //
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@src': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
    },
  },
  //
  module: {
    strictExportPresence: true,
    rules: [
      // node_modules source-map
      {
        enforce: 'pre',
        exclude: /@babel(?:\/|\\{1,2})runtime/,
        test: /\.(js|mjs|jsx|ts|tsx|css)$/,
        loader: require.resolve('source-map-loader'),
      },
      {
        oneOf: [
          // 命中就结束
          // tsx, jsx ,ts , tsx swc-loader
          {
            // 不处理src以外js swc-loader 最佳实践
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            include: path.join(__dirname, 'src'),
            loader: require.resolve('swc-loader'),
            options: {
              module: {
                type: 'es6',
                ignoreDynamic: true,
              },
              jsc: {
                parser: {
                  syntax: 'typescript',
                  // tsx: false,
                  dynamicImport: true,
                },
                target: 'es2015',
                transform: {
                  react: {
                    runtime: 'automatic',
                    pragma: 'React.createElement',
                    pragmaFrag: 'React.Fragment',
                    throwIfNamespace: true,
                    development: false,
                    useBuiltins: true,
                  },
                },
              },
              sourceMaps: true,
            },
          },
          {
            // 只处理css less 不处理module
            test: /\.css$/,
            exclude: /\.module\.css$/,
            use: [
              env === 'development' && require.resolve('style-loader'),
              env === 'production' && {
                loader: MiniCssExtractPlugin.loader,
              },
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 1,
                  sourceMap: true,
                  modules: {
                    mode: 'icss',
                  },
                },
              },
              {
                loader: require.resolve('postcss-loader'),
                options: {
                  postcssOptions: {
                    ident: 'postcss',
                    config: false,
                    plugins: [
                      'tailwindcss',
                      'postcss-flexbugs-fixes',
                      [
                        'postcss-preset-env',
                        {
                          autoprefixer: {
                            flexbox: 'no-2009',
                          },
                          stage: 3,
                        },
                      ],
                    ],
                  },
                  sourceMap: true,
                },
              },
            ].filter(Boolean),
            sideEffects: true,
          },
          {
            test: /\.less$/,
            exclude: /\.module\.less$/,
            use: [
              env === 'development' && require.resolve('style-loader'),
              env === 'production' && {
                loader: MiniCssExtractPlugin.loader,
              },
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 3,
                  sourceMap: true,
                  modules: {
                    mode: 'icss',
                  },
                },
              },
              {
                loader: require.resolve('postcss-loader'),
                options: {
                  postcssOptions: {
                    ident: 'postcss',
                    config: false,
                    plugins: [
                      'tailwindcss',
                      'postcss-flexbugs-fixes',
                      [
                        'postcss-preset-env',
                        {
                          autoprefixer: {
                            flexbox: 'no-2009',
                          },
                          stage: 3,
                        },
                      ],
                    ],
                  },
                  sourceMap: true,
                },
              },
              {
                loader: require.resolve('resolve-url-loader'),
                options: {
                  sourceMap: true,
                  root: path.join(__dirname, 'src'),
                },
              },
              {
                loader: require.resolve('less-loader'),
                options: {
                  sourceMap: true,
                },
              },
            ].filter(Boolean),
            sideEffects: true,
          },
        ],
      },
    ],
  },
  // 插件
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, 'options.html'),
      filename: "options.html",
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
    env === 'development' &&
      new ReactRefreshWebpackPlugin({
        overlay: false,
      }),
    env === 'production' &&
      new MiniCssExtractPlugin({
        filename: 'static/css/[name].[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
      }),
    new CopyPlugin({
      patterns: [{ from: path.resolve(__dirname, 'public'), to: path.resolve(__dirname, 'chorme-extension') }],
    }),
    // TODO eslint plugin & TypeScript type check
  ].filter(Boolean),
  // 其他配置
  target: ['browserslist'],
  stats: 'errors-warnings',
  bail: true,
  devtool: 'source-map',
  performance: false,
  infrastructureLogging: {
    level: 'none',
  },
  // dev
  // devServer: {
  //   port: 9000,
  // }
};
