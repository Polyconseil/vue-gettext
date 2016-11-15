/* Interpolation RegExp:
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
 * Dynamically populate a translation string with the given context.
 *
 * @param {String} msgid - The translation key
 * @param {Object} context - An object whose elements are interpolated in their corresponding placeholders
 *
 * @return {String} The interpolated string
 */
let interpolate = function (msgid, context = {}) {
  let interpolated = msgid.replace(INTERPOLATION_RE, (match, token) => {
    const key = token.trim()
    return context[key]
  })
  return interpolated
}

export default interpolate
