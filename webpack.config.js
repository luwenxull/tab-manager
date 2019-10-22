const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    options: './src/options.jsx',
  },
  // devtool: 'inline-source-map',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'extension'),
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          }
        }
      }
    ]
  }
};
