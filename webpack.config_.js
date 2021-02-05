const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

let config = {
  mode: 'development',
  entry: path.resolve(__dirname, './src/index.js'),
  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: '[name].[contenthash].js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          // 'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  /*
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: (module) => {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName.replace('@', '')}`;
          },
        },
      },
    },
    // chunkIds: "size",
    // method of generating ids for chunks
    // moduleIds: "size",
    // method of generating ids for modules
    // mangleExports: "size",
    // rename export names to shorter names
    // minimize: true,
    // minimize the output files
    // minimizer: [new CssMinimizer(), "..."],
    // minimizers to use for the output files
    // Advanced
    // concatenateModules: true,
    // concatenate multiple modules into a single one
    // emitOnErrors: true,
    // emit output files even if there are build errors
    // flagIncludedChunks: true,
    // avoid downloading a chunk if it's fully contained in
    // an already loaded chunk
    // innerGraph: true,
    // determine references without modules between symbols
    // mergeDuplicateChunks: true,
    // merge chunks if they are equal
    // nodeEnv: "production",
    // value of process.env.NODE_ENV inside of modules
    // portableRecords: true,
    // use relative paths in records
    // providedExports: true,
    // determine which exports are exposed by modules
    // usedExports: true,
    // determine which exports are used by modules and
    // remove the unused ones
    // realContentHash: true,
    // caculcate a contenthash for assets based on the content
    // removeAvailableModules: true,
    // run extra pass to determine modules that are already in
    // parent chunks and remove them
    // removeEmptyChunks: true,
    // remove chunks that are empty
    // runtimeChunk: "single",
    // change placement of runtime code
    // sideEffects: true,
    // skip modules that are side effect free when using reexports
  },
  */
  target: 'web', // enum
  // the environment in which the bundle should run
  // changes chunk loading behavior, available external modules
  // and generated code style
  // externals: ['react', /^@angular/],
  // Don't follow/bundle these modules, but request them at runtime from the environment
  // externalsType: 'var', // (defaults to output.library.type)
  // Type of externals, when not specified inline in externals
  // externalsPresets: { /* ... */ },
  // presets of externals
  experiments: {
    // asyncWebAssembly: true,
    // WebAssembly as async module (Proposal)
    // syncWebAssembly: true,
    // WebAssembly as sync module (deprecated)
    // outputModule: true,
    // Allow to output ESM
    // topLevelAwait: true,
    // Allow to use await on module evaluation (Proposal)
  },
  devServer: {
    contentBase: path.join(__dirname, 'docs'),
    port: 9000,
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
    new HtmlWebpackPlugin({
      title: 'RxComp Test',
      template: './src/index.html',
      filename: './index.html',
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
    // new BundleAnalyzerPlugin()
  ],
};

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

module.exports = (env, options) => {
  const mode = options.mode || 'development';
  console.log(`Webpack mode ${mode}`);
  config.mode = mode;
  switch (mode) {
    case 'development':
      return mergeConfig(config, require('./webpack.development'));
    case 'production':
      return mergeConfig(config, require('./webpack.production'));
    default:
      return config;
  }
}
