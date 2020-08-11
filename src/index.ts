// import "./object-assign-polyfill";

import Component from "./component";
import Directive from "./directive";
import Config from "./config";
import interpolate from "./interpolate";
import Override from "./override";
import translate from "./translate";
import { shareVueInstance } from "./localVue";

let languageVm; // Singleton.

// let GetTextPlugin = function(Vue, options = {}) {
//   let defaultConfig = {
//     autoAddKeyAttributes: false,
//     availableLanguages: { en_US: "English" },
//     defaultLanguage: "en_US",
//     languageVmMixin: {},
//     muteLanguages: [],
//     silent: Vue.config.silent,
//     translations: null,
//   };

//   Object.keys(options).forEach((key) => {
//     if (Object.keys(defaultConfig).indexOf(key) === -1) {
//       throw new Error(`${key} is an invalid option for the translate plugin.`);
//     }
//   });

//   if (!options.translations) {
//     throw new Error("No translations available.");
//   }

//   options = Object.assign(defaultConfig, options);

//   languageVm = new Vue({
//     created: function() {
//       // Non-reactive data.
//       this.available = options.availableLanguages;
//     },
//     data: {
//       current: options.defaultLanguage,
//     },
//     mixins: [options.languageVmMixin],
//   });

//   shareVueInstance(Vue);

//   Override(Vue, languageVm);

//   Config(Vue, languageVm, options.silent, options.autoAddKeyAttributes, options.muteLanguages);

//   translate.initTranslations(options.translations, Vue.config);

//   // Makes <translate> available as a global component.
//   Vue.component("translate", Component);

//   // An option to support translation with HTML content: `v-translate`.
//   Vue.directive("translate", Directive);

//   // Exposes global properties.
//   Vue.$translations = options.translations;
//   // Exposes instance methods.
//   Vue.prototype.$gettext = translate.gettext.bind(translate);
//   Vue.prototype.$pgettext = translate.pgettext.bind(translate);
//   Vue.prototype.$ngettext = translate.ngettext.bind(translate);
//   Vue.prototype.$npgettext = translate.npgettext.bind(translate);
//   Vue.prototype.$gettextInterpolate = interpolate.bind(interpolate);
// };

// export default GetTextPlugin

interface GetTextOptions {
  autoAddKeyAttributes: boolean;
  availableLanguages: any; // TODO { en_US: 'English' },
  defaultLanguage: string;
  languageVmMixin: object;
  muteLanguages: Array<string>;
  silent: boolean;
  translations: null;
}

const defaultOptions: GetTextOptions = {
  autoAddKeyAttributes: false,
  availableLanguages: { en_US: "English" },
  defaultLanguage: "en_US",
  languageVmMixin: {},
  muteLanguages: [],
  silent: false,
  translations: null,
};

export default function install(vue: any, options: Partial<GetTextOptions> = {}) {
  console.log("create", vue, options);

  Object.keys(options).forEach((key) => {
    if (Object.keys(defaultOptions).indexOf(key) === -1) {
      throw new Error(`${key} is an invalid option for the translate plugin.`);
    }
  });

  if (!options.translations) {
    throw new Error("No translations available.");
  }

  const plugin = {
    options: {
      ...defaultOptions,
      ...options,
    },
    app: vue,
  };

  languageVm = new Vue({
    created: function() {
      // Non-reactive data.
      this.available = options.availableLanguages;
    },
    data: {
      current: options.defaultLanguage,
    },
    mixins: [options.languageVmMixin],
  });

  // shareVueInstance(vue);

  Override(Vue, languageVm);

  Config(Vue, languageVm, options.silent, options.autoAddKeyAttributes, options.muteLanguages);

  translate.initTranslations(options.translations, Vue.config);

  vue.directive("translate", Directive);
  const globalProperties = vue.config.globalProperties;

  // Exposes global properties.
  globalProperties.$translations = options.translations;
  // Exposes instance methods.
  globalProperties.$gettext = translate.gettext.bind(translate);
  globalProperties.$pgettext = translate.pgettext.bind(translate);
  globalProperties.$ngettext = translate.ngettext.bind(translate);
  globalProperties.$npgettext = translate.npgettext.bind(translate);
  globalProperties.$gettextInterpolate = interpolate.bind(interpolate);

  // vue.provide("gettext", app.$gettext);
  return plugin;
}

// class GetText {
//   constructor(app: any, options: Partial<GetTextOptions> = {}) {
//     console.log("ctor", app);
//     // this.app = null;
//     // this.options = {
//     //   ...this.options,
//     //   ...options,
//     // };
//   }

//   static install: () => void;
//   app: any;

//   options: GetTextOptions = {
//     autoAddKeyAttributes: false,
//     availableLanguages: { en_US: "English" },
//     defaultLanguage: "en_US",
//     languageVmMixin: {},
//     muteLanguages: [],
//     silent: false,
//     translations: null,
//   };

//   init(app: any /* vue component instance */) {
//     this.app = app;
//     console.log("init", app);
//   }
// }

// export { translate };
// export const directive = Directive;
