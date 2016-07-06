var fs = require('fs')
var zlib = require('zlib')
var rollup = require('rollup')
var uglify = require('uglify-js')
var babel = require('rollup-plugin-babel')
var version = process.env.VERSION || require('../package.json').version
var banner =
  '/*!\n' +
  ' * vue-gettext v' + version + '\n' +
  ' * (c) ' + new Date().getFullYear() + ' Polyconseil\n' +
  ' * Released under the MIT License.\n' +
  ' */'

rollup.rollup({
  entry: 'src/index.js',
  plugins: [
    babel({
      presets: ['es2015-rollup'],
      plugins: ['array-includes', 'transform-strict-mode'],
    }),
  ],
})
.then(function (bundle) {
  return write('dist/vue-gettext.js', bundle.generate({
    format: 'umd',
    banner: banner,
    moduleName: 'VueGettext',
  }).code)
})
.then(function () {
  return write(
    'dist/vue-gettext.min.js',
    banner + '\n' + uglify.minify('dist/vue-gettext.js').code
  )
})
.then(function () {
  return new Promise(function (resolve, reject) {
    fs.readFile('dist/vue-gettext.min.js', function (err, buf) {
      if (err) return reject(err)
      zlib.gzip(buf, function (err, buf) {
        if (err) return reject(err)
        write('dist/vue-gettext.min.js.gz', buf).then(resolve)
      })
    })
  })
})
.catch(logError)

function write (dest, code) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(dest, code, function (err) {
      if (err) return reject(err)
      console.log(blue(dest) + ' ' + getSize(code))
      resolve()
    })
  })
}

function getSize (code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

function logError (e) {
  console.log(e)
}

function blue (str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}
