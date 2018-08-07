import webpack from 'webpack'

module.exports = {
  mode: 'development',
  entry: ['@babel/polyfill', path.resolve('./source/js')],
  output: {
    path: path.resolve('public/assets/js'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: path.resolve('node_modules'),
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                'modules': false
              },
              {
                targets: {
                  node: 'current', // 動かしてるPCのNodeバージョン
                  browsers: 'last 2 versions', // 各種ブラウザの直近2バージョン
                },
              },
            ],
          ],
        },
      },
    ],
  },
};
