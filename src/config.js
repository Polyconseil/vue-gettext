export default function (Vue, languageVm, getTextPluginSilent) {

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

}
