/**
 * vue-gettext v2.1.6
 * (c) 2019 Polyconseil
 * @license MIT
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.VueGettext = factory());
}(this, function () { 'use strict';

  // Polyfill Object.assign for legacy browsers.
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign

  if (typeof Object.assign !== 'function') {
    (function () {
      Object.assign = function (target) {
        var arguments$1 = arguments;

        var output;
        var index;
        var source;
        var nextKey;
        if (target === undefined || target === null) {
          throw new TypeError('Cannot convert undefined or null to object')
        }
        output = Object(target);
        for (index = 1; index < arguments.length; index++) {
          source = arguments$1[index];
          if (source !== undefined && source !== null) {
            for (nextKey in source) {
              if (source.hasOwnProperty(nextKey)) {
                output[nextKey] = source[nextKey];
              }
            }
          }
        }
        return output
      };
    }());
  }

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

      n = parseInt(n);
      n = typeof n === 'number' && isNaN(n) ? 1 : n;  // Fallback to singular.

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
          return (n % 100 === 1 ? 0 : n % 100 === 2 ? 1 : n % 100 === 3 || n % 100 === 4 ? 2 : 3)
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

  // Ensure to always use the same Vue instance throughout the plugin.
  //
  // This was previously done in `index.js` using both named and default exports.
  // However, this currently must be kept in a separate file because we are using
  // Rollup to build the dist files and it has a drawback when using named and
  // default exports together, see:
  // https://github.com/rollup/rollup/blob/fca14d/src/utils/getExportMode.js#L27
  // https://github.com/rollup/rollup/wiki/JavaScript-API#exports
  //
  // If we had kept named and default exports in `index.js`, a user would have to
  // do something like this to access the default export: GetTextPlugin['default']

  var _Vue;

  function shareVueInstance (Vue) {
    _Vue = Vue;
  }

  var SPACING_RE = /\s{2,}/g;

  var translate = {

    /*
     * Get the translated string from the translation.json file generated by easygettext.
     *
     * @param {String} msgid - The translation key
     * @param {Number} n - The number to switch between singular and plural
     * @param {String} context - The translation key context
     * @param {String} defaultPlural - The default plural value (optional)
     * @param {String} language - The language ID (e.g. 'fr_FR' or 'en_US')
     *
     * @return {String} The translated string
    */
    getTranslation: function (msgid, n, context, defaultPlural, language) {
      if ( n === void 0 ) n = 1;
      if ( context === void 0 ) context = null;
      if ( defaultPlural === void 0 ) defaultPlural = null;
      if ( language === void 0 ) language = _Vue.config.language;


      if (!msgid) {
        return ''  // Allow empty strings.
      }

      var silent = _Vue.config.getTextPluginSilent || (_Vue.config.getTextPluginMuteLanguages.indexOf(language) !== -1);

      // Default untranslated string, singular or plural.
      var untranslated = defaultPlural && plurals.getTranslationIndex(language, n) > 0 ? defaultPlural : msgid;

      // `easygettext`'s `gettext-compile` generates a JSON version of a .po file based on its `Language` field.
      // But in this field, `ll_CC` combinations denoting a language’s main dialect are abbreviated as `ll`,
      // for example `de` is equivalent to `de_DE` (German as spoken in Germany).
      // See the `Language` section in https://www.gnu.org/software/gettext/manual/html_node/Header-Entry.html
      // So try `ll_CC` first, or the `ll` abbreviation which can be three-letter sometimes:
      // https://www.gnu.org/software/gettext/manual/html_node/Language-Codes.html#Language-Codes
      var translations = _Vue.$translations[language] || _Vue.$translations[language.split('_')[0]];

      if (!translations) {
        if (!silent) {
          console.warn(("No translations found for " + language));
        }
        return untranslated
      }

      // Currently easygettext trims entries since it needs to output consistent PO translation content
      // even if a web template designer added spaces between lines (which are ignored in HTML or jade,
      // but are significant in text). See #65.
      // Replicate the same behaviour here.
      msgid = msgid.trim();

      var translated = translations[msgid];

      // Sometimes `msgid` may not have the same number of spaces than its translation key.
      // This could happen because we use the private attribute `_renderChildren` to access the raw uninterpolated
      // string to translate in the `created` hook of `component.js`: spaces are not exactly the same between the
      // HTML and the content of `_renderChildren`, e.g. 6 spaces becomes 4 etc. See #15, #38.
      // In such cases, we need to compare the translation keys and `msgid` with the same number of spaces.
      if (!translated && SPACING_RE.test(msgid)) {
        Object.keys(translations).some(function (key) {
          if (key.replace(SPACING_RE, ' ') === msgid.replace(SPACING_RE, ' ')) {
            translated = translations[key];
            return translated
          }
        });
      }

      if (translated && context) {
        translated = translated[context];
      }

      if (!translated) {
        if (!silent) {
          var msg = "Untranslated " + language + " key found: " + msgid;
          if (context) {
            msg += " (with context: " + context + ")";
          }
          console.warn(msg);
        }
        return untranslated
      }

      // Avoid a crash when a msgid exists with and without a context, see #32.
      if (!(translated instanceof Array) && translated.hasOwnProperty('')) {
        // As things currently stand, the void key means a void context for easygettext.
        translated = translated[''];
      }

      if (typeof translated === 'string') {
        translated = [translated];
      }

      var translationIndex = plurals.getTranslationIndex(language, n);

      // Do not assume that the default value of n is 1 for the singular form of all languages.
      // E.g. Arabic, see #69.
      if (translated.length === 1 && n === 1) {
        translationIndex = 0;
      }

      return translated[translationIndex]

    },

    /*
     * Returns a string of the translation of the message.
     * Also makes the string discoverable by gettext-extract.
     *
     * @param {String} msgid - The translation key
     *
     * @return {String} The translated string
    */
    'gettext': function (msgid) {
      return this.getTranslation(msgid)
    },

    /*
     * Returns a string of the translation for the given context.
     * Also makes the string discoverable by gettext-extract.
     *
     * @param {String} context - The context of the string to translate
     * @param {String} msgid - The translation key
     *
     * @return {String} The translated string
    */
    'pgettext': function (context, msgid) {
      return this.getTranslation(msgid, 1, context)
    },

    /*
     * Returns a string of the translation of either the singular or plural,
     * based on the number.
     * Also makes the string discoverable by gettext-extract.
     *
     * @param {String} msgid - The translation key
     * @param {String} plural - The plural form of the translation key
     * @param {Number} n - The number to switch between singular and plural
     *
     * @return {String} The translated string
    */
    'ngettext': function (msgid, plural, n) {
      return this.getTranslation(msgid, n, null, plural)
    },

    /*
     * Returns a string of the translation of either the singular or plural,
     * based on the number, for the given context.
     * Also makes the string discoverable by gettext-extract.
     *
     * @param {String} context - The context of the string to translate
     * @param {String} msgid - The translation key
     * @param {String} plural - The plural form of the translation key
     * @param {Number} n - The number to switch between singular and plural
     *
     * @return {String} The translated string
    */
    'npgettext': function (context, msgid, plural, n) {
      return this.getTranslation(msgid, n, context, plural)
    },

  };

  // UUID v4 generator (RFC4122 compliant).
  //
  // https://gist.github.com/jcxplorer/823878

  function uuid () {

    var uuid = '';
    var i;
    var random;

    for (i = 0; i < 32; i++) {
      random = Math.random() * 16 | 0;
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += '-';
      }
      uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
    }

    return uuid

  }

  /**
   * Translate content according to the current language.
   */
  var Component = {

    name: 'translate',

    created: function () {

      this.msgid = '';  // Don't crash the app with an empty component, i.e.: <translate></translate>.

      // Store the raw uninterpolated string to translate.
      // This is currently done by looking inside a private attribute `_renderChildren`.
      // I haven't (yet) found a better way to access the raw content of the component.
      if (this.$options._renderChildren) {
        if (this.$options._renderChildren[0].hasOwnProperty('text')) {
          this.msgid = this.$options._renderChildren[0].text;
        } else {
          this.msgid = this.$options._renderChildren[0];
        }
      }

      this.isPlural = this.translateN !== undefined && this.translatePlural !== undefined;
      if (!this.isPlural && (this.translateN || this.translatePlural)) {
        throw new Error(("`translate-n` and `translate-plural` attributes must be used together: " + (this.msgid) + "."))
      }

    },

    props: {
      tag: {
        type: String,
        default: 'span',
      },
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
      translateParams: {
        type: Object,
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
          this.isPlural ? this.translatePlural : null,
          this.$language.current
        );

        var context = this.$parent;

        if (this.translateParams) {
          context = Object.assign({}, this.$parent, this.translateParams);
        }

        return this.$gettextInterpolate(translation, context)
      },
    },

    render: function (createElement) {

      // Fix the problem with v-if, see #29.
      // Vue re-uses DOM elements for efficiency if they don't have a key attribute, see:
      // https://vuejs.org/v2/guide/conditional.html#Controlling-Reusable-Elements-with-key
      // https://vuejs.org/v2/api/#key
      if (_Vue.config.autoAddKeyAttributes && !this.$vnode.key) {
        this.$vnode.key = uuid();
      }

      // The text must be wraped inside a root HTML element, so we use a <span> (by default).
      // https://github.com/vuejs/vue/blob/a4fcdb/src/compiler/parser/index.js#L209
      return createElement(this.tag, [this.translation])

    },

  };

  var EVALUATION_RE = /[[\].]{1,2}/g;

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
  var INTERPOLATION_RE = /%\{((?:.|\n)+?)\}/g;

  var MUSTACHE_SYNTAX_RE = /\{\{((?:.|\n)+?)\}\}/g;

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
  var interpolate = function (msgid, context, disableHtmlEscaping) {
    if ( context === void 0 ) context = {};
    if ( disableHtmlEscaping === void 0 ) disableHtmlEscaping = false;


    if (!_Vue.config.getTextPluginSilent && MUSTACHE_SYNTAX_RE.test(msgid)) {
      console.warn(("Mustache syntax cannot be used with vue-gettext. Please use \"%{}\" instead of \"{{}}\" in: " + msgid));
    }

    var result = msgid.replace(INTERPOLATION_RE, function (match, token) {

      var expression = token.trim();
      var evaluated;

      var escapeHtmlMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        '\'': '&#039;',
      };

      // Avoid eval() by splitting `expression` and looping through its different properties if any, see #55.
      function getProps (obj, expression) {
        var arr = expression.split(EVALUATION_RE).filter(function (x) { return x; });
        while (arr.length) {
          obj = obj[arr.shift()];
        }
        return obj
      }

      function evalInContext (expression) {
        try {
          evaluated = getProps(this, expression);
        } catch (e) {
          // Ignore errors, because this function may be called recursively later.
        }
        if (evaluated === undefined) {
          if (this.$parent) {
            // Recursively climb the $parent chain to allow evaluation inside nested components, see #23 and #24.
            return evalInContext.call(this.$parent, expression)
          } else {
            console.warn(("Cannot evaluate expression: " + expression));
            evaluated = expression;
          }
        }
        var result = evaluated.toString();
        if (disableHtmlEscaping) {
          // Do not escape HTML, see #78.
          return result
        }
        // Escape HTML, see #78.
        return result.replace(/[&<>"']/g, function (m) { return escapeHtmlMap[m] })
      }

      return evalInContext.call(context, expression)

    });

    return result

  };

  // Store this values as function attributes for easy access elsewhere to bypass a Rollup
  // weak point with `export`:
  // https://github.com/rollup/rollup/blob/fca14d/src/utils/getExportMode.js#L27
  interpolate.INTERPOLATION_RE = INTERPOLATION_RE;
  interpolate.INTERPOLATION_PREFIX = '%{';

  var updateTranslation = function (el, binding, vnode) {

    var attrs = vnode.data.attrs || {};
    var msgid = el.dataset.msgid;
    var translateContext = attrs['translate-context'];
    var translateN = attrs['translate-n'];
    var translatePlural = attrs['translate-plural'];
    var isPlural = translateN !== undefined && translatePlural !== undefined;
    var context = vnode.context;
    var disableHtmlEscaping = attrs['render-html'] === 'true';

    if (!isPlural && (translateN || translatePlural)) {
      throw new Error('`translate-n` and `translate-plural` attributes must be used together:' + msgid + '.')
    }

    if (!_Vue.config.getTextPluginSilent && attrs['translate-params']) {
      console.warn(("`translate-params` is required as an expression for v-translate directive. Please change to `v-translate='params'`: " + msgid));
    }

    if (binding.value && typeof binding.value === 'object') {
      context = Object.assign({}, vnode.context, binding.value);
    }

    var translation = translate.getTranslation(
      msgid,
      translateN,
      translateContext,
      isPlural ? translatePlural : null,
      el.dataset.currentLanguage
    );

    var msg = interpolate(translation, context, disableHtmlEscaping);

    el.innerHTML = msg;

  };

  /**
   * A directive to translate content according to the current language.
   *
   * Use this directive instead of the component if you need to translate HTML content.
   * It's too tricky to support HTML content within the component because we cannot get the raw HTML to use as `msgid`.
   *
   * This directive has a similar interface to the <translate> component, supporting
   * `translate-comment`, `translate-context`, `translate-plural`, `translate-n`.
   *
   * `<p v-translate translate-comment='Good stuff'>This is <strong class='txt-primary'>Sparta</strong>!</p>`
   *
   * If you need interpolation, you must add an expression that outputs binding value that changes with each of the
   * context variable:
   * `<p v-translate="fullName + location">I am %{ fullName } and from %{ location }</p>`
   */
  var Directive = {

    bind: function bind (el, binding, vnode) {

      // Fix the problem with v-if, see #29.
      // Vue re-uses DOM elements for efficiency if they don't have a key attribute, see:
      // https://vuejs.org/v2/guide/conditional.html#Controlling-Reusable-Elements-with-key
      // https://vuejs.org/v2/api/#key
      if (_Vue.config.autoAddKeyAttributes && !vnode.key) {
        vnode.key = uuid();
      }

      // Get the raw HTML and store it in the element's dataset (as advised in Vue's official guide).
      var msgid = el.innerHTML;
      el.dataset.msgid = msgid;

      // Store the current language in the element's dataset.
      el.dataset.currentLanguage = _Vue.config.language;

      // Output an info in the console if an interpolation is required but no expression is provided.
      if (!_Vue.config.getTextPluginSilent) {
        var hasInterpolation = msgid.indexOf(interpolate.INTERPOLATION_PREFIX) !== -1;
        if (hasInterpolation && !binding.expression) {
          console.info(("No expression is provided for change detection. The translation for this key will be static:\n" + msgid));
        }
      }

      updateTranslation(el, binding, vnode);

    },

    update: function update (el, binding, vnode) {

      var doUpdate = false;

      // Trigger an update if the language has changed.
      if (el.dataset.currentLanguage !== _Vue.config.language) {
        el.dataset.currentLanguage = _Vue.config.language;
        doUpdate = true;
      }

      // Trigger an update if an optional bound expression has changed.
      if (!doUpdate && binding.expression && (binding.value !== binding.oldValue)) {
        doUpdate = true;
      }

      if (doUpdate) {
        updateTranslation(el, binding, vnode);
      }

    },

  };

  function Config (Vue, languageVm, getTextPluginSilent, autoAddKeyAttributes, muteLanguages) {

    /*
     * Adds a `language` property to `Vue.config` and makes it reactive:
     * Vue.config.language = 'fr_FR'
    */
    Object.defineProperty(Vue.config, 'language', {
      enumerable: true,
      configurable: true,
      get: function () { return languageVm.current },
      set: function (val) { languageVm.current = val; },
    });

    /*
     * Adds a `getTextPluginSilent` property to `Vue.config`.
     * Used to enable/disable some console warnings globally.
    */
    Object.defineProperty(Vue.config, 'getTextPluginSilent', {
      enumerable: true,
      writable: true,
      value: getTextPluginSilent,
    });

    /*
     * Adds an `autoAddKeyAttributes` property to `Vue.config`.
     * Used to enable/disable the automatic addition of `key` attributes.
    */
    Object.defineProperty(Vue.config, 'autoAddKeyAttributes', {
      enumerable: true,
      writable: true,
      value: autoAddKeyAttributes,
    });

    /*
     * Adds a `getTextPluginMuteLanguages` property to `Vue.config`.
     * Used to enable/disable some console warnings for a specific set of languages.
    */
    Object.defineProperty(Vue.config, 'getTextPluginMuteLanguages', {
      enumerable: true,
      writable: true,
      value: muteLanguages,  // Stores an array of languages for which the warnings are disabled.
    });

  }

  function Override (Vue, languageVm) {

    // Override the main init sequence. This is called for every instance.
    var init = Vue.prototype._init;
    Vue.prototype._init = function (options) {
      if ( options === void 0 ) options = {};

      var root = options._parent || options.parent || this;
      // Expose languageVm to every instance.
      this.$language = root.$language || languageVm;
      init.call(this, options);
    };

    // Override the main destroy sequence to destroy all languageVm watchers.
    var destroy = Vue.prototype._destroy;
    Vue.prototype._destroy = function () {
      this.$language = null;
      destroy.apply(this, arguments);
    };

  }

  var languageVm;  // Singleton.

  var GetTextPlugin = function (Vue, options) {
    if ( options === void 0 ) options = {};


    var defaultConfig = {
      autoAddKeyAttributes: false,
      availableLanguages: { en_US: 'English' },
      defaultLanguage: 'en_US',
      languageVmMixin: {},
      muteLanguages: [],
      silent: Vue.config.silent,
      translations: null,
    };

    Object.keys(options).forEach(function (key) {
      if (Object.keys(defaultConfig).indexOf(key) === -1) {
        throw new Error((key + " is an invalid option for the translate plugin."))
      }
    });

    if (!options.translations) {
      throw new Error('No translations available.')
    }

    options = Object.assign(defaultConfig, options);

    languageVm = new Vue({
      created: function () {
        // Non-reactive data.
        this.available = options.availableLanguages;
      },
      data: {
        current: options.defaultLanguage,
      },
      mixins: [options.languageVmMixin],
    });

    shareVueInstance(Vue);

    Override(Vue, languageVm);

    Config(Vue, languageVm, options.silent, options.autoAddKeyAttributes, options.muteLanguages);

    // Makes <translate> available as a global component.
    Vue.component('translate', Component);

    // An option to support translation with HTML content: `v-translate`.
    Vue.directive('translate', Directive);

    // Exposes global properties.
    Vue.$translations = options.translations;
    // Exposes instance methods.
    Vue.prototype.$gettext = translate.gettext.bind(translate);
    Vue.prototype.$pgettext = translate.pgettext.bind(translate);
    Vue.prototype.$ngettext = translate.ngettext.bind(translate);
    Vue.prototype.$npgettext = translate.npgettext.bind(translate);
    Vue.prototype.$gettextInterpolate = interpolate.bind(interpolate);

  };

  return GetTextPlugin;

}));
