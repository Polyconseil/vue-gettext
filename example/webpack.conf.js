module.exports = {
  entry: './example/index.js',
  output: {
    path: './example/',
    filename: 'build.js',
    publicPath: '/',
  },
  module: {
    preLoaders: [{
      test: /\.js$/,
      exclude: /node_modules|vue\/dist/,
      loader: 'eslint-loader',
    }],
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue',
      },
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
        test: /\.json$/,
        loader: 'json',
      },
    ],
  },
}
