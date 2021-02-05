const path = require('path');

const config = {
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: '[name].[contenthash].js',
  },
};

module.exports = config;
