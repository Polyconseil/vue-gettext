var path = require('path')
var webpack = require('webpack')

var config = require('./config')


var root = path.resolve(__dirname, '..')

var webpackConfig = {

  output: {
    filename: 'bundle.js',
    path: config.build.bundleRoot,
  },

  resolve: {
    extensions: ['', '.js', '.vue'],
    alias: {
      'vue$': 'vue/dist/vue.common.js',
    },
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.test.env,
    }),
  ],

  eslint: {
    formatter: require('eslint-friendly-formatter'),
  },

  module: {
    preLoaders: [
      {
        test: /\.vue$/,
        loader: 'eslint',
        include: root,
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        loader: 'eslint',
        include: root,
        exclude: /node_modules/,
      },
    ],
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        include: root,
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loader: 'style!css?localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader',
      },
      {
        test: /\.html$/,
        loader: 'html',
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
      {
        test: /\.vue$/,
        loader: 'vue',
      },
    ],
  },

  postcss: function (webpack) {
    return [
      require('postcss-import')({ addDependencyTo: webpack }),
      require('postcss-cssnext')(),
    ]
  },

}

module.exports = webpackConfig
