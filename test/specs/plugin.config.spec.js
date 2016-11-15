import Vue from 'vue'

import GetTextPlugin from '../../src/'


describe('GetText plugin configuration tests', () => {

  beforeEach(function () {
    GetTextPlugin.installed = false
  })

  it('raises an error when an unknown option is used', () => {
    expect(function () {
      Vue.use(GetTextPlugin, { unknownOption: null, translations: {} })
    }).to.throw('unknownOption is an invalid option for the translate plugin.')
  })

  it('raises an error when there are no translations', () => {
    expect(function () {
      Vue.use(GetTextPlugin, {})
    }).to.throw('No translations available.')
  })

  it('allows to add a mixin to languageVm', () => {
    Vue.use(GetTextPlugin, {
      availableLanguages: {
        en_GB: 'English',
        fr_FR: 'Français',
      },
      defaultLanguage: 'fr_FR',
      translations: {},
      languageVmMixin: {
        computed: {
          currentKebabCase: function () {
            return this.current.toLowerCase().replace('_', '-')
          },
        },
      },
    })
    let vm = new Vue({template: '<div>Foo</div>'}).$mount()
    expect(vm.$language.currentKebabCase).to.equal('fr-fr')
    vm.$language.current = 'en_GB'
    expect(vm.$language.currentKebabCase).to.equal('en-gb')
  })

})
