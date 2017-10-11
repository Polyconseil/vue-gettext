import Vue from 'vue'

import GetTextPlugin from '../../src/'
import translations from './json/plugin.config.json'
import uninstallPlugin from '../testUtils'


describe('GetText plugin configuration tests', () => {

  beforeEach(function () {
    uninstallPlugin(Vue, GetTextPlugin)
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

describe('GetText plugin `silent` option tests', () => {

  beforeEach(function () {
    uninstallPlugin(Vue, GetTextPlugin)
  })

  it('warnings are ON for a missing language when `silent` is false', () => {
    console.warn = sinon.spy(console, 'warn')
    Vue.use(GetTextPlugin, {
      translations: translations,
      silent: false,
    })
    Vue.config.language = 'pt_BR'
    expect(translations.hasOwnProperty('pt_BR')).to.be.false
    let vm = new Vue({template: '<div><translate>Bar</translate></div>'}).$mount()
    expect(vm.$el.innerHTML.trim()).to.equal('<span>Bar</span>')
    expect(console.warn).calledOnce
    expect(console.warn.calledWith('No translations found for pt_BR')).to.be.true
    console.warn.restore()
  })

  it('warnings are OFF for a missing language when `silent` is true', () => {
    console.warn = sinon.spy(console, 'warn')
    Vue.use(GetTextPlugin, {
      translations: translations,
      silent: true,
    })
    Vue.config.language = 'pt_BR'
    expect(translations.hasOwnProperty('pt_BR')).to.be.false
    let vm = new Vue({template: '<div><translate>Bar</translate></div>'}).$mount()
    expect(vm.$el.innerHTML.trim()).to.equal('<span>Bar</span>')
    expect(console.warn).notCalled
    console.warn.restore()
  })

  it('warnings are ON for a missing translation key when `silent` is false', () => {
    console.warn = sinon.spy(console, 'warn')
    Vue.use(GetTextPlugin, {
      translations: translations,
      silent: false,
    })
    Vue.config.language = 'fr_FR'
    let vm = new Vue({template: '<div><translate>Bar</translate></div>'}).$mount()
    expect(translations.fr_FR.hasOwnProperty('Bar')).to.be.false
    expect(vm.$el.innerHTML.trim()).to.equal('<span>Bar</span>')
    expect(console.warn).calledOnce
    expect(console.warn.calledWith('Untranslated fr_FR key found:\nBar')).to.be.true
    console.warn.restore()
  })

  it('warnings are OFF for a missing translation key when `silent` is true', () => {
    console.warn = sinon.spy(console, 'warn')
    Vue.use(GetTextPlugin, {
      translations: translations,
      silent: true,
    })
    Vue.config.language = 'fr_FR'
    let vm = new Vue({template: '<div><translate>Bar</translate></div>'}).$mount()
    expect(translations.fr_FR.hasOwnProperty('Bar')).to.be.false
    expect(vm.$el.innerHTML.trim()).to.equal('<span>Bar</span>')
    expect(console.warn).notCalled
    console.warn.restore()
  })

})
