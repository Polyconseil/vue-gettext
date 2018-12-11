var path = require('path')

module.exports = {
  build: {
    bundleRoot: path.resolve(__dirname, '../dist'), // Where to emit the Webpack bundle.
  },
  dev: {
    bundlePublicPath: '/',
    port: 8080,
    // The env's keys will be passed to `webpack.DefinePlugin`.
    // https://webpack.github.io/docs/list-of-plugins.html#defineplugin
    // https://stackoverflow.com/q/39564802
    env: {
      NODE_ENV: JSON.stringify('development'),
    },
  },
  test: {
    // The env's keys will be passed to `webpack.DefinePlugin`.
    // https://webpack.github.io/docs/list-of-plugins.html#defineplugin
    // https://stackoverflow.com/q/39564802
    env: {
      NODE_ENV: JSON.stringify('testing'),
    },
  },
}
