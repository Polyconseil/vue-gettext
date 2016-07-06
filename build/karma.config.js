const webpackConfig = require('./webpack.test.conf')

module.exports = function (config) {

  var settings = {
    basePath: '',
    autoWatch: true,
    browserNoActivityTimeout: 100000, // in ms, 100 seconds
    frameworks: ['jasmine'],
    files: [
      '../node_modules/babel-polyfill/dist/polyfill.js',
      '../test/index.js',
    ],
    plugins: [
      'karma-jasmine',
      'karma-phantomjs-launcher',
      'karma-webpack',
    ],
    preprocessors: {
      '../test/index.js': ['webpack'],
    },
    browsers: ['PhantomJS'],
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true,
    },
    singleRun: true,
  }

  config.set(settings)

}
