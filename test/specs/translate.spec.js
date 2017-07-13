import Vue from 'vue'

import GetTextPlugin from '../../src/'
import translate from '../../src/translate'
import translations from './json/translate.json'


describe('Translate tests', () => {

  beforeEach(function () {
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
    expect(translated).to.equal('')

    translated = translate.getTranslation('Unexisting language', null, null, null, 'be_FR')
    expect(translated).to.equal('Unexisting language')

    translated = translate.getTranslation('Untranslated key', null, null, null, 'fr_FR')
    expect(translated).to.equal('Untranslated key')

    translated = translate.getTranslation('Pending', 1, null, null, 'fr_FR')
    expect(translated).to.equal('En cours')

    translated = translate.getTranslation('%{ carCount } car', 2, null, null, 'fr_FR')
    expect(translated).to.equal('%{ carCount } véhicules')

    translated = translate.getTranslation('Answer', 1, 'Verb', null, 'fr_FR')
    expect(translated).to.equal('Réponse (verbe)')

    translated = translate.getTranslation('Answer', 1, 'Noun', null, 'fr_FR')
    expect(translated).to.equal('Réponse (nom)')

    translated = translate.getTranslation('Pending', 1, null, null, 'en_US')
    expect(translated).to.equal('Pending')

    // If no translation exists, display the default singular form (if n < 2).
    translated = translate.getTranslation('Untranslated %{ n } item', 0, null, 'Untranslated %{ n } items', 'fr_FR')
    expect(translated).to.equal('Untranslated %{ n } item')

    // If no translation exists, display the default plural form (if n > 1).
    translated = translate.getTranslation('Untranslated %{ n } item', 10, null, 'Untranslated %{ n } items', 'fr_FR')
    expect(translated).to.equal('Untranslated %{ n } items')

    // Test that it works when a msgid exists with and without a context, see #32.
    translated = translate.getTranslation('Object', null, null, null, 'fr_FR')
    expect(translated).to.equal('Objet')
    translated = translate.getTranslation('Object', null, 'Context', null, 'fr_FR')
    expect(translated).to.equal('Objet avec contexte')

    // Ensure that pluralization is right in English when there are no English translations.
    translated = translate.getTranslation('Untranslated %{ n } item', 0, null, 'Untranslated %{ n } items', 'en_US')
    expect(translated).to.equal('Untranslated %{ n } items')
    translated = translate.getTranslation('Untranslated %{ n } item', 1, null, 'Untranslated %{ n } items', 'en_US')
    expect(translated).to.equal('Untranslated %{ n } item')
    translated = translate.getTranslation('Untranslated %{ n } item', 2, null, 'Untranslated %{ n } items', 'en_US')
    expect(translated).to.equal('Untranslated %{ n } items')

  })

  it('tests the gettext() method', () => {

    let undetectableGettext = translate.gettext.bind(translate)  // Hide from xgettext.

    Vue.config.language = 'fr_FR'
    expect(undetectableGettext('Pending')).to.equal('En cours')

    Vue.config.language = 'en_US'
    expect(undetectableGettext('Pending')).to.equal('Pending')

  })

  it('tests the pgettext() method', () => {

    let undetectablePgettext = translate.pgettext.bind(translate)  // Hide from xgettext.

    Vue.config.language = 'fr_FR'
    expect(undetectablePgettext('Noun', 'Answer')).to.equal('Réponse (nom)')

    Vue.config.language = 'en_US'
    expect(undetectablePgettext('Noun', 'Answer')).to.equal('Answer (noun)')

  })

  it('tests the ngettext() method', () => {

    let undetectableNgettext = translate.ngettext.bind(translate)  // Hide from xgettext.

    Vue.config.language = 'fr_FR'
    expect(undetectableNgettext('%{ carCount } car', '%{ carCount } cars', 2)).to.equal('%{ carCount } véhicules')

    Vue.config.language = 'en_US'
    expect(undetectableNgettext('%{ carCount } car', '%{ carCount } cars', 2)).to.equal('%{ carCount } cars')

    // If no translation exists, display the default singular form (if n < 2).
    Vue.config.language = 'fr_FR'
    expect(undetectableNgettext('Untranslated %{ n } item', 'Untranslated %{ n } items', -1))
      .to.equal('Untranslated %{ n } item')

    // If no translation exists, display the default plural form (if n > 1).
    Vue.config.language = 'fr_FR'
    expect(undetectableNgettext('Untranslated %{ n } item', 'Untranslated %{ n } items', 2))
      .to.equal('Untranslated %{ n } items')

  })

  it('tests the npgettext() method', () => {

    let undetectableNpgettext = translate.npgettext.bind(translate)  // Hide from xgettext.

    Vue.config.language = 'fr_FR'
    expect(undetectableNpgettext('Noun', '%{ carCount } car (noun)', '%{ carCount } cars (noun)', 2))
      .to.equal('%{ carCount } véhicules (nom)')

    Vue.config.language = 'en_US'
    expect(undetectableNpgettext('Verb', '%{ carCount } car (verb)', '%{ carCount } cars (verb)', 2))
      .to.equal('%{ carCount } cars (verb)')

    Vue.config.language = 'fr_FR'
    expect(undetectableNpgettext('Noun', '%{ carCount } car (noun)', '%{ carCount } cars (noun)', 1))
      .to.equal('%{ carCount } véhicule (nom)')

    Vue.config.language = 'en_US'
    expect(undetectableNpgettext('Verb', '%{ carCount } car (verb)', '%{ carCount } cars (verb)', 1))
      .to.equal('%{ carCount } car (verb)')

    // If no translation exists, display the default singular form (if n < 2).
    Vue.config.language = 'fr_FR'
    expect(undetectableNpgettext('Noun', 'Untranslated %{ n } item (noun)', 'Untranslated %{ n } items (noun)', 1))
      .to.equal('Untranslated %{ n } item (noun)')

    // If no translation exists, display the default plural form (if n > 1).
    Vue.config.language = 'fr_FR'
    expect(undetectableNpgettext('Noun', 'Untranslated %{ n } item (noun)', 'Untranslated %{ n } items (noun)', 2))
      .to.equal('Untranslated %{ n } items (noun)')

  })

})
