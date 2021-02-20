const path = require('path');

const config = {
  environment: {
    MODE: 'production',
    APP_ID: '86c20074dd75415eaa828236b52c5416',
    CHANNEL_ID: 'channelId',
  },
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
    filename: '[name].[contenthash].js',
  },
  html: {
    template: './src/index.html',
    filename: 'index.html',
    title: 'TTToe',
    description: 'TTToe',
    image: 'https://avatars.githubusercontent.com/u/1841442?s=460&u=9d963e264cc39206782c9e0dbfdbdb0c6d25b477&v=4',
    url: 'https://actarian.github.io/tttoe/tttoe-ai',
    /*
    'meta': {
      'viewport': 'width=device-width, initial-scale=1.0',
      'charset': 'UTF-8'
    }
    */
  },
  performance: {
    hints: 'warning', // enum
    maxAssetSize: 200000, // int (in bytes),
    maxEntrypointSize: 400000, // int (in bytes)
    assetFilter: function(assetFilename) {
      // Function predicate that provides asset filenames
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
    }
  },
};

module.exports = config;
