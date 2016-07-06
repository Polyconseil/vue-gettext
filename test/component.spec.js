import Vue from 'vue'

import GetTextPlugin from '../src/'
import translations from './component.translations.json'

describe('get-text component tests', () => {

  beforeAll(function () {
    GetTextPlugin.installed = false
    Vue.use(GetTextPlugin, {
      availableLanguages: {
        en_US: 'American English',
        fr_FR: 'Français',
      },
      defaultLanguage: 'en_US',
      translations: translations,
    })
  })

  it('works on empty strings', () => {
    let vm = new Vue({template: '<div><get-text></get-text></div>'}).$mount()
    expect(vm.$el.innerHTML.trim()).toBe('')
  })

  it('returns an unchanged string when no translation is available for a language', () => {
    console.warn = jasmine.createSpy('warn')
    let vm = new Vue({template: '<div><get-text>Unchanged string</get-text></div>'}).$mount()
    vm.$language.current = 'fr_BE'
    expect(vm.$el.innerHTML.trim()).toBe('Unchanged string')
    expect(console.warn).toHaveBeenCalled()
  })

  it('returns an unchanged string when no translation key is available', () => {
    console.warn = jasmine.createSpy('warn')
    let vm = new Vue({template: '<div><get-text>Untranslated string</get-text></div>'}).$mount()
    expect(vm.$el.innerHTML.trim()).toBe('Untranslated string')
    expect(console.warn).toHaveBeenCalled()
  })

  it('translates known strings', () => {
    Vue.config.language = 'fr_FR'
    let vm = new Vue({template: '<div><get-text>Pending</get-text></div>'}).$mount()
    expect(vm.$el.innerHTML.trim()).toBe('En cours')
  })

  it('translates known strings according to a given translation context', () => {
    Vue.config.language = 'en_US'
    let vm = new Vue({template: '<div><get-text translate-context="Verb">Answer</get-text></div>'}).$mount()
    expect(vm.$el.innerHTML.trim()).toBe('Answer (verb)')
    vm = new Vue({template: '<div><get-text translate-context="Noun">Answer</get-text></div>'}).$mount()
    expect(vm.$el.innerHTML.trim()).toBe('Answer (noun)')
  })

  it('allows interpolation', () => {
    Vue.config.language = 'fr_FR'
    let vm = new Vue({
      template: '<p><get-text>Hello {{ name }}</get-text></p>',
      data: {name: 'John Doe'},
    }).$mount()
    expect(vm.$el.innerHTML.trim()).toBe('Bonjour John Doe')
  })

  it('translates plurals', () => {
    Vue.config.language = 'fr_FR'
    let vm = new Vue({
      template: `<p>
        <get-text :translate-n="count" translate-plural="{{ count }} cars">{{ count }} car</get-text>
      </p>`,
      data: {count: 2},
    }).$mount()
    expect(vm.$el.innerHTML.trim()).toBe('2 véhicules')
  })

  it('updates a plural translation after a data change', (done) => {
    Vue.config.language = 'fr_FR'
    let vm = new Vue({
      template: `<p>
        <get-text :translate-n="count" translate-plural="{{ count }} cars">{{ count }} car</get-text>
      </p>`,
      data: {count: 10},
    }).$mount()
    expect(vm.$el.innerHTML.trim()).toBe('10 véhicules')
    vm.count = 8
    vm.$nextTick(function () {
      expect(vm.$el.innerHTML.trim()).toBe('8 véhicules')
      done()
    })
  })

  it('updates a translation after a language change', (done) => {
    Vue.config.language = 'fr_FR'
    let vm = new Vue({template: '<div><get-text>Pending</get-text></div>'}).$mount()
    expect(vm.$el.innerHTML.trim()).toBe('En cours')
    Vue.config.language = 'en_US'
    vm.$nextTick(function () {
      expect(vm.$el.innerHTML.trim()).toBe('Pending')
      done()
    })
  })

  it('throws an error if you forget to add a `translate-plural` attribute', () => {
    expect(function () {
      return new Vue({
        template: '<span><get-text :translate-n="n">{{ n }} car</get-text></span>',
        data: {n: 2},
      }).$mount()
    }).toThrowError('`translate-n` and `translate-plural` attributes must be used together: {{ n }} car.')
  })

  it('throws an error if you forget to add a `translate-n` attribute', () => {
    expect(function () {
      return new Vue({
        template: '<p><get-text translate-plural="{{ n }} cars">{{ n }} car</get-text></p>',
      }).$mount()
    }).toThrowError('`translate-n` and `translate-plural` attributes must be used together: {{ n }} car.')
  })

})
