import './styles/global.css'

import Vue from 'vue'

import GetTextPlugin from '../src/index'
import translations from './translations.json'

import AlertComponent from './components/alert'
import CustomTags from './components/customTags'
import DirectiveComponent from './components/directive'
import IfComponent from './components/if'
import LanguageSelectComponent from './components/languageSelect'
import MomentFilterComponent from './components/momentFilter'
import MultiLinesComponent from './components/multilines'
import PluralComponent from './components/plural'


Vue.use(GetTextPlugin, {
  availableLanguages: {
    en_GB: 'British English',
    fr_FR: 'Français',
    it_IT: 'Italiano',
  },
  defaultLanguage: 'en_GB',
  translations: translations,
})

export let vm = new Vue({
  el: '#app',
  components: {
    'alert': AlertComponent,
    'custom-tags': CustomTags,
    'directive': DirectiveComponent,
    'if': IfComponent,
    'language-select': LanguageSelectComponent,
    'moment-filter': MomentFilterComponent,
    'multilines': MultiLinesComponent,
    'plural': PluralComponent,
  },
})
