var express = require('express')
var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')

var config = require('./config')
var webpackConfig = require('./webpack-dev.config.js')


process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)

// Create an Express application.
var app = express()

// Start Webpack.
var compiler = webpack(webpackConfig)

// webpack-dev-middleware uses Webpack to compile assets in-memory and serve them.
// https://github.com/webpack/webpack-dev-middleware/blob/47fd5b/README.md
app.use(webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true,
  },
}))

// Webpack hot reloading using only webpack-dev-middleware.
// https://github.com/glenjamin/webpack-hot-middleware/blob/04f953/README.md
app.use(webpackHotMiddleware(compiler))

var port = config.dev.port

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  var uri = 'http://localhost:' + port
  console.log('Listening at ' + uri + '\n')
})
