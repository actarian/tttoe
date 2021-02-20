const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const config = {
  mode: 'development',
  target: 'web', // enum
  entry: path.resolve(__dirname, './src/index.tsx'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
    filename: '[name].[contenthash].js',
    pathinfo: true,
  },
  module: {
    rules: [
      {
        test: /\.worker\.(js|ts|tsx)$/,
        use: {
          loader: "worker-loader",
          options: {
            filename: "[name].[contenthash].worker.js",
            publicPath: '/workers/'
          },
        },
      },
      {
        test: /\.(ts|tsx)$/,
        enforce: 'pre',
        use: ['ts-loader', 'source-map-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          // { loader: 'css-modules-typescript-loader'},  // to generate a .d.ts module next to the .scss file (also requires a declaration.d.ts with 'declare modules '*.scss';' in it to tell TypeScript that 'import styles from './styles.scss';' means to load the module './styles.scss.d.td')
          {
            loader: 'css-loader',
            /*
            options: {
              importLoaders: 1,
              modules: true
            }
            */
          },
          {
            loader: 'sass-loader',
          }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|ttf|woff|woff2|glb|gltf)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[contenthash].[ext]',
              outputPath: 'assets',
              esModule: false // <- here
            }
          },
        ],
      },
    ]
  },
  resolve: {
    extensions: [
      '.tsx',
      '.ts',
      '.js',
      '.css',
      '.scss',
    ],
  },
  devtool: false,
  devServer: {
    compress: true,
    contentBase: [path.join(__dirname, 'assets')],
    contentBasePublicPath: ['/'],
    historyApiFallback: true,
    host: '0.0.0.0',
    hot: true,
    https: false,
    noInfo: false,
    open: true,
    openPage: '',
    overlay: true,
    port: 9000,
    // proxy: { '/api': 'http://localhost:3000' },
    publicPath: '/',
    useLocalIp: true,
    writeToDisk: false,
  },
  /*
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
  */
};

function setPlugins(config) {
  let environment = {};
  if (config.environment) {
    environment = config.environment;
    /*
    Object.keys(config.environment).forEach(key => {
      environment[key] = config.environment[key];
    });
    */
    delete config.environment;
  }
  let openAnalyzer = false;
  if (config.openAnalyzer) {
    openAnalyzer = true;
    delete config.openAnalyzer;
  }
  let html = {
    template: './src/index.html',
    filename: 'index.html',
    title: 'Webpack',
    description: 'Webpack',
    /*
    'meta': {
      'viewport': 'width=device-width, initial-scale=1.0',
      'charset': 'UTF-8'
    }
    */
  };
  if (config.html) {
    html = Object.assign(html, config.html);
    delete config.html;
  }
  config.plugins = [
    new CleanWebpackPlugin(),
    new webpack.EnvironmentPlugin(environment),
    new CopyPlugin({
      patterns: [
        { from: 'assets', to: 'assets' },
      ],
    }),
    /*
    new CopyPlugin({
      patterns: [{ from: 'src/index.html' }],
    }),
    */
    new HtmlWebpackPlugin(html),
    new webpack.SourceMapDevToolPlugin({
      filename: `[name].[contenthash].[ext].map`
    }),
    new webpack.ProgressPlugin({ percentBy: 'entries' }),
    new MiniCssExtractPlugin({
      filename: `[name].[contenthash].css`,
    }),
  ];
  if (config.analyzer) {
    delete config.analyzer;
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: openAnalyzer,
      })
    );
  }
  return config;
}

module.exports = (env, options) => {
  const keys = ['development', 'production', 'docs'];
  const mode = keys.reduce((p, c) => {
    return env[c] ? c : p;
  }, keys[0]);
  const configPath = `./webpack.${mode}.js`;
  console.log(`Webpack ${mode} - ${configPath}`);
  let currentConfig;
  if (mode && fs.existsSync(path.resolve(__dirname, configPath))) {
    currentConfig = mergeConfig(config, require(configPath));
  }
  currentConfig = setPlugins(config);
  return currentConfig;
  /*
  switch (mode) {
    case 'development':
      return mergeConfig(config, require('./webpack.development'));
    case 'production':
      return mergeConfig(config, require('./webpack.production'));
    case 'docs':
      return mergeConfig(config, require('./webpack.docs'));
    default:
      return config;
  }
  */
}

function mergeConfig(target, source) {
  if (typeof source === 'object') {
    Object.keys(source).forEach(key => {
      const value = source[key];
      if (typeof value === 'object' && !Array.isArray(value)) {
        target[key] = target[key] || {};
        target[key] = mergeConfig(target[key], value);
      } else {
        target[key] = value;
      }
    });
  }
  return target;
}
