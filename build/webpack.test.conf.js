module.exports = {
  entry: './test/index.js',
  output: {
    path: './test/',
    filename: 'specs.js',
    publicPath: '/',
  },
  module: {
    preLoaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'eslint-loader',
    }],
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules|vue\/dist/,
        loader: 'babel',
        query: {
          presets: ['es2015'],
          plugins: ['array-includes', 'transform-strict-mode'],
        },
      },
      {
        test: /\.json$/, loader: 'json',
      },
    ],
  },
}
