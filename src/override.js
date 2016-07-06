export default function (Vue, languageVm) {

  // Override the main init sequence. This is called for every instance.
  const init = Vue.prototype._init
  Vue.prototype._init = function (options = {}) {
    const root = options._parent || options.parent || this
    // Expose languageVm to every instance.
    this.$language = root.$language || languageVm
    init.call(this, options)
  }

  // Override the main destroy sequence to destroy all languageVm watchers.
  const destroy = Vue.prototype._destroy
  Vue.prototype._destroy = function () {
    this.$language = null
    destroy.apply(this, arguments)
  }

}
