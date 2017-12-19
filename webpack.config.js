const { resolve } = require('path');

module.exports = env => {
  return {
    devtool: 'source-map',
    entry: './client/public/react.jsx',
    output: {
      filename: 'bundle.js',
      path: resolve(__dirname, 'client/public/js')
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json']
    },
    stats: {
      colors: true,
      reasons: true,
      chunks: true
    },
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
            presets: ['env', 'react']
          }
        }
      ]
    }
  };
};
