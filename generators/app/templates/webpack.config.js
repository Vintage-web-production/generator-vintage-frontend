'use strict';

const webpack        = require('webpack');
const path           = require('path');
const WebpackMd5Hash = require('webpack-md5-hash');<% if (splitting) { %>
const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');<% } %>

module.exports = {

  // Entry point
  entry: {
    'js/index': './src/js/index'<% if (jquery) { %>,
    'js/index.jquery': './src/js/index.jquery'<% } %>
  },

  // Output settings
  output: {
    filename: '[name].js'<% if (splitting) { %>,
    publicPath: './static/',
    chunkFilename: 'js/chunks/[name]-[chunkhash].js'<% } %>
  },

  // Webpack's plugins
  plugins: [
    <% if (jquery) { %>
    new webpack.optimize.CommonsChunkPlugin({
      name: 'js/index.jquery',
      minChunks: Infinity,
    }),<% } %>
    new WebpackMd5Hash(),

    new webpack.NoEmitOnErrorsPlugin(),<% if (splitting) { %>,

    new ChunkManifestPlugin({
      filename: 'webpack-chunk-manifest.json',
      manifestVariable: 'webpackManifest',
      inlineManifest: false
    })<% } %>
  ],

  // Configure module loading (paths, default paths)
  resolve: {
    extensions: ['.js'],
    modules: [
      path.join(__dirname, 'src'),
      'node_modules'
    ]
  },

  module: {
    // Configure file loaders
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [/node_modules/, path.resolve(__dirname, 'src/js/modules/dep')],
        options: {
          presets: ['es2015', 'stage-2']
        }
      }<% if (jquery) { %>,
      {
        test: require.resolve('jquery'),
        loader: 'expose-loader?jQuery!expose-loader?$'
      }<% } %>
    ]
  }
};