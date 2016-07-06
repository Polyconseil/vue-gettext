import Vue from 'vue'

import Alert from './components/alert.vue'
import GetTextPlugin from '../src/'
import LanguageSelect from './components/languageSelect.vue'
import MomentFilter from './components/momentFilter.vue'
import Plural from './components/plural.vue'
import translations from './translations.json'

Vue.use(GetTextPlugin, {
  availableLanguages: {
    en_GB: 'British English',
    fr_FR: 'Français',
    it_IT: 'Italiano',
  },
  defaultLanguage: 'en_GB',
  languageVmMixin: {
    computed: {
      currentKebabCase: function () {
        return this.current.toLowerCase().replace('_', '-')
      },
    },
  },
  translations: translations,
})

export let vm = new Vue({
  el: '#app',
  components: {
    'alert': Alert,
    'language-select': LanguageSelect,
    'moment-filter': MomentFilter,
    'plural': Plural,
  },
})
