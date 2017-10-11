// Provide a way to uninstall the GetTextPlugin between each unit test.

let uninstallPlugin = function (Vue, Plugin) {
  if (Vue.hasOwnProperty('_installedPlugins')) {
    // The way to do this has changed over time, see:
    // https://github.com/vuejs/vue/commit/049f31#diff-df137982016aef85f3594216a4c9a295
    Vue._installedPlugins = []
  } else {
    // Could also be `._installed` for some Vue versions
    // https://github.com/vuejs/vue/commit/b4dd0b#diff-df137982016aef85f3594216a4c9a295
    Plugin.installed = false
  }
}

export default uninstallPlugin
