import interpolate from './interpolate'
import translate from './translate'
import Vue from 'vue'

// we have to cache the current language locally
// to detect if the language has changed and translation should be updated
let currentLanguage = null

const updateTranslation = (el, binding, vnode) => {
  // refresh it
  currentLanguage = Vue.config.language

  let attrs = vnode.data.attrs || {}
  let translateN = attrs['translate-n']
  let translatePlural = attrs['translate-plural']
  let translateContext = attrs['translate-context']
  let isPlural = translateN !== undefined && translatePlural !== undefined
  let msgid = el.dataset.msgid

  if (!isPlural && (translateN || translatePlural)) {
    throw new Error('`translate-n` and `translate-plural` attributes must be used together:' + msgid + '.')
  }

  let translation = translate.getTranslation(
    msgid,
    translateN,
    translateContext,
    isPlural ? translatePlural : null,
    currentLanguage
  )

  let msg = interpolate(translation, vnode.context)

  el.innerHTML = msg
}

const INTERPOLATION_PREFIX = '%{'

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
    let msgid = el.innerHTML

    // and storing it in the element's dataset (as advised in Vue's official guide)
    // note: not trimming the content as it should have been picked up as-is by the extractor
    el.dataset.msgid = msgid

    if (!Vue.config.getTextPluginSilent) {
      let hasInterpolation = msgid.indexOf(INTERPOLATION_PREFIX) !== -1

      if (hasInterpolation && !binding.expression) {
        console.info(`No expression is provided for change detection. The translation for this key will be static:\n${msgid}`)
      }
    }

    updateTranslation(el, binding, vnode)
  },

  update (el, binding, vnode) {
    let languageChanged = currentLanguage !== Vue.config.language

    // the directive will not be reactive unless there's an expression to compare
    // this is because the update function will get invoked when the value may or may not have changed.
    // read: https://vuejs.org/v2/guide/custom-directive.html#Hook-Functions
    let bindingValueChanged = binding.expression && binding.value !== binding.oldValue

    if (languageChanged || bindingValueChanged) {
      updateTranslation(el, binding, vnode)
    }
  },

}
