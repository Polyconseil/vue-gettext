// Check if two values are loosely equal - that is,
// if they are plain objects, do they have the same shape?
// https://github.com/vuejs/vue/blob/v2.6.11/src/shared/util.js#L285

export default function looseEqual (a, b) {
  if (a === b) return true
  const isObjectA = a !== null && typeof a === 'object'
  const isObjectB = b !== null && typeof b === 'object'
  if (isObjectA && isObjectB) {
    try {
      const isArrayA = Array.isArray(a)
      const isArrayB = Array.isArray(b)
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every((e, i) => {
          return looseEqual(e, b[i])
        })
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        const keysA = Object.keys(a)
        const keysB = Object.keys(b)
        return keysA.length === keysB.length && keysA.every(key => {
          return looseEqual(a[key], b[key])
        })
      } else {
        return false
      }
    } catch (e) {
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}
