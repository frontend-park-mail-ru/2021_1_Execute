const webpack = require('webpack');
const { merge } = require('webpack-merge');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const common = require('./webpack.config.js');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      IP: '"89.208.199.114"',
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
