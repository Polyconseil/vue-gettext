const buble = require('rollup-plugin-buble')
const commonjs = require('rollup-plugin-commonjs')
const version = process.env.VERSION || require('../package.json').version


module.exports = {
  input: 'src/index.js',
  output: {
    file: 'dist/vue-gettext.js',
    format: 'umd',
  },
  name: 'VueGettext',
  globals: {
    vue: 'Vue',
  },
  external: ['vue'],
  plugins: [
    commonjs(),
    buble(),
  ],
  banner:
`/**
 * vue-gettext v${version}
 * (c) ${new Date().getFullYear()} Polyconseil
 * @license MIT
 */`,
}
