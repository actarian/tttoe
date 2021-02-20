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
  devServer: {
    contentBase: [path.join(__dirname, 'assets')],
    contentBasePublicPath: ['/tttoe/tttoe-r3f/'],
    host: '0.0.0.0',
    openPage: 'tttoe/tttoe-r3f',
    port: 9000,
    publicPath: '/tttoe/tttoe-r3f/',
  },
};

module.exports = config;
