// Polyfill fn.bind() for PhantomJS.
/* eslint-disable no-extend-native */
// Function.prototype.bind = require('function-bind')

// Require all test files (files that ends with .spec.js).
const testsContext = require.context('./specs', true, /\.spec$/)
testsContext.keys().forEach(testsContext)
