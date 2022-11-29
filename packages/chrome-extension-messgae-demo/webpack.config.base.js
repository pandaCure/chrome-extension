/* eslint-disable max-params */
/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const loaderUtils = require('loader-utils');
const getLocalIdent = (context, localIdentName, localName, options) => {
  const fileNameOrFolder = context.resourcePath.match(/index\.module\.(css|scss|sass)$/) ? '[folder]' : '[name]';
  const hash = loaderUtils.getHashDigest(
    path.posix.relative(context.rootContext, context.resourcePath) + localName,
    'md5',
    'base64',
    5,
  );
  const className = loaderUtils.interpolateName(context, fileNameOrFolder + '_' + localName + '__' + hash, options);
  return className.replace('.module_', '_').replace(/\./g, '_');
};
const env = process.env.NODE_ENV;
const getWebpackBaseConfig = ({ isNoExtractCss }) => ({
  mode: env,
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
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.less'],
    alias: {
      '@option-src': path.resolve(__dirname, 'option-src'),
      '@option-components': path.resolve(__dirname, 'option-src/components'),
      '@popup-src': path.resolve(__dirname, 'popup-src'),
      '@popup-components': path.resolve(__dirname, 'popup-src/components'),
      '@theme-src': path.resolve(__dirname, 'theme-src'),
      '@theme-components': path.resolve(__dirname, 'theme-src/components'),
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
            include: [
              path.join(__dirname, 'option-src'),
              path.join(__dirname, 'popup-src'),
              path.join(__dirname, 'theme-src'),
              path.join(__dirname, 'chrome-runtime'),
            ],
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
              env === 'production' && !isNoExtractCss
                ? {
                    loader: MiniCssExtractPlugin.loader,
                  }
                : require.resolve('style-loader'),
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
                      'postcss-import',
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
              env === 'production' && !isNoExtractCss
                ? {
                    loader: MiniCssExtractPlugin.loader,
                  }
                : require.resolve('style-loader'),
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
                  // root: [
                  //   path.join(__dirname, 'option-src'),
                  //   path.join(__dirname, 'popup-src'),
                  //   path.join(__dirname, 'theme-src'),
                  // ],
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
          {
            test: /\.module\.less$/,
            use: [
              env === 'development' && require.resolve('style-loader'),
              env === 'production' && !isNoExtractCss
                ? {
                    loader: MiniCssExtractPlugin.loader,
                  }
                : require.resolve('style-loader'),
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 3,
                  sourceMap: true,
                  modules: {
                    mode: 'icss', // tailwind css local mode 有问题
                    getLocalIdent,
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
                  // root: [
                  //   path.join(__dirname, 'option-src'),
                  //   path.join(__dirname, 'popup-src'),
                  //   path.join(__dirname, 'theme-src'),
                  // ],
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
    env === 'development' &&
      new ReactRefreshWebpackPlugin({
        overlay: false,
      }),
    env === 'production' &&
      !isNoExtractCss &&
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css',
        chunkFilename: 'css/[name].[contenthash:8].chunk.css',
      }),
    new CopyPlugin({
      patterns: [{ from: path.resolve(__dirname, 'public'), to: path.resolve(__dirname, 'chrome-extension') }],
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
});
module.exports = {
  getWebpackBaseConfig,
};
