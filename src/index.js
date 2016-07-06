import Config from './config'
import GetTextComponent from './component'
import Override from './override'
import translate from './translate'

var defaultConfig = {
  availableLanguages: { en_US: 'English' },
  defaultLanguage: 'en',
  languageVmMixin: {},
  translations: null,
}

let languageVm  // Singleton.

export default function (Vue, options = {}) {

  Object.keys(options).forEach(key => {
    if (!Object.keys(defaultConfig).includes(key)) {
      throw new Error(`${key} is an invalid option for the translate plugin.`)
    }
  })

  if (!options.translations) {
    throw new Error('No translations available.')
  }

  options = Object.assign(defaultConfig, options)

  // Makes translations available as a global property.
  Vue.$translations = options.translations

  languageVm = new Vue({
    created: function () {
      // Non-reactive data.
      this.available = options.availableLanguages
    },
    data: {
      current: options.defaultLanguage,
    },
    mixins: [options.languageVmMixin],
  })

  Override(Vue, languageVm)

  Config(Vue, languageVm)

  // Makes <get-text> available as a global component.
  Vue.component('get-text', GetTextComponent)

  Vue.prototype.$gettext = translate.gettext.bind(translate)
  Vue.prototype.$pgettext = translate.pgettext.bind(translate)
  Vue.prototype.$ngettext = translate.ngettext.bind(translate)
  Vue.prototype.$npgettext = translate.npgettext.bind(translate)

}
