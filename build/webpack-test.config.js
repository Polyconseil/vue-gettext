var path = require('path')
var webpack = require('webpack')

var config = require('./config')


var root = path.resolve(__dirname, '..')

var webpackConfig = {
  mode: 'development',

  output: {
    filename: 'bundle.js',
    path: config.build.bundleRoot,
  },

  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      'vue$': 'vue/dist/vue.common.js',
    },
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.test.env,
    }),
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['eslint-loader', 'babel-loader'],
        include: root,
        exclude: /node_modules/,
      },
      {
        test: /\.vue$/,
        use: ['eslint-loader', 'vue-loader'],
        include: root,
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          {
            loader: 'postcss-loader',
            options: {
              plugins: function (loader) {
                return [
                  require('postcss-import')({
                    path: [loader.resourcePath, root],
                  }),
                  require('postcss-cssnext')(),
                ]
              },
            },
          },
        ],
      },
      { test: /\.html$/, use: 'html-loader' },
      // { test: /\.json$/, use: 'json-loader' },
    ],
  },
}

module.exports = webpackConfig
