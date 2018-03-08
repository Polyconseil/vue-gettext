export default function (Vue, languageVm, getTextPluginSilent, muteLanguages) {

  /*
   * Adds a `language` property to `Vue.config` and makes it reactive:
   * Vue.config.language = 'fr_FR'
   */
  Object.defineProperty(Vue.config, 'language', {
    enumerable: true,
    configurable: true,
    get: () => { return languageVm.current },
    set: (val) => { languageVm.current = val },
  })

 /*
  * Adds a `getTextPluginSilent` property to `Vue.config`.
  * Used to enable/disable some console warnings globally.
  */
  Object.defineProperty(Vue.config, 'getTextPluginSilent', {
    enumerable: true,
    writable: true,
    value: getTextPluginSilent,
  })

 /*
  * Adds a `getTextPluginMuteLanguages` property to `Vue.config`.
  * Used to enable/disable some console warnings for a specific set of languages.
  */
  Object.defineProperty(Vue.config, 'getTextPluginMuteLanguages', {
    enumerable: true,
    writable: true,
    value: muteLanguages,  // Stores an array of languages for which the warnings are disabled.
  })

}
