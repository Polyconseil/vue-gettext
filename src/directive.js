import interpolate from './interpolate'
import translate from './translate'

const updateTranslation = (el, binding, vnode) => {
  let attrs = vnode.data.attrs || {}
  let translateN = attrs['translate-n']
  let translatePlural = attrs['translate-plural']
  let translateContext = attrs['translate-context']
  let translateComment = attrs['translate-comment']
  let isPlural = translateN !== undefined && translatePlural !== undefined

  if (!isPlural && (translateN || translatePlural)) {
    throw new Error('`translate-n` and `translate-plural` attributes must be used together:' + msgid + '.')
  }

  let translation = translate.getTranslation(
    el.dataset.msgid,
    translateN,
    translateContext,
    isPlural ? translatePlural : null,
    Vue.config.language
  )

  if (binding.expression && binding.value !== binding.oldValue) {
    debugger
  }

  let msg = interpolate(translation, vnode.context)

  el.innerHTML = msg
}

/**
 * Use if you need to translate HTML content.
 * It has a similar interface to the <translate> component,
 * supporting translate-comment, translate-context, translate-plural, translate-n
 *
 * `<p v-translate translate-comment='Good stuff'>This is <strong class='txt-primary'>Sparta</strong>!</p>`
 *
 * If you need interpolation, you must add an expression that outputs binding value that changes with each of the context variable:
 * `<p v-translate='fullName + location'>I am %{ fullName } and from %{ location }</p>`
 */
export default {

  bind (el, binding, vnode) {
    // getting the raw HTML
    // and storing it in the element's dataset (as advised in Vue's official guide)
    // note: not trimming the content as it should have been picked up as-is by the extractor
    el.dataset.msgid = el.innerHTML

    updateTranslation(el, binding, vnode)
  },

  update (el, binding, vnode) {
    // the directive will not be reactive unless there's an expression to compare
    // this is because the update function will get invoked when the value may or may not have changed.
    // read: https://vuejs.org/v2/guide/custom-directive.html#Hook-Functions
    if (!binding.expression || binding.value === binding.oldValue) {
      return
    }

    updateTranslation(el, binding, vnode)
  }

}
