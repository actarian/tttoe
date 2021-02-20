const path = require('path');

const config = {
  environment: {
    MODE: 'development',
    APP_ID: '86c20074dd75415eaa828236b52c5416',
    CHANNEL_ID: 'channelId',
  },
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/tttoe/tttoe-ai/',
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
  devServer: {
    compress: true,
    contentBase: [path.join(__dirname, 'assets')],
    contentBasePublicPath: ['/tttoe/tttoe-ai/'],
    historyApiFallback: true,
    host: '0.0.0.0',
    hot: true,
    https: false,
    noInfo: false,
    open: true,
    openPage: 'tttoe/tttoe-ai',
    overlay: true,
    port: 9000,
    // proxy: { '/api': 'http://localhost:3000' },
    publicPath: '/tttoe/tttoe-ai/',
    useLocalIp: true,
    writeToDisk: true,
  },
};

module.exports = config;
