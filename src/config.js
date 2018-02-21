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
  * Used to enable/disable some console warnings.
  */
  Object.defineProperty(Vue.config, 'getTextPluginSilent', {
    enumerable: true,
    writable: true,
    value: getTextPluginSilent,
  })

 /*
  * Adds a `isCurrentLanguageMute` property to `Vue.config`.
  * Used to enable/disable some console warnings depending on muted language parameters.
  */
  Object.defineProperty(Vue.config, 'getTextPluginIsCurrentLanguageMute', {
    enumerable: true,
    configurable: true,
    get: () => { return muteLanguages.indexOf(languageVm.current) !== -1 },
  })

}
