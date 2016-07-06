import Vue from 'vue'

import GetTextPlugin from '../src/'
import translate from '../src/translate'
import translations from './translate.translations.json'

describe('Translate utils tests', () => {

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

  let translated

  it('tests the getTranslation() method', () => {

    translated = translate.getTranslation('', 1, null, 'fr_FR')
    expect(translated).toBe('')

    translated = translate.getTranslation('Unexisting language', null, null, 'be_FR')
    expect(translated).toBe('Unexisting language')

    translated = translate.getTranslation('Untranslated key', null, null, 'fr_FR')
    expect(translated).toBe('Untranslated key')

    translated = translate.getTranslation('Pending', 1, null, 'fr_FR')
    expect(translated).toBe('En cours')

    translated = translate.getTranslation('{{ carCount }} car', 2, null, 'fr_FR')
    expect(translated).toBe('{{ carCount }} véhicules')

    translated = translate.getTranslation('Answer', 1, 'Verb', 'fr_FR')
    expect(translated).toBe('Réponse (verbe)')

    translated = translate.getTranslation('Answer', 1, 'Noun', 'fr_FR')
    expect(translated).toBe('Réponse (nom)')

    translated = translate.getTranslation('Pending', 1, null, 'en_US')
    expect(translated).toBe('Pending')

  })

  it('tests the gettext() method', () => {

    let undetectableGettext = translate.gettext.bind(translate)  // Hide from xgettext.

    Vue.config.language = 'fr_FR'
    expect(undetectableGettext('Pending')).toBe('En cours')

    Vue.config.language = 'en_US'
    expect(undetectableGettext('Pending')).toBe('Pending')

  })

  it('tests the pgettext() method', () => {

    let undetectablePgettext = translate.pgettext.bind(translate)  // Hide from xgettext.

    Vue.config.language = 'fr_FR'
    expect(undetectablePgettext('Noun', 'Answer')).toBe('Réponse (nom)')

    Vue.config.language = 'en_US'
    expect(undetectablePgettext('Noun', 'Answer')).toBe('Answer (noun)')

  })

  it('tests the ngettext() method', () => {

    let undetectableNgettext = translate.ngettext.bind(translate)  // Hide from xgettext.

    Vue.config.language = 'fr_FR'
    expect(undetectableNgettext('{{ carCount }} car', '{{ carCount }} cars', 2)).toBe('{{ carCount }} véhicules')

    Vue.config.language = 'en_US'
    expect(undetectableNgettext('{{ carCount }} car', '{{ carCount }} cars', 2)).toBe('{{ carCount }} cars')

  })

  it('tests the npgettext() method', () => {

    let undetectableNpgettext = translate.npgettext.bind(translate)  // Hide from xgettext.

    Vue.config.language = 'fr_FR'
    expect(undetectableNpgettext('Noun', '{{ carCount }} car (noun)', '{{ carCount }} cars (noun)', 2))
      .toBe('{{ carCount }} véhicules (nom)')

    Vue.config.language = 'en_US'
    expect(undetectableNpgettext('Verb', '{{ carCount }} car (verb)', '{{ carCount }} cars (verb)', 2))
      .toBe('{{ carCount }} cars (verb)')

    Vue.config.language = 'fr_FR'
    expect(undetectableNpgettext('Noun', '{{ carCount }} car (noun)', '{{ carCount }} cars (noun)', 1))
      .toBe('{{ carCount }} véhicule (nom)')

    Vue.config.language = 'en_US'
    expect(undetectableNpgettext('Verb', '{{ carCount }} car (verb)', '{{ carCount }} cars (verb)', 1))
      .toBe('{{ carCount }} car (verb)')

  })

})
