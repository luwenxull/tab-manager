const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    options: './src/options.jsx',
  },
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
      },
      {
        test: /\.css$/i,
        use: ['style-loader','css-loader'],
      },
    ]
  }
};
