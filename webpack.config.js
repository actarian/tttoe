const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const config = {
  mode: 'development',
  entry: path.resolve(__dirname, './src/index.tsx'),
  output: {
    path: path.resolve(__dirname, 'docs'),
    publicPath: '/tttoe/',
    filename: '[name].[contenthash].js',
  },
  target: 'web', // enum
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
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
        test: /\.(png|jpg|jpeg|gif|svg|ttf|woff|woff2)$/i,
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
    ]
  },
  devServer: {
    port: 9000,
    contentBase: path.join(__dirname, 'docs'),
    open: true,
    // proxy: { '/api': 'http://localhost:3000' },
    // proxy URLs to backend development server
    contentBase: path.join(__dirname, 'public'), // boolean | string | array, static file location
    compress: true, // enable gzip compression
    historyApiFallback: true, // true for index.html upon 404, object for multiple paths
    hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
    https: false, // true for self-signed, object for cert authority
    noInfo: true, // only errors & warns on hot reload
    // ...
  },
  plugins: [
    new CleanWebpackPlugin(),
    /*
    new CopyPlugin({
      patterns: [
        { from: 'src/assets', to: 'docs/assets' },
      ],
    }),
    */
    /*
    new CopyPlugin({
      patterns: [{ from: 'src/index.html' }],
    }),
    */
    new HtmlWebpackPlugin({
      title: 'TTToe',
      template: './src/index.html',
      filename: 'index.html',
      /*
      'meta': {
        'viewport': 'width=device-width, initial-scale=1.0',
        'charset': 'UTF-8'
      }
      */
    }),
    new webpack.ProgressPlugin({ percentBy: 'entries' }),
    new MiniCssExtractPlugin({
      filename: `[name].[contenthash].css`,
    }),
    /*
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
    })
    */
  ],
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

module.exports = config;
