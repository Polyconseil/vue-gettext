import Component from "./component";
import Directive from "./directive";
import interpolate from "./interpolate";
import translateRaw from "./translate";
import { reactive, App, inject, getCurrentInstance } from "vue";

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
  translations: {},
};

export const GetTextSymbol = Symbol("GETTEXT");

export interface GetText {
  options: GetTextOptions;
  available: { [key: string]: string };
  current: string;
}

export default function install(app: App, options: Partial<GetTextOptions> = {}) {
  Object.keys(options).forEach((key) => {
    if (Object.keys(defaultOptions).indexOf(key) === -1) {
      throw new Error(`${key} is an invalid option for the translate plugin.`);
    }
  });

  const mergedOptions = {
    ...defaultOptions,
    ...options,
  };

  const globalProperties = app.config.globalProperties;

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

  app.directive("translate", Directive(plugin));
  app.component("translate", Component);

  globalProperties.$translations = plugin.options.translations;
  const translate = translateRaw(plugin);
  globalProperties.$gettext = translate.gettext.bind(translate);
  globalProperties.$pgettext = translate.pgettext.bind(translate);
  globalProperties.$ngettext = translate.ngettext.bind(translate);
  globalProperties.$npgettext = translate.npgettext.bind(translate);
  globalProperties.$gettextInterpolate = interpolate(plugin);

  app.provide(GetTextSymbol, plugin);
  return plugin;
}

export const useGettext = (): GetText => inject(GetTextSymbol);
