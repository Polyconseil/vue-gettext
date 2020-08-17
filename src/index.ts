import Component from "./component";
import Directive from "./directive";
import interpolate from "./interpolate";
import translate from "./translate";
import { reactive, App } from "vue";

interface GetTextOptions {
  availableLanguages: { [key: string]: string };
  defaultLanguage: string;
  mixins: object;
  muteLanguages: Array<string>;
  silent: boolean;
  translations: null;
}

const defaultOptions: GetTextOptions = {
  availableLanguages: { en_US: "English" },
  defaultLanguage: "en_US",
  mixins: {},
  muteLanguages: [],
  silent: false,
  translations: null,
};

export const GetTextSymbol = Symbol("GETTEXT");

export interface GetText {
  options: GetTextOptions;
  app: App;
}

export default function install(vue: App, options: Partial<GetTextOptions> = {}) {
  Object.keys(options).forEach((key) => {
    if (Object.keys(defaultOptions).indexOf(key) === -1) {
      throw new Error(`${key} is an invalid option for the translate plugin.`);
    }
  });

  if (!options.translations) {
    // throw new Error("No translations available.");
    (options.translations as any) = {};
  }

  const plugin = {
    options: {
      ...defaultOptions,
      ...options,
    },
    app: vue,
  };

  const globalProperties = vue.config.globalProperties;

  let language = reactive({
    available: plugin.options.availableLanguages,
    current: plugin.options.defaultLanguage,
  });

  if (options.mixins) {
    Object.keys(options.mixins).map((key) => {
      return (language[key] = plugin.options.mixins[key](language));
    });
  }
  globalProperties.$language = language;

  // Config(Vue, languageVm, options.silent, options.autoAddKeyAttributes, options.muteLanguages);

  vue.directive("translate", Directive(plugin));
  vue.component("translate", Component(plugin));

  globalProperties.$translations = plugin.options.translations;
  const translator = translate(plugin);
  translator.initTranslations(plugin.options.translations);
  const interpolator = interpolate(plugin);
  globalProperties.$gettext = translator.gettext.bind(translator);
  globalProperties.$pgettext = translator.pgettext.bind(translator);
  globalProperties.$ngettext = translator.ngettext.bind(translator);
  globalProperties.$npgettext = translator.npgettext.bind(translator);
  globalProperties.$gettextInterpolate = interpolator.bind(interpolator);

  vue.provide(GetTextSymbol, language);
  return plugin;
}
