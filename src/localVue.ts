// Ensure to always use the same Vue instance throughout the plugin.
//
// This was previously done in `index.js` using both named and default exports.
// However, this currently must be kept in a separate file because we are using
// Rollup to build the dist files and it has a drawback when using named and
// default exports together, see:
// https://github.com/rollup/rollup/blob/fca14d/src/utils/getExportMode.js#L27
// https://github.com/rollup/rollup/wiki/JavaScript-API#exports
//
// If we had kept named and default exports in `index.js`, a user would have to
// do something like this to access the default export: GetTextPlugin['default']

export let _Vue

export function shareVueInstance (Vue) {
  _Vue = Vue
}
