var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

function nodeModulePath(pathname) {
  return path.join(__dirname, 'node_modules', pathname);
}

module.exports = {
  entry: {
    ludbot: './index.js',
    libs: [
      'alt',
      'react',
      'react-dom',
      'react-bootstrap',
      'three'
    ]
  },
  output: {
    path: 'build',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader?optional[]=runtime',
        exclude: [
          path.resolve(__dirname, 'node_modules')
        ]
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('css-loader', { publicPath: '/' })
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('css-loader!less-loader', { publicPath: '/' })
      },
      {
        test: /\.html$/, loader: 'file-loader?name=[path][name].[ext]'
      },
      {
        test: /\.(woff2?|eot|ttf|svg)(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader?name=fonts/[name].[ext]'
      },
      {
        test: /\.(jpe?g|png|gif)$/, loader: 'file-loader?name=[path][name].[ext]'
      },
      {
        test: /\.json$/, loader: 'json-loader'
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('[name].css', {
      allChunks: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'libs',
      filename: 'libs.js',
      minChunks: Infinity
    })
  ]
};
