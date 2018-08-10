import path from 'path';

module.exports = {
  mode: 'development',
  entry: ['@babel/polyfill', path.resolve(__dirname, 'source/js/main')],
  output: {
    path: path.resolve(__dirname, 'public/assets/js'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },
  module: {
    rules: [{
        test: /\.(tsx?)|(js)$/,
        exclude: path.resolve('node_modules'),
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env',
              {
                targets: {
                  node: 'current',
                  browsers: 'last 2 versions',
                },
              },
            ],
          ],
        },
      },
    ],
  },
};
