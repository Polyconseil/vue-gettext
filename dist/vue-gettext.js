/**
 * vue-gettext v2.0.0
 * (c) 2016 Polyconseil
 * @license MIT
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('vue')) :
  typeof define === 'function' && define.amd ? define(['vue'], factory) :
  (global.VueGettext = factory(global.Vue));
}(this, (function (Vue) { 'use strict';

Vue = 'default' in Vue ? Vue['default'] : Vue;

/**
 * Plural Forms
 *
 * This is a list of the plural forms, as used by Gettext PO, that are appropriate to each language.
 * http://docs.translatehouse.org/projects/localization-guide/en/latest/l10n/pluralforms.html
 *
 * This is a replica of angular-gettext's plural.js
 * https://github.com/rubenv/angular-gettext/blob/master/src/plural.js
 */
var plurals = {

  getTranslationIndex: function (languageCode, n) {

    n = Number.isNaN(parseInt(n)) ? 1 : parseInt(n);  // Fallback to singular.

    // Extract the ISO 639 language code. The ISO 639 standard defines
    // two-letter codes for many languages, and three-letter codes for
    // more rarely used languages.
    // https://www.gnu.org/software/gettext/manual/html_node/Language-Codes.html#Language-Codes
    if (languageCode.length > 2 && languageCode !== 'pt_BR') {
      languageCode = languageCode.split('_')[0];
    }

    switch (languageCode) {
      case 'ay':  // Aymará
      case 'bo':  // Tibetan
      case 'cgg': // Chiga
      case 'dz':  // Dzongkha
      case 'fa':  // Persian
      case 'id':  // Indonesian
      case 'ja':  // Japanese
      case 'jbo': // Lojban
      case 'ka':  // Georgian
      case 'kk':  // Kazakh
      case 'km':  // Khmer
      case 'ko':  // Korean
      case 'ky':  // Kyrgyz
      case 'lo':  // Lao
      case 'ms':  // Malay
      case 'my':  // Burmese
      case 'sah': // Yakut
      case 'su':  // Sundanese
      case 'th':  // Thai
      case 'tt':  // Tatar
      case 'ug':  // Uyghur
      case 'vi':  // Vietnamese
      case 'wo':  // Wolof
      case 'zh':  // Chinese
        // 1 form
        return 0
      case 'is':  // Icelandic
        // 2 forms
        return (n % 10 !== 1 || n % 100 === 11) ? 1 : 0
      case 'jv':  // Javanese
        // 2 forms
        return n !== 0 ? 1 : 0
      case 'mk':  // Macedonian
        // 2 forms
        return n === 1 || n % 10 === 1 ? 0 : 1
      case 'ach': // Acholi
      case 'ak':  // Akan
      case 'am':  // Amharic
      case 'arn': // Mapudungun
      case 'br':  // Breton
      case 'fil': // Filipino
      case 'fr':  // French
      case 'gun': // Gun
      case 'ln':  // Lingala
      case 'mfe': // Mauritian Creole
      case 'mg':  // Malagasy
      case 'mi':  // Maori
      case 'oc':  // Occitan
      case 'pt_BR':  // Brazilian Portuguese
      case 'tg':  // Tajik
      case 'ti':  // Tigrinya
      case 'tr':  // Turkish
      case 'uz':  // Uzbek
      case 'wa':  // Walloon
      /* eslint-disable */
      /* Disable "Duplicate case label" because there are 2 forms of Chinese plurals */
      case 'zh':  // Chinese
      /* eslint-enable */
        // 2 forms
        return n > 1 ? 1 : 0
      case 'lv':  // Latvian
        // 3 forms
        return (n % 10 === 1 && n % 100 !== 11 ? 0 : n !== 0 ? 1 : 2)
      case 'lt':  // Lithuanian
        // 3 forms
        return (n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2)
      case 'be':  // Belarusian
      case 'bs':  // Bosnian
      case 'hr':  // Croatian
      case 'ru':  // Russian
      case 'sr':  // Serbian
      case 'uk':  // Ukrainian
        // 3 forms
        return (
          n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2)
      case 'mnk': // Mandinka
        // 3 forms
        return (n === 0 ? 0 : n === 1 ? 1 : 2)
      case 'ro':  // Romanian
        // 3 forms
        return (n === 1 ? 0 : (n === 0 || (n % 100 > 0 && n % 100 < 20)) ? 1 : 2)
      case 'pl':  // Polish
        // 3 forms
        return (n === 1 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2)
      case 'cs':  // Czech
      case 'sk':  // Slovak
        // 3 forms
        return (n === 1) ? 0 : (n >= 2 && n <= 4) ? 1 : 2
      case 'csb': // Kashubian
        // 3 forms
        return (n === 1) ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2
      case 'sl':  // Slovenian
        // 4 forms
        return (n % 100 === 1 ? 1 : n % 100 === 2 ? 2 : n % 100 === 3 || n % 100 === 4 ? 3 : 0)
      case 'mt':  // Maltese
        // 4 forms
        return (n === 1 ? 0 : n === 0 || (n % 100 > 1 && n % 100 < 11) ? 1 : (n % 100 > 10 && n % 100 < 20) ? 2 : 3)
      case 'gd':  // Scottish Gaelic
        // 4 forms
        return (n === 1 || n === 11) ? 0 : (n === 2 || n === 12) ? 1 : (n > 2 && n < 20) ? 2 : 3
      case 'cy':  // Welsh
        // 4 forms
        return (n === 1) ? 0 : (n === 2) ? 1 : (n !== 8 && n !== 11) ? 2 : 3
      case 'kw':  // Cornish
        // 4 forms
        return (n === 1) ? 0 : (n === 2) ? 1 : (n === 3) ? 2 : 3
      case 'ga':  // Irish
        // 5 forms
        return n === 1 ? 0 : n === 2 ? 1 : (n > 2 && n < 7) ? 2 : (n > 6 && n < 11) ? 3 : 4
      case 'ar':  // Arabic
        // 6 forms
        return (n === 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5)
      default: // Everything else
        return n !== 1 ? 1 : 0
    }
  },

};

var translate = {

 /**
  * Get the translated string from the translation.json file generated by easygettext.
  *
  * @param {String} msgid - The translation key
  * @param {Number} n - The number to switch between singular and plural
  * @param {String} context - The translation key context
  * @param {String} language - The language ID (e.g. 'fr_FR' or 'en_US')
  *
  * @return {String} The translated string
  */
  getTranslation: function (msgid, n, context, language) {
    if ( n === void 0 ) n = 1;
    if ( context === void 0 ) context = null;
    if ( language === void 0 ) language = Vue.config.language;

    if (!msgid) {
      return ''  // Allow empty strings.
    }
    // `easygettext`'s `gettext-compile` generates a JSON version of a .po file based on its `Language` field.
    // But in this field, `ll_CC` combinations denoting a language’s main dialect are abbreviated as `ll`,
    // for example `de` is equivalent to `de_DE` (German as spoken in Germany).
    // See the `Language` section in https://www.gnu.org/software/gettext/manual/html_node/Header-Entry.html
    // So try `ll_CC` first, or the `ll` abbreviation which can be three-letter sometimes:
    // https://www.gnu.org/software/gettext/manual/html_node/Language-Codes.html#Language-Codes
    var translations = Vue.$translations[language] || Vue.$translations[language.split('_')[0]];
    if (!translations) {
      console.warn(("No translations found for " + language));
      return msgid  // Returns the untranslated string.
    }
    var translated = translations[msgid];
    if (!translated) {
      console.warn(("Untranslated " + language + " key found:\n" + msgid));
      return msgid  // Returns the untranslated string.
    }
    if (context) {
      translated = translated[context];
    }
    if (typeof translated === 'string') {
      translated = [translated];
    }
    return translated[plurals.getTranslationIndex(language, n)]
  },

 /**
  * Returns a string of the translation of the message.
  * Also makes the string discoverable by xgettext.
  *
  * @param {String} msgid - The translation key
  *
  * @return {String} The translated string
  */
  'gettext': function (msgid) {
    return this.getTranslation(msgid)
  },

 /**
  * Returns a string of the translation for the given context.
  * Also makes the string discoverable by xgettext.
  *
  * @param {String} context - The context of the string to translate
  * @param {String} msgid - The translation key
  *
  * @return {String} The translated string
  */
  'pgettext': function (context, msgid) {
    return this.getTranslation(msgid, 1, context)
  },

 /**
  * Returns a string of the translation of either the singular or plural,
  * based on the number.
  * Also makes the string discoverable by xgettext.
  *
  * @param {String} msgid - The translation key
  * @param {String} plural - The plural form of the translation key
  * @param {Number} n - The number to switch between singular and plural
  *
  * @return {String} The translated string
  */
  'ngettext': function (msgid, plural, n) {
    return this.getTranslation(msgid, n)
  },

 /**
  * Returns a string of the translation of either the singular or plural,
  * based on the number, for the given context.
  * Also makes the string discoverable by xgettext.
  *
  * @param {String} context - The context of the string to translate
  * @param {String} msgid - The translation key
  * @param {String} plural - The plural form of the translation key
  * @param {Number} n - The number to switch between singular and plural
  *
  * @return {String} The translated string
  */
  'npgettext': function (context, msgid, plural, n) {
    return this.getTranslation(msgid, n, context)
  },

};

/**
 * Translate content according to the current language.
 */
var Component = {

  name: 'translate',

  created: function () {

    this.msgid = '';  // Don't crash the app with an empty component, i.e.: <translate></translate>.
    if (this.$options._renderChildren) {
      this.msgid = this.$options._renderChildren[0].trim();  // Stores the raw uninterpolated string to translate.
    }

    this.isPlural = this.translateN !== undefined && this.translatePlural !== undefined;
    if (!this.isPlural && (this.translateN || this.translatePlural)) {
      throw new Error(("`translate-n` and `translate-plural` attributes must be used together: " + (this.msgid) + "."))
    }

  },

  props: {
    // Always use v-bind for dynamically binding the `translateN` prop to data on the parent,
    // i.e.: `:translateN`.
    translateN: {
      type: Number,
      required: false,
    },
    translatePlural: {
      type: String,
      required: false,
    },
    translateContext: {
      type: String,
      required: false,
    },
    // `translateComment` is used exclusively by `easygettext`'s `gettext-extract`.
    translateComment: {
      type: String,
      required: false,
    },
  },

  computed: {
    translation: function () {
      var translation = translate.getTranslation(
        this.msgid,
        this.translateN,
        this.translateContext,
        this.$language.current
      );
      return this.$gettextInterpolate(translation, this.$parent.$data)
    },
  },

  render: function (createElement) {
    // The text must be wraped inside a root HTML element, so we use a <span>.
    // https://github.com/vuejs/vue/blob/a4fcdb/src/compiler/parser/index.js#L209
    return createElement('span', [this.translation])
  },

};

var Config = function (Vue$$1, languageVm) {

  /*
   * Adds a `language` property to `Vue.config` and makes it reactive:
   * Vue.config.language = 'fr_FR'
   */
  Object.defineProperty(Vue$$1.config, 'language', {
    enumerable: true,
    configurable: true,
    get: function () { return languageVm.current },
    set: function (val) { languageVm.current = val; },
  });

};

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
var INTERPOLATION_RE = /%\{((?:.|\n)+?)\}/g;

/**
 * Dynamically populate a translation string with the given context.
 *
 * @param {String} msgid - The translation key
 * @param {Object} context - An object whose elements are interpolated in their corresponding placeholders
 *
 * @return {String} The interpolated string
 */
var interpolate = function (msgid, context) {
  if ( context === void 0 ) context = {};

  var interpolated = msgid.replace(INTERPOLATION_RE, function (match, token) {
    var key = token.trim();
    return context[key]
  });
  return interpolated
};

var Override = function (Vue$$1, languageVm) {

  // Override the main init sequence. This is called for every instance.
  var init = Vue$$1.prototype._init;
  Vue$$1.prototype._init = function (options) {
    if ( options === void 0 ) options = {};

    var root = options._parent || options.parent || this;
    // Expose languageVm to every instance.
    this.$language = root.$language || languageVm;
    init.call(this, options);
  };

  // Override the main destroy sequence to destroy all languageVm watchers.
  var destroy = Vue$$1.prototype._destroy;
  Vue$$1.prototype._destroy = function () {
    this.$language = null;
    destroy.apply(this, arguments);
  };

};

var defaultConfig = {
  availableLanguages: { en_US: 'English' },
  defaultLanguage: 'en_US',
  languageVmMixin: {},
  translations: null,
};

var languageVm;  // Singleton.

var GetTextPlugin = function (Vue$$1, options) {
  if ( options === void 0 ) options = {};


  Object.keys(options).forEach(function (key) {
    if (Object.keys(defaultConfig).indexOf(key) === -1) {
      throw new Error((key + " is an invalid option for the translate plugin."))
    }
  });

  if (!options.translations) {
    throw new Error('No translations available.')
  }

  options = Object.assign(defaultConfig, options);

  languageVm = new Vue$$1({
    created: function () {
      // Non-reactive data.
      this.available = options.availableLanguages;
    },
    data: {
      current: options.defaultLanguage,
    },
    mixins: [options.languageVmMixin],
  });

  Override(Vue$$1, languageVm);

  Config(Vue$$1, languageVm);

  // Makes <translate> available as a global component.
  Vue$$1.component('translate', Component);

  // Exposes global properties.
  Vue$$1.$translations = options.translations;
  // Exposes instance methods.
  Vue$$1.prototype.$gettext = translate.gettext.bind(translate);
  Vue$$1.prototype.$pgettext = translate.pgettext.bind(translate);
  Vue$$1.prototype.$ngettext = translate.ngettext.bind(translate);
  Vue$$1.prototype.$npgettext = translate.npgettext.bind(translate);
  Vue$$1.prototype.$gettextInterpolate = interpolate.bind(interpolate);

};

return GetTextPlugin;

})));
