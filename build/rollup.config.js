const buble = require('rollup-plugin-buble')
const commonjs = require('rollup-plugin-commonjs')
const nodeResolve = require('rollup-plugin-node-resolve')
const version = process.env.VERSION || require('../package.json').version


module.exports = {
  entry: 'src/index.js',
  dest: 'dist/vue-gettext.js',
  format: 'umd',
  moduleName: 'VueGettext',
  globals: {
    vue: 'Vue',
  },
  plugins: [
    nodeResolve({
      skip: ['vue'],
    }),
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
