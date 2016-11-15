var HtmlWebpackPlugin = require('html-webpack-plugin')
var path = require('path')
var webpack = require('webpack')

var config = require('./config')


var root = path.resolve(__dirname, '..')

var webpackConfig = {

  // Entry points.
  // https://webpack.js.org/concepts/entry-points/#object-syntax
  entry: {
    app: [
      // https://github.com/glenjamin/webpack-hot-middleware/blob/04f953/README.md#config
      'webpack-hot-middleware/client?reload=true',
      './dev/index.js',
    ],
  },

  output: {
    // Use the [name] placeholder.
    // https://webpack.js.org/configuration/output/#output-filename
    filename: '[name].js',
    // Since webpack-dev-middleware handles files in memory, there's no need to configure a specific path,
    // we can use any path.
    path: config.build.bundleRoot,
    // `publicPath` is required by webpack-dev-middleware, see `server-dev.js`.
    publicPath: config.dev.bundlePublicPath,
  },

  resolve: {
    extensions: ['', '.js', '.vue'],
    alias: {
      'vue$': 'vue/dist/vue',  // Use the Vue.js standalone build.
    },
  },

  plugins: [

    // Enable hot reloading.
    // https://github.com/glenjamin/webpack-hot-middleware/blob/04f953/README.md#installation--usage
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),

    // Generate an `index.html` entry point, and auto inject our Webpack bundles.
    // https://github.com/ampedandwired/html-webpack-plugin/blob/033207/README.md
    new HtmlWebpackPlugin({
      filename: 'index.html',  // Use the same value as webpack-dev-middleware `index` default value (`index.html`).
      template: 'dev/index.tpl.html',
      inject: 'body',
    }),

    // Expose global constants in the bundle (i.e. in client code).
    new webpack.DefinePlugin({
      'process.env': config.dev.env,
    }),

  ],

  // Pass eslint global options.
  // https://github.com/MoOx/eslint-loader/tree/81d743/README.md#options
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
      // https://github.com/postcss/postcss-import/tree/95aa38#adddependencyto
      require('postcss-import')({ addDependencyTo: webpack }),
      require('postcss-cssnext')(),
    ]
  },

}

module.exports = webpackConfig
