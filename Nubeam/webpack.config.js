var isDev = process.env.NODE_ENV !== 'production'
var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')

const config = {
  context: __dirname,
  entry: './index.html',
  output: {
    path: path.resolve('./dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
      },
      {
        test: /\.css/, 
        loader: [
          'style-loader?singleton', 
          'css-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff?2|eot|ttf)$/i, 
        loader: 'file-loader?name=images/[name].[ext]'
      },
      {test: /\.html/, loader: 'html-loader?name=[name].[ext]'}
    ],
  },
  devtool: isDev ? 'evl' : 'source-map',
  externals: {
    d3: 'd3',
  },
  plugins: isDev ? [] : [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new CopyWebpackPlugin([
      {
        from: 'static/images/bg-01.png',
        to: 'images/bg-01.png'
      },
      {
        from: 'static/css',
        to: 'css'
      },
      {
        from: 'static/js',
        to: 'js'
      },
      {
        from: 'static/resources',
        to: 'resources'
      }
    ]),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  resolve: {
    modules: [
      path.resolve(__dirname, 'static'),
      'node_modules',
    ],
    extensions: ['.js', '.json', '.css']
  }
}

module.exports = config
