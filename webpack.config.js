const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = function(env) {
  return {
    mode: env && env.production ? 'production' : 'development',
    devtool: env && env.production ? undefined : 'inline-source-map',
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
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'tm-options.html',
        template: './template.html',
      })
    ],
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          },
        }
      }
    }
  }
};
