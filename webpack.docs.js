const path = require('path');

const config = {
  environment: {
    MODE: 'production',
    APP_ID: '86c20074dd75415eaa828236b52c5416',
    CHANNEL_ID: 'channelId',
  },
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'docs/tttoe-ai'),
    publicPath: '/tttoe/tttoe-ai',
    filename: '[name].[contenthash].js',
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
