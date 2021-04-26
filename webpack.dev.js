const { merge } = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.config.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: ['./dist', './img', './../'],
    port: 3000,
  },
  plugins: [
    new webpack.DefinePlugin({
      WEBPACK_API_URL: process.env.API_URL || '"http://localhost"',
    }),
  ],
});
