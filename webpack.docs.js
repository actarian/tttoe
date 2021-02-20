const path = require('path');

const config = {
  environment: {
    MODE: 'production',
    APP_ID: '86c20074dd75415eaa828236b52c5416',
    CHANNEL_ID: 'channelId',
  },
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'docs/tttoe-r3f'),
    publicPath: '/tttoe/tttoe-r3f/',
    filename: '[name].[contenthash].js',
  },
  html: {
    template: './src/index.html',
    filename: 'index.html',
    title: 'TTToe',
    description: 'TTToe',
    image: 'https://avatars.githubusercontent.com/u/1841442?s=460&u=9d963e264cc39206782c9e0dbfdbdb0c6d25b477&v=4',
    url: 'https://actarian.github.io/tttoe/tttoe-r3f',
  },
  performance: {
    hints: 'warning', // enum
    maxAssetSize: 300000, // int (in bytes),
    maxEntrypointSize: 300000, // int (in bytes)
    assetFilter: function(assetFilename) {
      // Function predicate that provides asset filenames
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
    }
  },
  openAnalyzer: true,
};

module.exports = config;
