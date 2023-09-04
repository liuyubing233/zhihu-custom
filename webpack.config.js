const path = require('path');

const MyFormatter = require('./configs/plugin-formatter');

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, '/src/index.js'),
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname),
  },
  module: {
    rules: [
      {
        test: /web-resources.js$/,
        use: [
          {
            loader: './configs/loader-web-resources.js',
          },
        ],
      },
    ],
  },
  // plugins: [new MyFormatter()],
  optimization: {
    minimize: false,
  },
};
