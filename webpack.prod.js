const webpack = require('webpack');
const { merge } = require('webpack-merge');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const common = require('./webpack.config.js');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      WEBPACK_API_URL: process.env.API_URL || '"http://89.208.199.114"',
    }),
  ],
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(
        {
          parallel: true,
        },
      ),
      new TerserPlugin({
        parallel: true,
      }),
    ],
  },
});
