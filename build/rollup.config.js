const buble = require('rollup-plugin-buble')
const commonjs = require('rollup-plugin-commonjs')
const version = process.env.VERSION || require('../package.json').version
const globals = {
  vue: 'Vue',
}

module.exports = {
  input: 'src/index.js',
  output: {
    banner:
`/**
 * vue-gettext v${version}
 * (c) ${new Date().getFullYear()} Polyconseil
 * @license MIT
 */`,
    file: 'dist/vue-gettext.js',
    format: 'umd',
    globals,
    name: 'VueGettext',
  },
  external: Object.keys(globals),
  plugins: [
    commonjs(),
    buble(),
  ],
}
