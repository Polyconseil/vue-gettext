import Component from "./component";
import Directive from "./directive";
import interpolate from "./interpolate";
import translateRaw from "./translate";
import { reactive, App, inject } from "vue";

export interface GetTextOptions {
  availableLanguages: { [key: string]: string };
  defaultLanguage: string;
  mixins: object;
  muteLanguages: Array<string>;
  silent: boolean;
  translations: { [key: string]: { [key: string]: any } };
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
  available: { [key: string]: string };
  current: string;
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

  // const plugin = {
  //   options: {
  //     ...defaultOptions,
  //     ...options,
  //   },
  //   app: vue,
  // };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
  };

  const globalProperties = vue.config.globalProperties;

  let plugin: GetText = reactive({
    options: mergedOptions,
    available: mergedOptions.availableLanguages,
    current: mergedOptions.defaultLanguage,
  });

  if (options.mixins) {
    Object.keys(options.mixins).map((key) => {
      return (plugin[key] = plugin.options.mixins[key](plugin));
    });
  }
  globalProperties.$language = plugin;

  // Config(Vue, languageVm, options.silent, options.autoAddKeyAttributes, options.muteLanguages);

  vue.directive("translate", Directive(plugin));
  vue.component("translate", Component);

  globalProperties.$translations = plugin.options.translations;
  const translate = translateRaw(plugin);
  translate.initTranslations(plugin.options.translations);
  const interpolator = interpolate;
  globalProperties.$gettext = translate.gettext.bind(translate);
  globalProperties.$pgettext = translate.pgettext.bind(translate);
  globalProperties.$ngettext = translate.ngettext.bind(translate);
  globalProperties.$npgettext = translate.npgettext.bind(translate);
  globalProperties.$gettextInterpolate = interpolator.bind(interpolator);

  vue.provide(GetTextSymbol, plugin);
  return plugin;
}

export const useGettext = (): GetText => inject(GetTextSymbol);
