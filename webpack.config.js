const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: [
    'babel-polyfill',
    path.resolve('source/js', 'index.js')
  ],
  output: {
    path: path.resolve('public/assets/js'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: path.resolve('node_modules'),
        loader: 'babel-loader',
        options: {
          presets: [
            ['env', {
              'targets': {
                'node': 'current',             // 動かしてるPCのNodeバージョン
                'browsers': 'last 2 versions'　// 各種ブラウザの直近2バージョン
              }
            }]
          ]
        }
      }
    ]
  }
}