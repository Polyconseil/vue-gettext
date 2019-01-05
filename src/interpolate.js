import { _Vue } from './localVue'

const EVALUATION_RE = /[[\].]{1,2}/g

/* Interpolation RegExp.
 *
 * Because interpolation inside attributes are deprecated in Vue 2 we have to
 * use another set of delimiters to be able to use `translate-plural` etc.
 * We use %{ } delimiters.
 *
 * /
 *   %\{                => Starting delimiter: `%{`
 *     (                => Start capture
 *       (?:.|\n)       => Non-capturing group: any character or newline
 *       +?             => One or more times (ungreedy)
 *     )                => End capture
 *   \}                 => Ending delimiter: `}`
 * /g                   => Global: don't return after first match
 */
const INTERPOLATION_RE = /%\{((?:.|\n)+?)\}/g

const MUSTACHE_SYNTAX_RE = /\{\{((?:.|\n)+?)\}\}/g

/**
 * Evaluate a piece of template string containing %{ } placeholders.
 * E.g.: 'Hi %{ user.name }' => 'Hi Bob'
 *
 * This is a vm.$interpolate alternative for Vue 2.
 * https://vuejs.org/v2/guide/migration.html#vm-interpolate-removed
 *
 * @param {String} msgid - The translation key containing %{ } placeholders
 * @param {Object} context - An object whose elements are put in their corresponding placeholders
 *
 * @return {String} The interpolated string
 */
let interpolate = function (msgid, context = {}, disableHtmlEscaping = false) {

  if (!_Vue.config.getTextPluginSilent && MUSTACHE_SYNTAX_RE.test(msgid)) {
    console.warn(`Mustache syntax cannot be used with vue-gettext. Please use "%{}" instead of "{{}}" in: ${msgid}`)
  }

  let result = msgid.replace(INTERPOLATION_RE, (match, token) => {

    const expression = token.trim()
    let evaluated

    let escapeHtmlMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      '\'': '&#039;',
    }

    // Avoid eval() by splitting `expression` and looping through its different properties if any, see #55.
    function getProps (obj, expression) {
      const arr = expression.split(EVALUATION_RE).filter(x => x)
      while (arr.length) {
        obj = obj[arr.shift()]
      }
      return obj
    }

    function evalInContext (expression) {
      try {
        evaluated = getProps(this, expression)
      } catch (e) {
        // Ignore errors, because this function may be called recursively later.
      }
      if (evaluated === undefined) {
        if (this.$parent) {
          // Recursively climb the $parent chain to allow evaluation inside nested components, see #23 and #24.
          return evalInContext.call(this.$parent, expression)
        } else {
          console.warn(`Cannot evaluate expression: ${expression}`)
          evaluated = expression
        }
      }
      let result = evaluated.toString()
      if (disableHtmlEscaping) {
        // Do not escape HTML, see #78.
        return result
      }
      // Escape HTML, see #78.
      return result.replace(/[&<>"']/g, function (m) { return escapeHtmlMap[m] })
    }

    return evalInContext.call(context, expression)

  })

  return result

}

// Store this values as function attributes for easy access elsewhere to bypass a Rollup
// weak point with `export`:
// https://github.com/rollup/rollup/blob/fca14d/src/utils/getExportMode.js#L27
interpolate.INTERPOLATION_RE = INTERPOLATION_RE
interpolate.INTERPOLATION_PREFIX = '%{'

export default interpolate
