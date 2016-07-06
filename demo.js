var translations = {
  "en_GB": {
    "Good bye!": "Good bye!",
    "Hello!": "Hello!",
    "Plural": "Plural",
    "Select your language:": "Select your language:",
    "Singular": "Singular",
    "{{ n }} bar": [
      "{{ n }} bar en_GB",
      "{{ n }} bars en_GB"
    ],
    "{{ n }} foo": [
      "{{ n }} foo en_GB",
      "{{ n }} foos en_GB"
    ]
  },
  "fr_FR": {
    "Good bye!": "Au revoir !",
    "Hello!": "Bonjour !",
    "Plural": "Pluriel",
    "Select your language:": "Sélectionner votre langage",
    "Singular": "Singulier",
    "{{ n }} bar": [
      "{{ n }} bar fr_FR",
      "{{ n }} bars fr_FR"
    ],
    "{{ n }} foo": [
      "{{ n }} foo fr_FR",
      "{{ n }} foos fr_FR"
    ]
  },
  "it_IT": {
    "Good bye!": "Arrivederci!",
    "Hello!": "Buongiorno!",
    "Plural": "Plurale",
    "Select your language:": "Seleziona la tua lingua:",
    "Singular": "Singolare",
    "{{ n }} bar": [
      "{{ n }} bar it_IT",
      "{{ n }} bars it_IT"
    ],
    "{{ n }} foo": [
      "{{ n }} foo it_IT",
      "{{ n }} foos it_IT"
    ]
  }
}

Vue.use(window.VueGettext, {
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

var dateFormat = function (value, formatString) {
  moment.locale(Vue.config.language)
  return moment(value).format(arguments.length > 1 ? formatString : 'dddd D MMMM HH:mm:ss')
}

Vue.filter('dateFormat', dateFormat)

var LanguageSelect = Vue.extend({
  template: [
    '<div>',
      '<p>',
        '<get-text>Select your language:</get-text>',
        '<br>',
        '<select name="language" v-model="$language.current">',
          '<option v-for="language in availableLanguages" value="{{ $key }}">{{ language }}</option>',
        '</select>',
      '</p>',
    '</div>',
  ].join(''),
  data: function () {
    return {
      availableLanguages: this.$language.available,
    }
  },
})

var Plural = Vue.extend({
  template: [
    '<div>',
      '<h1>',
        '<get-text :translate-n="n" translate-plural="{{ n }} bars">{{ n }} bar</get-text>',
      '</h1>',
      '<p>',
        '<input v-model="n" type="text">',
      '</p>',
    '</div>',
  ].join(''),
  data: function () {
    return {
      n: 1,
    }
  },
})

var MomentFilter = Vue.extend({
  template: [
    '<div>',
      '<p>',
        '{{ creation | dateFormat }}',
      '</p>',
    '</div>',
  ].join(''),
  data: function () {
    return {
      creation: '2016-06-02T15:03:00.029289Z',
    }
  },
})

var Alert = Vue.extend({
  template: [
    '<div>',
      '<p>',
        '<button @click="alertSingular"><get-text>Singular</get-text></button>',
      '</p>',
      '<p>',
        '<input v-model="n" type="text">',
        '<button @click="alertPlural(n)"><get-text>Plural</get-text></button>',
      '</p>',
    '</div>',
  ].join(''),
  data: function () {
    return {
      n: 2,
    }
  },
  methods: {
    alertSingular () {
      var msg = this.$gettext('Good bye!')
      return window.alert(msg)
    },
    alertPlural (n) {
      var msg = this.$ngettext('{{ n }} foo', '{{ n }} foos', parseInt(n))
      msg = this.$interpolate(msg)
      return window.alert(msg)
    },
  },
})

new Vue({
  el: '#app',
  components: {
    'alert': Alert,
    'language-select': LanguageSelect,
    'moment-filter': MomentFilter,
    'plural': Plural,
  },
})
