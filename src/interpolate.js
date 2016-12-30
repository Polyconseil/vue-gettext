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
let interpolate = function (msgid, context = {}) {

  let result = msgid.replace(INTERPOLATION_RE, (match, token) => {

    const expression = token.trim()

    function evalInContext (expression) {
      return eval('this.' + expression)  // eslint-disable-line no-eval
    }

    try {
      return evalInContext.call(context, expression)
    } catch (e) {
      console.warn(`Cannot evaluate expression: "${expression}".`)
      console.warn(e.stack)
      return expression
    }

  })

  return result

}

export default interpolate
